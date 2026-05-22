import * as Cesium from 'cesium';

/**
 * 雷电效果管理器
 * 在云层和地面之间随机生成闪电
 */
export class LightningEffect {
  constructor(viewer, center = { lon: 117.5, lat: 39.3 }) {
    this.viewer = viewer;
    this.center = center;
    this.entities = [];
    this.activeBolts = [];
    this.timer = null;
  }

  /**
   * 开始雷电效果 (按随机间隔触发)
   * @param {number} minInterval - 最小间隔 (秒)
   * @param {number} maxInterval - 最大间隔 (秒)
   */
  start(minInterval = 2, maxInterval = 8) {
    this.stop();
    this._scheduleNext(minInterval, maxInterval);
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.clearAll();
  }

  // 触发一次闪电
  trigger() {
    const boltEntities = [];
    const flashPoints = [];

    // 起始点：云层高度随机位置
    const startLon = this.center.lon + (Math.random() - 0.5) * 0.5;
    const startLat = this.center.lat + (Math.random() - 0.5) * 0.3;
    const startAlt = 5000 + Math.random() * 4000;
    // 终点：地面
    const endLon = startLon + (Math.random() - 0.5) * 0.05;
    const endLat = startLat + (Math.random() - 0.5) * 0.05;
    const endAlt = 0;

    // 生成锯齿形闪电路径
    const segments = 5 + Math.floor(Math.random() * 8);
    const positions = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const lon = Cesium.Math.lerp(startLon, endLon, t) + (Math.random() - 0.5) * 0.02;
      const lat = Cesium.Math.lerp(startLat, endLat, t) + (Math.random() - 0.5) * 0.01;
      const alt = Cesium.Math.lerp(startAlt, endAlt, t);
      positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, alt));
    }

    // 主闪电
    const bolt = this.viewer.entities.add({
      name: '闪电',
      polyline: {
        positions: positions,
        width: 3,
        material: Cesium.Color.CYAN.withAlpha(0.9),
        clampToGround: false,
      },
    });
    boltEntities.push(bolt);

    // 发光外层
    const glow = this.viewer.entities.add({
      name: '闪电光晕',
      polyline: {
        positions: positions,
        width: 8,
        material: Cesium.Color.WHITE.withAlpha(0.3),
        clampToGround: false,
      },
    });
    boltEntities.push(glow);

    // 起始闪光点
    const flashPoint = this.viewer.entities.add({
      name: '闪电闪光',
      position: Cesium.Cartesian3.fromDegrees(startLon, startLat, startAlt + 100),
      point: {
        pixelSize: 40,
        color: Cesium.Color.WHITE.withAlpha(0.8),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    boltEntities.push(flashPoint);
    flashPoints.push(flashPoint);

    // 末端闪光
    const flashEnd = this.viewer.entities.add({
      name: '闪电末端',
      position: Cesium.Cartesian3.fromDegrees(endLon, endLat, endAlt + 50),
      point: {
        pixelSize: 25,
        color: Cesium.Color.CYAN.withAlpha(0.6),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    boltEntities.push(flashEnd);
    flashPoints.push(flashEnd);

    this.activeBolts.push(boltEntities);

    // 闪电闪烁效果 - 0.2 秒后衰减
    setTimeout(() => {
      for (const e of flashPoints) {
        if (e.point) {
          e.point.pixelSize = 15;
          e.point.color = Cesium.Color.WHITE.withAlpha(0.3);
        }
      }
    }, 100);

    // 0.5 秒后移除
    setTimeout(() => {
      this.removeBolt(boltEntities);
    }, 500);

    return boltEntities;
  }

  removeBolt(boltEntities) {
    for (const e of boltEntities) {
      this.viewer.entities.remove(e);
    }
    const idx = this.activeBolts.indexOf(boltEntities);
    if (idx > -1) this.activeBolts.splice(idx, 1);
  }

  clearAll() {
    for (const bolt of [...this.activeBolts]) {
      this.removeBolt(bolt);
    }
  }

  _scheduleNext(min, max) {
    const delay = (min + Math.random() * (max - min)) * 1000;
    this.timer = setTimeout(() => {
      this.trigger();
      this._scheduleNext(min, max);
    }, delay);
  }
}
