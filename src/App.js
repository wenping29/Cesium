import * as Cesium from 'cesium';
import { TIMING, DEFAULT_VIEW } from './config.js';
import { flightPath, crashPath, crashSite } from './mock/flightData.js';
import { airports, radarStation } from './mock/airports.js';
import { flightRoutes } from './mock/routes.js';
import { createAirports } from './entities/Airport.js';
import { createFlightRoutes } from './entities/FlightRoutes.js';
import { createClouds } from './entities/Clouds.js';
import { LightningEffect } from './entities/Lightning.js';
import { RadarScan } from './entities/RadarScan.js';
import { Airplane } from './entities/Airplane.js';
import { SmokeTrail } from './effects/SmokeTrail.js';
import { ExplosionEffect } from './effects/ExplosionEffect.js';
import { DebrisField } from './effects/DebrisField.js';
import { TerrainProfile } from './entities/TerrainProfile.js';
import { RadarBlindZone } from './entities/RadarBlindZone.js';

export class App {
  constructor(viewer) {
    this.viewer = viewer;
    this.status = 'idle';
    this.simTime = 0;
    this.simRunning = false;
    this.animationFrame = null;
    this.startTime = null;
    this.explosionTriggered = false;
    this.debrisCreated = false;
    this.cameraFlewToCrash = false;

    // 场景实体引用
    this.entities = {
      airports: [],
      routes: [],
      clouds: [],
    };

    // 初始化场景
    this._initScene();
    // 绑定控制面板
    this._bindControls();

    console.log('Cesium 飞机失事模拟系统已就绪');
  }

  // === 场景初始化 ===
  _initScene() {
    // 机场
    this.entities.airports = createAirports(this.viewer, airports);

    // 航线
    this.entities.routes = createFlightRoutes(this.viewer, flightRoutes);

    // 云层
    this.entities.clouds = createClouds(this.viewer, 100, { lon: 117.0, lat: 39.5 }, 2.5);

    // 雷电 (初始低频)
    this.lightning = new LightningEffect(this.viewer, { lon: 117.5, lat: 39.3 });
    this.lightning.start(3, 10);

    // 雷达
    this.radar = new RadarScan(this.viewer, radarStation);
    this.radar.create();
    this.radar.start(Math.PI / 3);

    // 飞机
    this.airplane = new Airplane(this.viewer);

    // 烟雾拖尾
    this.smokeTrail = new SmokeTrail(this.viewer);

    // 爆炸效果
    this.explosion = new ExplosionEffect(this.viewer);

    // 碎片
    this.debris = new DebrisField(this.viewer);

    // 地形剖面 (异步采样 DEM)
    this.terrainProfile = new TerrainProfile(this.viewer);

    // 雷达盲区分析 (异步采样 DEM)
    this.radarBlindZone = new RadarBlindZone(this.viewer, radarStation);

    // 坠毁点标记
    this._createCrashSiteMarker();

    // 地形加载完成后构建剖面
    this._waitForTerrainThenBuildProfile();
  }

  // 坠毁点标记 (初始隐藏)
  _createCrashSiteMarker() {
    this.crashMarker = this.viewer.entities.add({
      name: '坠毁点',
      position: Cesium.Cartesian3.fromDegrees(
        crashSite.longitude,
        crashSite.latitude,
        1
      ),
      point: {
        pixelSize: 1,
        color: Cesium.Color.RED.withAlpha(0),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      show: false,
    });
  }

  // 等待地形加载完成, 构建剖面 & 雷达盲区分析
  _waitForTerrainThenBuildProfile() {
    let built = false;
    const checkAndBuild = (remaining) => {
      if (remaining === 0 && !built) {
        built = true;
        this.terrainProfile.build();
        this._buildBlindZone();
      }
    };
    this.viewer.scene.globe.tileLoadProgressEvent.addEventListener(checkAndBuild);
    setTimeout(() => {
      if (!built) {
        built = true;
        this.terrainProfile.build();
        this._buildBlindZone();
      }
    }, 3000);
  }

  async _buildBlindZone() {
    if (!document.getElementById('radarEnabled').checked) return;
    await this.radarBlindZone.build();
  }

  // === 控制面板 ===
  _bindControls() {
    document.getElementById('btnPlay').addEventListener('click', () => this.play());
    document.getElementById('btnPause').addEventListener('click', () => this.pause());
    document.getElementById('btnReset').addEventListener('click', () => this.reset());

    // 地形夸张滑块
    const exaggSlider = document.getElementById('exaggSlider');
    const exaggLabel = document.getElementById('exaggValue');
    exaggSlider.addEventListener('input', () => {
      const val = parseFloat(exaggSlider.value);
      this.viewer.scene.verticalExaggeration = val;
      exaggLabel.textContent = val.toFixed(1) + 'x';
    });

    // === 雷达面板控制 ===
    this._bindRadarPanel();
  }

  _bindRadarPanel() {
    // 雷达开关
    document.getElementById('radarEnabled').addEventListener('change', (e) => {
      const on = e.target.checked;
      this.radar.setEnabled(on);
      if (on) {
        this.radarBlindZone.destroyVisuals();
        this._buildBlindZone();
      } else {
        this.radarBlindZone.destroyVisuals();
      }
    });

    // 部署经纬度 (输入完成后更新位置并重建盲区)
    const updatePosition = () => {
      const lon = parseFloat(document.getElementById('radarLon').value);
      const lat = parseFloat(document.getElementById('radarLat').value);
      if (!isNaN(lon) && !isNaN(lat)) {
        this.radar.setPosition(lon, lat);
        this.radarBlindZone.setStation(lon, lat);
      }
    };
    document.getElementById('radarLon').addEventListener('change', updatePosition);
    document.getElementById('radarLat').addEventListener('change', updatePosition);

    // 基座高程滑块
    const heightSlider = document.getElementById('radarHeightSlider');
    const heightLabel = document.getElementById('radarHeightValue');
    heightSlider.addEventListener('input', () => {
      const h = parseInt(heightSlider.value);
      heightLabel.textContent = h + ' m';
      this.radar.setBaseHeight(h);
    });
    heightSlider.addEventListener('change', () => {
      const h = parseInt(heightSlider.value);
      this.radarBlindZone.setTowerHeight(h);
    });

    // 雷达面板内的半径滑块 (与主面板滑块双向同步)
    const panelRadiusSlider = document.getElementById('radarPanelRadiusSlider');
    const panelRadiusLabel = document.getElementById('radarPanelRadiusValue');
    const mainRadiusSlider = document.getElementById('radarRadiusSlider');
    const mainRadiusLabel = document.getElementById('radarRadiusValue');

    const syncRadius = (km, source) => {
      const meters = km * 1000;
      // 同步两个滑块
      if (source !== 'panel') {
        panelRadiusSlider.value = km;
      }
      if (source !== 'main') {
        mainRadiusSlider.value = km;
      }
      panelRadiusLabel.textContent = km + ' km';
      mainRadiusLabel.textContent = km + ' km';
      this.radar.setRadius(meters);
    };

    panelRadiusSlider.addEventListener('input', () => {
      syncRadius(parseInt(panelRadiusSlider.value), 'panel');
    });
    panelRadiusSlider.addEventListener('change', () => {
      this.radarBlindZone.setRadius(parseInt(panelRadiusSlider.value) * 1000);
    });

    mainRadiusSlider.addEventListener('input', () => {
      syncRadius(parseInt(mainRadiusSlider.value), 'main');
    });
    mainRadiusSlider.addEventListener('change', () => {
      this.radarBlindZone.setRadius(parseInt(mainRadiusSlider.value) * 1000);
    });

    // 半球可视化开关
    document.getElementById('showHemisphere').addEventListener('change', (e) => {
      this.radar.setShowHemisphere(e.target.checked);
    });
  }

  play() {
    if (this.simRunning) return;

    if (this.status === 'postCrash') {
      this.reset();
    }

    if (this.status === 'idle') {
      // 首次播放 - 创建飞机
      this.airplane.create();
      // 重置时钟
      this.viewer.clock.currentTime = Cesium.JulianDate.now();
    }

    this.simRunning = true;
    this.startTime = performance.now() / 1000 - this.simTime;
    this._animate();

    document.getElementById('btnPlay').disabled = true;
    document.getElementById('btnPause').disabled = false;

    // 锁定视角跟踪飞机
    if (this.airplane.entity) {
      this.viewer.trackedEntity = this.airplane.entity;
    }
  }

  pause() {
    this.simRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    document.getElementById('btnPlay').disabled = false;
    document.getElementById('btnPause').disabled = true;
  }

  reset() {
    this.pause();
    this.simTime = 0;
    this.status = 'idle';
    this.startTime = null;
    this.explosionTriggered = false;
    this.debrisCreated = false;
    this.cameraFlewToCrash = false;
    this._resetSimulation();
    this._updateUI();

    document.getElementById('btnPlay').disabled = false;
    document.getElementById('btnPause').disabled = true;
  }

  // === 动画循环 ===
  _animate() {
    if (!this.simRunning) return;

    const now = performance.now() / 1000;
    this.simTime = Math.max(0, now - this.startTime);

    // 更新飞机位置
    if (this.airplane) {
      this.airplane.setSimTime(this.simTime);
    }

    // 更新仿真逻辑
    this._updateSimulation(this.simTime);

    // 更新相机 (坠落阶段拉近)
    this._updateCamera(this.simTime);

    // 停止条件
    if (this.simTime >= TIMING.TOTAL) {
      this.pause();
      return;
    }

    this._updateUI();
    this.animationFrame = requestAnimationFrame(() => this._animate());
  }

  // === 仿真核心逻辑 ===
  _updateSimulation(time) {
    // 阶段判定
    if (time < TIMING.CRUISING) {
      this._setStatus('cruising');
    } else if (time < TIMING.CRASH_MOMENT) {
      this._setStatus('descending');
    } else if (time < TIMING.CRASH_MOMENT + 2) {
      this._setStatus('crashed');
    } else {
      this._setStatus('postCrash');
    }
  }

  _setStatus(status) {
    if (this.status !== status) {
      const prevStatus = this.status;
      this.status = status;
      this._onStatusChange(status, prevStatus);
    }
  }

  _onStatusChange(status, prevStatus) {
    switch (status) {
      case 'descending':
        // 雷电加强
        this.lightning.start(0.4, 1.5);
        // 启动烟雾拖尾
        this.smokeTrail.start(this.airplane);
        break;

      case 'crashed':
        if (!this.explosionTriggered) {
          this.explosionTriggered = true;
          // 停止烟雾
          this.smokeTrail.stop();
          // 隐藏飞机
          if (this.airplane.entity) {
            this.airplane.entity.show = false;
          }
          // 触发爆炸
          this.explosion.trigger(crashSite.longitude, crashSite.latitude);
          // 显示坠毁点
          this.crashMarker.show = true;
          this.crashMarker.point.pixelSize = 15;
          this.crashMarker.point.color = Cesium.Color.RED.withAlpha(0.9);
        }
        break;

      case 'postCrash':
        if (!this.debrisCreated) {
          this.debrisCreated = true;
          // 创建碎片
          this.debris.create(crashSite.longitude, crashSite.latitude, 50);
          // 停止雷电
          this.lightning.stop();
          // 2.5秒后逐渐减缓爆炸烟雾
          this._reduceSmokeTimer = setTimeout(() => {
            if (this.explosion.smokeSystem) {
              this.explosion.smokeSystem.emissionRate = 2;
            }
          }, 2500);
        }
        break;
    }
  }

  // === 相机更新 ===
  _updateCamera(time) {
    if (!this.airplane.entity) return;

    // 坠毁后聚焦坠毁点 (只飞一次)
    if (time >= TIMING.CRASH_MOMENT && !this.cameraFlewToCrash) {
      this.cameraFlewToCrash = true;
      if (this.viewer.trackedEntity) {
        this.viewer.trackedEntity = undefined;
      }
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          crashSite.longitude,
          crashSite.latitude,
          3000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-60),
          roll: 0,
        },
        duration: 2,
      });
    }
  }

  // === 重置 ===
  _resetSimulation() {
    this._setStatus('idle');

    this.airplane.destroy();
    this.smokeTrail.stop();
    this.explosion.destroy();
    this.debris.destroy();

    this.crashMarker.show = false;
    this.crashMarker.point.pixelSize = 1;
    this.crashMarker.point.color = Cesium.Color.RED.withAlpha(0);

    this.lightning.start(3, 10);

    if (this._reduceSmokeTimer) {
      clearTimeout(this._reduceSmokeTimer);
      this._reduceSmokeTimer = null;
    }

    this.viewer.trackedEntity = undefined;
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        DEFAULT_VIEW.longitude,
        DEFAULT_VIEW.latitude,
        DEFAULT_VIEW.height
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 1.5,
    });
  }

  // === UI 更新 ===
  _updateUI() {
    const timeStr = this._formatTime(this.simTime);
    document.getElementById('simTime').textContent = timeStr;

    const phaseMap = {
      idle: '待命',
      cruising: '正常巡航',
      descending: '⚠ 紧急下降',
      crashed: '💥 坠毁',
      postCrash: '事故现场',
    };
    document.getElementById('simPhase').textContent = phaseMap[this.status] || '待命';

    const statusEl = document.getElementById('simStatus');
    statusEl.textContent = phaseMap[this.status] || '就绪';
    statusEl.className = `status-badge ${this.status}`;

    const progress = Math.min(100, (this.simTime / TIMING.TOTAL) * 100);
    document.getElementById('progressFill').style.width = `${progress}%`;
  }

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
