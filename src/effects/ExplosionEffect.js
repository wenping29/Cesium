import * as Cesium from 'cesium';

/**
 * 爆炸粒子效果 - 飞机坠毁时的火球+烟雾
 */
export class ExplosionEffect {
  constructor(viewer) {
    this.viewer = viewer;
    this.fireSystem = null;
    this.smokeSystem = null;
    this.sparkSystem = null;
  }

  /**
   * 在指定位置触发爆炸
   * @param {number} longitude
   * @param {number} latitude
   */
  trigger(longitude, latitude) {
    const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 50);
    const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

    // 火焰粒子
    this.fireSystem = this.viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: this._createFireTexture(),
        startColor: Cesium.Color.ORANGERED.withAlpha(0.9),
        endColor: Cesium.Color.YELLOW.withAlpha(0.0),
        startScale: 15,
        endScale: 45,
        minimumParticleLife: 0.5,
        maximumParticleLife: 2.0,
        minimumSpeed: 30,
        maximumSpeed: 80,
        emissionRate: 80,
        bursts: [
          new Cesium.ParticleBurst({ time: 0, minimum: 60, maximum: 100 }),
          new Cesium.ParticleBurst({ time: 0.5, minimum: 20, maximum: 40 }),
          new Cesium.ParticleBurst({ time: 1.0, minimum: 5, maximum: 15 }),
        ],
        lifetime: 3.0,
        emitter: new Cesium.SphereEmitter(20),
        emitterModelMatrix: modelMatrix,
        sizeInMeters: true,
      })
    );

    // 浓烟粒子
    this.smokeSystem = this.viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: this._createSmokeTexture(),
        startColor: Cesium.Color.DARKGRAY.withAlpha(0.8),
        endColor: Cesium.Color.BLACK.withAlpha(0.0),
        startScale: 25,
        endScale: 80,
        minimumParticleLife: 2.0,
        maximumParticleLife: 6.0,
        minimumSpeed: 10,
        maximumSpeed: 30,
        emissionRate: 30,
        bursts: [
          new Cesium.ParticleBurst({ time: 0, minimum: 20, maximum: 40 }),
          new Cesium.ParticleBurst({ time: 1.0, minimum: 10, maximum: 20 }),
        ],
        lifetime: 15.0,
        emitter: new Cesium.CircleEmitter(25),
        emitterModelMatrix: modelMatrix,
        sizeInMeters: true,
        updateCallback: (particle, dt) => {
          // 烟雾上升
          particle.position = Cesium.Cartesian3.add(
            particle.position,
            Cesium.Cartesian3.multiplyByScalar(Cesium.Cartesian3.UNIT_Z, 10 * dt, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
          );
        },
      })
    );

    // 火花碎片
    this.sparkSystem = this.viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: this._createSparkTexture(),
        startColor: Cesium.Color.WHITE.withAlpha(0.9),
        endColor: Cesium.Color.ORANGE.withAlpha(0.1),
        startScale: 3,
        endScale: 1,
        minimumParticleLife: 0.3,
        maximumParticleLife: 1.5,
        minimumSpeed: 50,
        maximumSpeed: 150,
        emissionRate: 0,
        bursts: [
          new Cesium.ParticleBurst({ time: 0, minimum: 100, maximum: 200 }),
        ],
        lifetime: 2.0,
        emitter: new Cesium.SphereEmitter(15),
        emitterModelMatrix: modelMatrix,
        sizeInMeters: true,
      })
    );

    // 地面上创建火光点 (持续存在)
    this.firePoint = this.viewer.entities.add({
      name: '坠毁火光',
      position: position,
      point: {
        pixelSize: 60,
        color: Cesium.Color.ORANGERED.withAlpha(0.9),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 500000, 0.2),
      },
    });
  }

  /**
   * 停止并清理爆炸效果
   */
  destroy() {
    [this.fireSystem, this.smokeSystem, this.sparkSystem].forEach(sys => {
      if (sys) {
        this.viewer.scene.primitives.remove(sys);
      }
    });
    this.fireSystem = null;
    this.smokeSystem = null;
    this.sparkSystem = null;

    if (this.firePoint) {
      this.viewer.entities.remove(this.firePoint);
      this.firePoint = null;
    }
  }

  _createFireTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.95)');
    gradient.addColorStop(0.2, 'rgba(255, 200, 50, 0.85)');
    gradient.addColorStop(0.5, 'rgba(255, 100, 20, 0.5)');
    gradient.addColorStop(0.8, 'rgba(200, 20, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return canvas.toDataURL();
  }

  _createSmokeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(60, 60, 60, 0.8)');
    gradient.addColorStop(0.4, 'rgba(40, 40, 40, 0.4)');
    gradient.addColorStop(0.7, 'rgba(20, 20, 20, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return canvas.toDataURL();
  }

  _createSparkTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    return canvas.toDataURL();
  }
}
