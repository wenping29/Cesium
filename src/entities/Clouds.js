import * as Cesium from 'cesium';

/**
 * 创建云层实体 (Billboard 批量生成)
 * @param {Cesium.Viewer} viewer
 * @param {number} count - 云朵数量
 * @param {Object} center - 中心位置 { lon, lat }
 * @param {number} radius - 分布半径 (度)
 */
export function createClouds(viewer, count = 80, center = { lon: 117.0, lat: 39.5 }, radius = 2.0) {
  const entities = [];
  const cloudImages = generateCloudTextures();

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const lon = center.lon + dist * Math.cos(angle) / Math.cos(Cesium.Math.toRadians(center.lat));
    const lat = center.lat + dist * Math.sin(angle);
    const alt = 3000 + Math.random() * 7000; // 3000m-10000m

    const texIdx = Math.floor(Math.random() * cloudImages.length);
    const scale = 0.3 + Math.random() * 0.8;

    const cloud = viewer.entities.add({
      name: `云层 #${i}`,
      position: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
      billboard: {
        image: cloudImages[texIdx],
        width: 200 * scale,
        height: 120 * scale,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.3),
        translucencyByDistance: new Cesium.NearFarScalar(50000, 0.8, 500000, 0.2),
      },
    });
    entities.push(cloud);
  }

  return entities;
}

// Canvas 生成多种云朵纹理
function generateCloudTextures() {
  const textures = [];
  const configs = [
    { w: 128, h: 64, cx: 64, cy: 32, rx: 55, ry: 20 },
    { w: 140, h: 70, cx: 70, cy: 35, rx: 60, ry: 25 },
    { w: 100, h: 50, cx: 50, cy: 25, rx: 40, ry: 18 },
  ];

  for (const cfg of configs) {
    const canvas = document.createElement('canvas');
    canvas.width = cfg.w;
    canvas.height = cfg.h;
    const ctx = canvas.getContext('2d');

    // 径向渐变绘制云朵
    const gradient = ctx.createRadialGradient(cfg.cx, cfg.cy, 5, cfg.cx, cfg.cy, cfg.rx);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.7)');
    gradient.addColorStop(0.7, 'rgba(240, 245, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.ellipse(cfg.cx, cfg.cy, cfg.rx, cfg.ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 添加一些小凸起
    for (let j = 0; j < 5; j++) {
      const bx = cfg.cx + (Math.random() - 0.5) * cfg.rx * 1.2;
      const by = cfg.cy + (Math.random() - 0.5) * cfg.ry * 1.2;
      const br = 10 + Math.random() * 20;
      const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      bg.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = bg;
      ctx.fill();
    }

    textures.push(canvas.toDataURL());
  }

  return textures;
}
