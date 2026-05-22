import * as Cesium from 'cesium';

/**
 * 碎片散布效果 - 坠毁后在地面创建残骸区
 */
export class DebrisField {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
  }

  /**
   * 在坠毁点创建碎片散落区域
   * @param {number} longitude
   * @param {number} latitude
   * @param {number} count - 碎片数量
   */
  create(longitude, latitude, count = 40) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 300; // 散布半径 300m
      const earthRad = 111320;
      const cosLat = Math.cos(Cesium.Math.toRadians(latitude));

      const dLon = (dist * Math.cos(angle)) / (earthRad * cosLat);
      const dLat = (dist * Math.sin(angle)) / earthRad;

      const size = 2 + Math.random() * 8;
      const alpha = 0.4 + Math.random() * 0.5;

      const debris = this.viewer.entities.add({
        name: `残骸 #${i}`,
        position: Cesium.Cartesian3.fromDegrees(
          longitude + dLon,
          latitude + dLat,
          2 + Math.random() * 5
        ),
        point: {
          pixelSize: size,
          color: Cesium.Color.fromRandom({ alpha: alpha }),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      });
      this.entities.push(debris);
    }

    // 撞击坑标记 (黑色圆形区域)
    const crater = this.viewer.entities.add({
      name: '坠毁坑',
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
      ellipse: {
        semiMajorAxis: 60,
        semiMinorAxis: 60,
        material: Cesium.Color.BLACK.withAlpha(0.5),
      },
    });
    this.entities.push(crater);

    // 外圈烧焦痕迹
    const scorch = this.viewer.entities.add({
      name: '烧焦区域',
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
      ellipse: {
        semiMajorAxis: 1,
        semiMinorAxis: 1,
        material: Cesium.Color.BLACK.withAlpha(0.3),
      },
    });

    // 烧焦区域逐渐扩大动画
    const startTime = performance.now();
    this._expandInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const radius = Math.min(200, elapsed * 40);
      scorch.ellipse.semiMajorAxis = radius;
      scorch.ellipse.semiMinorAxis = radius;
      if (elapsed > 5) clearInterval(this._expandInterval);
    }, 100);

    this.entities.push(scorch);

    return this.entities;
  }

  /**
   * 清理碎片
   */
  destroy() {
    if (this._expandInterval) {
      clearInterval(this._expandInterval);
      this._expandInterval = null;
    }
    for (const e of this.entities) {
      this.viewer.entities.remove(e);
    }
    this.entities = [];
  }
}
