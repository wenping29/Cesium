import * as Cesium from 'cesium';

/**
 * 雷达扫描效果
 * - 半球形扫面空间 (半透明穹顶, 紧贴地表)
 * - 旋转垂直扫面扇 (Wall 实体, 模拟雷达波束俯仰扫描)
 * - 雷达站标记
 * - 支持运行时调整位置/高程/半径/开关
 */
export class RadarScan {
  constructor(viewer, station) {
    this.viewer = viewer;
    this.station = station; // { longitude, latitude, radius }
    this.baseHeight = 50;   // 基座高程 (m)
    this.entities = [];
    this.scanFans = [];
    this.angle = 0;
    this.speed = 0;
    this._enabled = true;
    this._showHemisphere = true;
  }

  create() {
    const self = this;

    // 雷达站位置 (动态)
    const stationPos = new Cesium.CallbackProperty(() => {
      return Cesium.Cartesian3.fromDegrees(
        self.station.longitude, self.station.latitude, self.baseHeight
      );
    }, false);

    // 雷达中心点
    this.centerPoint = this.viewer.entities.add({
      name: '雷达站',
      position: stationPos,
      point: {
        pixelSize: 10,
        color: Cesium.Color.LIME,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: '雷达站',
        font: '12px Microsoft YaHei',
        fillColor: Cesium.Color.LIME,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        pixelOffset: new Cesium.Cartesian2(0, -20),
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    this.entities.push(this.centerPoint);

    // 半球形扫描穹顶 (自定义几何体, 仅上半球)
    this._createHemisphereVisuals();

    // 地面参考圆环 (紧贴地表)
    this.groundRing = this.viewer.entities.add({
      name: '雷达扫描范围',
      position: new Cesium.CallbackProperty(() => {
        return Cesium.Cartesian3.fromDegrees(
          self.station.longitude, self.station.latitude, 0
        );
      }, false),
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(() => self.station.radius, false),
        semiMinorAxis: new Cesium.CallbackProperty(() => self.station.radius, false),
        height: 0,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        material: Cesium.Color.LIME.withAlpha(0.04),
        outline: true,
        outlineColor: Cesium.Color.LIME.withAlpha(0.35),
        outlineWidth: 1.5,
      },
    });
    this.entities.push(this.groundRing);

    // 垂直扫描扇面 (8 个旋转的三角形幕墙)
    const fanCount = 8;
    for (let i = 0; i < fanCount; i++) {
      const fanAngle = (i / fanCount) * Math.PI * 2;
      const fan = this._createScanFan(fanAngle);
      this.scanFans.push(fan);
      this.entities.push(fan);
    }

    return this.entities;
  }

  /**
   * 创建一个垂直扫描扇面 (Wall)
   * 三角形幕墙: 雷达站 → 最大半径处, 高度从 scanRadius 渐变到 0
   */
  _createScanFan(initialAngle) {
    const self = this;

    const positions = new Cesium.CallbackProperty(() => {
      const angle = self.angle + initialAngle;
      const earthRad = 111320;
      const centerLon = self.station.longitude;
      const centerLat = self.station.latitude;
      const cosLat = Math.cos(Cesium.Math.toRadians(centerLat));

      const endLon = centerLon + (self.station.radius * Math.cos(angle)) / (earthRad * cosLat);
      const endLat = centerLat + (self.station.radius * Math.sin(angle)) / earthRad;

      return Cesium.Cartesian3.fromDegreesArrayHeights([
        centerLon, centerLat, self.baseHeight,
        endLon, endLat, self.baseHeight,
      ]);
    }, false);

    const maxHeights = new Cesium.CallbackProperty(() => {
      return [self.baseHeight + self.station.radius, self.baseHeight];
    }, false);

    const minHeights = new Cesium.CallbackProperty(() => {
      return [self.baseHeight, self.baseHeight];
    }, false);

    return this.viewer.entities.add({
      name: '扫描扇面',
      wall: {
        positions: positions,
        maximumHeights: maxHeights,
        minimumHeights: minHeights,
        material: Cesium.Color.CYAN.withAlpha(0.06),
        outline: true,
        outlineColor: Cesium.Color.CYAN.withAlpha(0.25),
      },
    });
  }

  // === 对外控制接口 ===

  start(speed = Math.PI / 6) {
    this.speed = speed;
    this._tickHandler = this.viewer.clock.onTick.addEventListener(() => {
      if (this.speed) {
        this.angle += this.speed * 0.016;
      }
    });
  }

  stop() {
    this.speed = 0;
  }

  setEnabled(on) {
    this._enabled = on;
    for (const e of this.entities) {
      e.show = on;
    }
    if (this._hemisphereFill) this._hemisphereFill.show = on && this._showHemisphere;
    if (this._hemisphereWire) this._hemisphereWire.show = on && this._showHemisphere;
  }

  setPosition(lon, lat) {
    this.station.longitude = lon;
    this.station.latitude = lat;
    this._updateHemisphere();
  }

  setBaseHeight(h) {
    this.baseHeight = h;
    this._updateHemisphere();
  }

  setRadius(meters) {
    this.station.radius = meters;
    this._updateHemisphere();
  }

  setShowHemisphere(show) {
    this._showHemisphere = show;
    if (this._hemisphereFill) this._hemisphereFill.show = show && this._enabled;
    if (this._hemisphereWire) this._hemisphereWire.show = show && this._enabled;
  }

  destroy() {
    this.stop();
    if (this._tickHandler) {
      this._tickHandler();
    }
    this._destroyHemisphereVisuals();
    for (const e of this.entities) {
      this.viewer.entities.remove(e);
    }
    this.entities = [];
    this.scanFans = [];
  }

  // === 半球可视化 (自定义几何体 Primitive) ===

  _createHemisphereVisuals() {
    const r = this.station.radius;
    const pos = Cesium.Cartesian3.fromDegrees(
      this.station.longitude, this.station.latitude, this.baseHeight
    );
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(pos);

    // 填充半球
    const fillGeo = _buildHemisphereFill(r, 32, 48);
    this._hemisphereFill = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: fillGeo,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.CYAN.withAlpha(0.05)
            ),
          },
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          flat: true,
        }),
        modelMatrix: modelMatrix,
        asynchronous: false,
        show: this._enabled && this._showHemisphere,
      })
    );

    // 线框半球 (经线 + 纬线)
    const wireGeo = _buildHemisphereWire(r, 12, 4, 20);
    this._hemisphereWire = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: wireGeo,
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.CYAN.withAlpha(0.3)
            ),
          },
        }),
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          flat: true,
        }),
        modelMatrix: modelMatrix,
        asynchronous: false,
        show: this._enabled && this._showHemisphere,
      })
    );
  }

  _destroyHemisphereVisuals() {
    if (this._hemisphereFill) {
      this.viewer.scene.primitives.remove(this._hemisphereFill);
      this._hemisphereFill = null;
    }
    if (this._hemisphereWire) {
      this.viewer.scene.primitives.remove(this._hemisphereWire);
      this._hemisphereWire = null;
    }
  }

  _updateHemisphere() {
    this._destroyHemisphereVisuals();
    this._createHemisphereVisuals();
  }
}

// ---- 模块级辅助函数: 半球几何体生成 ----

/**
 * 生成上半球填充网格 (三角网格)
 */
function _buildHemisphereFill(radius, stacks, slices) {
  const positions = [];
  const indices = [];

  // 北极顶点
  positions.push(0, 0, radius);

  // 纬度环 (从上到下)
  for (let i = 1; i <= stacks; i++) {
    const phi = (Math.PI / 2) * (i / stacks);
    const ringR = radius * Math.sin(phi);
    const z = radius * Math.cos(phi);
    for (let j = 0; j <= slices; j++) {
      const theta = (j / slices) * 2 * Math.PI;
      positions.push(ringR * Math.cos(theta), ringR * Math.sin(theta), z);
    }
  }

  // 北极 → 第一环
  for (let j = 0; j < slices; j++) {
    indices.push(0, 1 + j + 1, 1 + j);
  }

  // 环间三角形带
  for (let i = 0; i < stacks - 1; i++) {
    const ringStart = 1 + i * (slices + 1);
    const nextStart = ringStart + (slices + 1);
    for (let j = 0; j < slices; j++) {
      const a = ringStart + j;
      const b = ringStart + j + 1;
      const c = nextStart + j;
      const d = nextStart + j + 1;
      indices.push(a, c, b);
      indices.push(c, d, b);
    }
  }

  return new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(positions),
      }),
    },
    indices: new Uint32Array(indices),
    primitiveType: Cesium.PrimitiveType.TRIANGLES,
    boundingSphere: Cesium.BoundingSphere.fromVertices(new Float64Array(positions)),
  });
}

/**
 * 生成上半球线框 (经线 + 纬线)
 */
function _buildHemisphereWire(radius, meridianCount, parallelCount, samples) {
  const positions = [];
  const indices = [];

  // 经线
  for (let m = 0; m < meridianCount; m++) {
    const theta = (m / meridianCount) * 2 * Math.PI;
    const start = positions.length / 3;
    for (let s = 0; s <= samples; s++) {
      const phi = (Math.PI / 2) * (s / samples);
      positions.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
    }
    for (let s = 0; s < samples; s++) {
      indices.push(start + s, start + s + 1);
    }
  }

  // 纬线 (不包括赤道, 赤道由 groundRing 表示)
  for (let p = 1; p < parallelCount; p++) {
    const phi = (Math.PI / 2) * (p / parallelCount);
    const ringR = radius * Math.sin(phi);
    const z = radius * Math.cos(phi);
    const start = positions.length / 3;
    const steps = samples * 2;
    for (let s = 0; s <= steps; s++) {
      const theta = (s / steps) * 2 * Math.PI;
      positions.push(ringR * Math.cos(theta), ringR * Math.sin(theta), z);
    }
    for (let s = 0; s < steps; s++) {
      indices.push(start + s, start + s + 1);
    }
  }

  return new Cesium.Geometry({
    attributes: {
      position: new Cesium.GeometryAttribute({
        componentDatatype: Cesium.ComponentDatatype.DOUBLE,
        componentsPerAttribute: 3,
        values: new Float64Array(positions),
      }),
    },
    indices: new Uint32Array(indices),
    primitiveType: Cesium.PrimitiveType.LINES,
    boundingSphere: Cesium.BoundingSphere.fromVertices(new Float64Array(positions)),
  });
}
