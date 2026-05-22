import * as Cesium from 'cesium';

/**
 * 雷达地形盲区分析
 * - 径向采样地形高度
 * - 结合地球曲率计算视距 (4/3 地球半径大气折射模型)
 * - 可视化雷达覆盖区 (绿) 与盲区 (红)
 */
const R_EFF = 8494667; // 4/3 地球半径 (标准大气折射), 单位 m

export class RadarBlindZone {
  constructor(viewer, station) {
    this.viewer = viewer;
    this.station = station; // { longitude, latitude }
    this.radius = station.radius; // 扫描半径, m
    this.towerHeight = 50; // 雷达塔高度, m

    // 采样参数
    this.azimuthSteps = 60;  // 方位角步数
    this.rangeSteps = 20;    // 每个方位角的距离步数

    this.entities = [];       // 可视化实体
    this.horizonData = null;  // [{azimuth(deg), horizonDist(m), blockH(m)}]
    this.stationGroundH = 0;
    this.radarAmsl = 0;
    this.isReady = false;
    this._building = false;
  }

  // ---- 大圆航线终点计算 ----
  _destPoint(azimuthDeg, distanceM) {
    const lat1 = Cesium.Math.toRadians(this.station.latitude);
    const lon1 = Cesium.Math.toRadians(this.station.longitude);
    const bearing = Cesium.Math.toRadians(azimuthDeg);
    const R = 6371000;
    const dR = distanceM / R;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(dR) +
      Math.cos(lat1) * Math.sin(dR) * Math.cos(bearing)
    );
    const lon2 = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(dR) * Math.cos(lat1),
      Math.cos(dR) - Math.sin(lat1) * Math.sin(lat2)
    );

    return {
      lon: Cesium.Math.toDegrees(lon2),
      lat: Cesium.Math.toDegrees(lat2),
    };
  }

  // ---- 主构建流程 ----
  async build() {
    if (this._building) return;
    this._building = true;

    // 清理旧数据
    this.destroyVisuals();

    try {
      // 1. 采样雷达站地表高度
      const stationCarto = Cesium.Cartographic.fromDegrees(
        this.station.longitude, this.station.latitude
      );
      const [stationSample] = await Cesium.sampleTerrainMostDetailed(
        this.viewer.terrainProvider, [stationCarto]
      );
      this.stationGroundH = stationSample.height;
      this.radarAmsl = this.stationGroundH + this.towerHeight;

      // 2. 构建径向采样网格
      const samplePoints = [];
      for (let a = 0; a < this.azimuthSteps; a++) {
        const azimuth = (a / this.azimuthSteps) * 360;
        for (let r = 1; r <= this.rangeSteps; r++) {
          const dist = (r / this.rangeSteps) * this.radius;
          const { lon, lat } = this._destPoint(azimuth, dist);
          samplePoints.push(Cesium.Cartographic.fromDegrees(lon, lat));
        }
      }

      // 3. 采样地形
      const sampled = await Cesium.sampleTerrainMostDetailed(
        this.viewer.terrainProvider, samplePoints
      );

      // 4. 计算每个方位角的雷达地平线
      this.horizonData = [];
      for (let a = 0; a < this.azimuthSteps; a++) {
        const azimuth = (a / this.azimuthSteps) * 360;
        let horizonDist = this.radius;
        let blockH = 0;

        for (let r = 1; r <= this.rangeSteps; r++) {
          const idx = a * this.rangeSteps + (r - 1);
          const dist = (r / this.rangeSteps) * this.radius;
          const terrainH = sampled[idx].height;
          if (terrainH === undefined || terrainH === null) continue;
          // 视距高度: 雷达海拔 - 地球曲率下降量 (0°仰角波束)
          const losH = this.radarAmsl - (dist * dist) / (2 * R_EFF);

          if (terrainH > losH) {
            // 在前一步与当前步之间线性插值, 找到精确遮挡距离
            const prevDist = ((r - 1) / this.rangeSteps) * this.radius;
            const prevTerrainH = r > 1 ? sampled[idx - 1].height : this.stationGroundH;
            const prevLosH = this.radarAmsl - (prevDist * prevDist) / (2 * R_EFF);
            const currTerrainH = terrainH;
            const currLosH = losH;

            // 线性插值: t 使得 prevTerrain + t*(currTerrain-prevTerrain) = prevLos + t*(currLos-prevLos)
            const dTerr = currTerrainH - prevTerrainH;
            const dLos = currLosH - prevLosH;
            const denom = dTerr - dLos;
            if (Math.abs(denom) > 1e-10) {
              const t = (prevLosH - prevTerrainH) / denom;
              horizonDist = prevDist + t * (dist - prevDist);
            } else {
              horizonDist = prevDist;
            }
            horizonDist = Math.max(0, Math.min(this.radius, horizonDist));
            blockH = terrainH;
            break;
          }
        }
        this.horizonData.push({ azimuth, horizonDist, blockH });
      }

      this.isReady = true;
      this._drawCoverage();
      this._drawBlindZones();
      this._drawHorizonBoundary();
      this.drawMaxRangeCircle();

      const blockedCount = this.horizonData.filter(h => h.horizonDist < this.radius * 0.95).length;
      console.log(`雷达盲区分析完成: ${this.azimuthSteps}个方位, `
        + `${blockedCount}个方向存在遮挡, `
        + `雷达站海拔${this.stationGroundH.toFixed(0)}m + 塔高${this.towerHeight}m`);

    } catch (err) {
      console.warn('雷达盲区分析失败:', err.message);
    } finally {
      this._building = false;
    }
  }

  // ---- 覆盖区 (绿色半透明) ----
  _drawCoverage() {
    if (!this.horizonData) return;

    const positions = [];
    for (const h of this.horizonData) {
      const { lon, lat } = this._destPoint(h.azimuth, h.horizonDist);
      positions.push(lon, lat);
    }

    const entity = this.viewer.entities.add({
      name: '雷达覆盖区',
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(positions)
        ),
        height: 0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        material: Cesium.Color.GREEN.withAlpha(0.15),
        outline: false,
      },
    });
    this.entities.push(entity);
  }

  // ---- 盲区扇形 (红色半透明) ----
  _drawBlindZones() {
    if (!this.horizonData) return;

    // 找到连续被遮挡的方位角区间
    let start = null;
    const ranges = []; // [{startIdx, endIdx}]

    for (let i = 0; i < this.horizonData.length; i++) {
      const blocked = this.horizonData[i].horizonDist < this.radius * 0.95;
      if (blocked && start === null) {
        start = i;
      }
      if (!blocked && start !== null) {
        ranges.push({ startIdx: start, endIdx: i - 1 });
        start = null;
      }
    }
    if (start !== null) {
      ranges.push({ startIdx: start, endIdx: this.horizonData.length - 1 });
    }

    // 为每个连续的遮挡区间创建盲区多边形
    for (const range of ranges) {
      const { startIdx, endIdx } = range;
      const positions = [];

      // 从 startIdx 的地平线点开始
      const hStart = this.horizonData[startIdx];
      const pStart = this._destPoint(hStart.azimuth, hStart.horizonDist);
      positions.push(pStart.lon, pStart.lat);

      // 沿地平线到 endIdx
      for (let i = startIdx + 1; i <= endIdx; i++) {
        const h = this.horizonData[i];
        const p = this._destPoint(h.azimuth, h.horizonDist);
        positions.push(p.lon, p.lat);
      }

      // 沿最大半径圆弧回到 startIdx
      const arcSteps = Math.max(2, (endIdx - startIdx + 1) * 3);
      const azStart = this.horizonData[startIdx].azimuth;
      const azEnd = this.horizonData[endIdx].azimuth;
      // 处理跨 360° 的情况
      let azSpan = azEnd - azStart;
      if (azSpan < 0) azSpan += 360;
      for (let j = arcSteps - 1; j >= 0; j--) {
        const az = azStart + (j / arcSteps) * azSpan;
        const p = this._destPoint(az, this.radius);
        positions.push(p.lon, p.lat);
      }

      const entity = this.viewer.entities.add({
        name: '雷达盲区',
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(
            Cesium.Cartesian3.fromDegreesArray(positions)
          ),
          height: 0,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          material: Cesium.Color.RED.withAlpha(0.20),
          outline: false,
        },
      });
      this.entities.push(entity);
    }

    if (ranges.length > 0) {
      console.log(`检测到 ${ranges.length} 个盲区扇区`);
    }
  }

  // ---- 地平线边界线 ----
  _drawHorizonBoundary() {
    if (!this.horizonData) return;

    const positions = [];
    for (const h of this.horizonData) {
      const { lon, lat } = this._destPoint(h.azimuth, h.horizonDist);
      positions.push(lon, lat, 2);
    }
    // 闭合
    const first = this._destPoint(this.horizonData[0].azimuth, this.horizonData[0].horizonDist);
    positions.push(first.lon, first.lat, 2);

    const entity = this.viewer.entities.add({
      name: '雷达地平线',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW.withAlpha(0.7),
          dashLength: 16,
        }),
        clampToGround: true,
      },
    });
    this.entities.push(entity);
  }

  // ---- 最大扫描范围圆 (用于参考) ----
  drawMaxRangeCircle() {
    const circle = this.viewer.entities.add({
      name: '雷达最大范围',
      position: Cesium.Cartesian3.fromDegrees(
        this.station.longitude, this.station.latitude, 0
      ),
      ellipse: {
        semiMajorAxis: this.radius,
        semiMinorAxis: this.radius,
        height: 0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        material: Cesium.Color.WHITE.withAlpha(0.03),
        outline: true,
        outlineColor: Cesium.Color.WHITE.withAlpha(0.25),
        outlineWidth: 1,
      },
    });
    this.entities.push(circle);
    return circle;
  }

  // ---- 对外接口 ----
  /** 设置扫描半径并重建分析 */
  async setRadius(newRadius) {
    this.radius = newRadius;
    this.station.radius = newRadius;
    await this.build();
  }

  /** 设置雷达部署位置并重建分析 */
  async setStation(lon, lat) {
    this.station.longitude = lon;
    this.station.latitude = lat;
    await this.build();
  }

  /** 设置雷达塔高度并重建分析 */
  async setTowerHeight(h) {
    this.towerHeight = h;
    await this.build();
  }

  /** 获取各方位角的地平线数据 */
  getHorizonData() {
    return this.horizonData;
  }

  /** 清理可视化实体 */
  destroyVisuals() {
    for (const e of this.entities) {
      this.viewer.entities.remove(e);
    }
    this.entities = [];
  }

  /** 完全销毁 */
  destroy() {
    this.destroyVisuals();
    this.horizonData = null;
    this.isReady = false;
  }
}
