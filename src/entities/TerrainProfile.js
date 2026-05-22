import * as Cesium from 'cesium';
import { flightPath, crashPath } from '../mock/flightData.js';

/**
 * 地形剖面 — 采样飞行路径的地表高度并可视化
 */
export class TerrainProfile {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.groundElevations = []; // 采样到的地表高度
    this.isReady = false;
  }

  /**
   * 异步采样地表高度并创建剖面可视化
   */
  async build() {
    const allPoints = [...flightPath, ...crashPath.filter(
      p => p.time > flightPath[flightPath.length - 1].time
    )];

    // 提取采样坐标 (间隔采样, 减少请求)
    const sampleInterval = Math.max(1, Math.floor(allPoints.length / 30));
    const samplePoints = allPoints.filter((_, i) => i % sampleInterval === 0);

    // 准备采样请求
    const cartoPositions = samplePoints.map(
      pt => Cesium.Cartographic.fromDegrees(pt.lon, pt.lat)
    );

    try {
      // 采样最详细的地形高度
      const updatedPositions = await Cesium.sampleTerrainMostDetailed(
        this.viewer.terrainProvider,
        cartoPositions
      );

      this.groundElevations = updatedPositions.map((carto, i) => ({
        lon: Cesium.Math.toDegrees(carto.longitude),
        lat: Cesium.Math.toDegrees(carto.latitude),
        groundAlt: carto.height,
        flightAlt: samplePoints[i].alt,
      }));

      this.isReady = true;
      console.log(`地形采样完成: ${this.groundElevations.length} 个点, `
        + `地表高度范围 ${this._minAlt().toFixed(0)}m ~ ${this._maxAlt().toFixed(0)}m`);

      // 绘制地表剖面
      this._drawGroundProfile();
      // 标记最高点和最低点
      this._markExtremes();

    } catch (err) {
      console.warn('地形采样失败 (可能 DEM 数据未覆盖该区域):', err.message);
    }
  }

  // 绘制地表高度剖面线
  _drawGroundProfile() {
    if (this.groundElevations.length < 2) return;

    const positions = this.groundElevations.map(
      p => Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.groundAlt + 20)
    );

    const line = this.viewer.entities.add({
      name: '地表剖面',
      polyline: {
        positions: positions,
        width: 4,
        material: new Cesium.PolylineOutlineMaterialProperty({
          color: Cesium.Color.ORANGE.withAlpha(0.8),
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
        }),
        clampToGround: false,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 100000),
      },
    });
    this.entities.push(line);

    // 垂直连线: 展示飞行高度与地表高度的差异
    for (const pt of this.groundElevations) {
      const topPos = Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, pt.flightAlt);
      const bottomPos = Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, pt.groundAlt + 5);
      const vertLine = this.viewer.entities.add({
        name: '高度差',
        polyline: {
          positions: [bottomPos, topPos],
          width: 1,
          material: Cesium.Color.WHITE.withAlpha(0.15),
          clampToGround: false,
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 80000),
        },
      });
      this.entities.push(vertLine);
    }
  }

  // 标记最高/最低点
  _markExtremes() {
    let minPt = this.groundElevations[0];
    let maxPt = this.groundElevations[0];
    for (const p of this.groundElevations) {
      if (p.groundAlt < minPt.groundAlt) minPt = p;
      if (p.groundAlt > maxPt.groundAlt) maxPt = p;
    }

    // 最高点
    const maxEntity = this.viewer.entities.add({
      name: '最高点',
      position: Cesium.Cartesian3.fromDegrees(maxPt.lon, maxPt.lat, maxPt.groundAlt + 100),
      point: {
        pixelSize: 8,
        color: Cesium.Color.RED,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `▲ ${maxPt.groundAlt.toFixed(0)}m`,
        font: '12px Microsoft YaHei',
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    this.entities.push(maxEntity);

    // 最低点
    const minEntity = this.viewer.entities.add({
      name: '最低点',
      position: Cesium.Cartesian3.fromDegrees(minPt.lon, minPt.lat, minPt.groundAlt + 100),
      point: {
        pixelSize: 8,
        color: Cesium.Color.CYAN,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `▼ ${minPt.groundAlt.toFixed(0)}m`,
        font: '12px Microsoft YaHei',
        fillColor: Cesium.Color.CYAN,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -16),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    this.entities.push(minEntity);
  }

  _minAlt() { return Math.min(...this.groundElevations.map(p => p.groundAlt)); }
  _maxAlt() { return Math.max(...this.groundElevations.map(p => p.groundAlt)); }

  destroy() {
    for (const e of this.entities) {
      this.viewer.entities.remove(e);
    }
    this.entities = [];
    this.groundElevations = [];
    this.isReady = false;
  }
}
