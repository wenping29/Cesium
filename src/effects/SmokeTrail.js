import * as Cesium from 'cesium';

/**
 * 烟雾拖尾效果 - 飞机坠落时尾部产生黑烟
 */
export class SmokeTrail {
  constructor(viewer) {
    this.viewer = viewer;
    this.particleSystem = null;
    this.airplane = null;
    this.active = false;
  }

  /**
   * 启动烟雾拖尾
   * @param {Object} airplane - Airplane 实例
   */
  start(airplane) {
    if (this.active) return;
    this.active = true;
    this.airplane = airplane;

    const self = this;

    this.particleSystem = this.viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: this._createSmokeTexture(),
        startColor: Cesium.Color.GRAY.withAlpha(0.7),
        endColor: Cesium.Color.DARKGRAY.withAlpha(0.0),
        startScale: 20,
        endScale: 60,
        minimumParticleLife: 1.2,
        maximumParticleLife: 3.0,
        minimumSpeed: 5,
        maximumSpeed: 20,
        emissionRate: 40,
        emitter: new Cesium.CircleEmitter(15),
        emitterModelMatrix: new Cesium.CallbackProperty(() => {
          const pos = self._getSmokePosition();
          return Cesium.Transforms.eastNorthUpToFixedFrame(pos);
        }, false),
        lifetime: 30,
        sizeInMeters: true,
      })
    );
  }

  _getSmokePosition() {
    if (!this.airplane || !this.airplane.entity || !this.airplane.entity.position) {
      return Cesium.Cartesian3.fromDegrees(117.6, 39.2, 5000);
    }
    // 直接从 entity.position 获取 (CallbackProperty 不依赖时间参数)
    const pos = this.airplane.entity.position.getValue();
    if (!pos) return Cesium.Cartesian3.fromDegrees(117.6, 39.2, 5000);

    const cartographic = Cesium.Cartographic.fromCartesian(pos);
    // 尾部偏移
    return Cesium.Cartesian3.fromDegrees(
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude) - 0.003,
      Math.max(100, cartographic.height - 200)
    );
  }

  /**
   * 停止烟雾
   */
  stop() {
    this.active = false;
    if (this.particleSystem) {
      this.viewer.scene.primitives.remove(this.particleSystem);
      this.particleSystem = null;
    }
  }

  _createSmokeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(180, 180, 180, 0.8)');
    gradient.addColorStop(0.3, 'rgba(120, 120, 120, 0.5)');
    gradient.addColorStop(0.7, 'rgba(60, 60, 60, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return canvas.toDataURL();
  }
}
