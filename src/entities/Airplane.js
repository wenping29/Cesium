import * as Cesium from 'cesium';
import { flightPath, crashPath } from '../mock/flightData.js';

/**
 * 生成简易飞机 3D 模型 (GLB binary, base64 data URI)
 * Low-poly airplane: 机头/机身/机翼/尾翼/垂尾, 6 顶点 6 面
 */
function createAirplaneModelUri() {
  // 顶点数据: 机头朝 +Y (北), 机翼沿 ±X (东西), 高度沿 +Z
  const positions = new Float32Array([
    0.0, 3.0, 0.0,    // 0: 机头 (front)
    3.0, 0.0, 0.0,    // 1: 右翼尖 (right wing)
    -3.0, 0.0, 0.0,   // 2: 左翼尖 (left wing)
    0.0, -2.5, 0.0,   // 3: 机尾 (tail)
    0.0, -1.5, 1.0,   // 4: 垂尾顶 (fin top)
    0.0, 0.0, -0.3,   // 5: 机腹 (belly)
  ]);

  // 索引 (18 个 = 6 个三角形面)
  const indices = new Uint32Array([
    0, 1, 2,   // 顶面 (机身上方)
    0, 5, 3,   // 底面 (机腹)
    0, 1, 3,   // 右侧面
    0, 3, 2,   // 左侧面
    3, 4, 0,   // 垂尾右侧
    0, 4, 3,   // 垂尾左侧
  ]);

  const posBytes = new Uint8Array(positions.buffer);  // 72 bytes
  const idxBytes = new Uint8Array(indices.buffer);     // 72 bytes
  const binData = new Uint8Array(posBytes.length + idxBytes.length);
  binData.set(posBytes, 0);
  binData.set(idxBytes, posBytes.length);

  // glTF JSON
  const gltfJson = {
    asset: { version: "2.0", generator: "cesium-sim" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0 }],
    meshes: [{
      primitives: [{
        attributes: { POSITION: 0 },
        indices: 1,
        material: 0,
      }],
    }],
    materials: [{
      pbrMetallicRoughness: {
        baseColorFactor: [0.90, 0.90, 0.91, 1.0],
        metallicFactor: 0.45,
        roughnessFactor: 0.35,
      },
      doubleSided: true,
      alphaMode: "OPAQUE",
    }],
    accessors: [
      {
        bufferView: 0, byteOffset: 0,
        componentType: 5126, count: 6, type: "VEC3",
        max: [3.0, 3.0, 1.0], min: [-3.0, -2.5, -0.3],
      },
      {
        bufferView: 1, byteOffset: 0,
        componentType: 5125, count: 18, type: "SCALAR",
      },
    ],
    bufferViews: [
      { buffer: 0, byteOffset: 0, byteLength: posBytes.length },
      { buffer: 0, byteOffset: posBytes.length, byteLength: idxBytes.length },
    ],
    buffers: [{ byteLength: binData.length }],
  };

  const jsonStr = JSON.stringify(gltfJson);
  const jsonBytes = new TextEncoder().encode(jsonStr);
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;

  // GLB 二进制组装
  const totalLen = 12 + 8 + jsonBytes.length + jsonPad + 8 + binData.length;
  const glb = new Uint8Array(totalLen);
  const view = new DataView(glb.buffer);

  // Header
  view.setUint32(0, 0x46546C67, true);  // "glTF" magic
  view.setUint32(4, 2, true);           // version 2
  view.setUint32(8, totalLen, true);

  // JSON chunk
  let offset = 12;
  view.setUint32(offset, jsonBytes.length + jsonPad, true);
  view.setUint32(offset + 4, 0x4E4F534A, true);  // "JSON"
  offset += 8;
  glb.set(jsonBytes, offset);
  offset += jsonBytes.length;
  for (let i = 0; i < jsonPad; i++) glb[offset + i] = 0x20;  // space padding
  offset += jsonPad;

  // BIN chunk
  view.setUint32(offset, binData.length, true);
  view.setUint32(offset + 4, 0x004E4942, true);  // "BIN\0"
  offset += 8;
  glb.set(binData, offset);

  // Base64 编码
  let binary = '';
  for (let i = 0; i < glb.length; i++) binary += String.fromCharCode(glb[i]);
  return 'data:model/gltf-binary;base64,' + btoa(binary);
}

// 预生成模型 URI (只生成一次)
const AIRPLANE_MODEL_URI = createAirplaneModelUri();

/**
 * 飞机实体 - 使用 3D GLB 模型 + CallbackProperty 实现轨迹动画
 */
export class Airplane {
  constructor(viewer) {
    this.viewer = viewer;
    this.entity = null;
    this._simTime = 0;

    this.allPoints = [...flightPath, ...crashPath.filter(
      p => p.time > flightPath[flightPath.length - 1].time
    )];
  }

  create() {
    const self = this;

    const positionProperty = new Cesium.CallbackProperty(() => {
      return self._getPositionAtTime(self._simTime);
    }, false);

    const orientationProperty = new Cesium.CallbackProperty(() => {
      const heading = self._getHeadingAtTime(self._simTime);
      // 模型 nose 朝 +Y, Cesium heading=0 朝北(+Y), 无需偏移
      // 下降阶段加轻微俯角
      const pitch = (self._simTime > 10 && self._simTime < 16) ? -0.15 : -0.03;
      return Cesium.Transforms.headingPitchRollQuaternion(
        self._getPositionAtTime(self._simTime),
        new Cesium.HeadingPitchRoll(heading, pitch, 0)
      );
    }, false);

    this.entity = this.viewer.entities.add({
      name: 'CCA1234',
      position: positionProperty,
      orientation: orientationProperty,
      model: {
        uri: AIRPLANE_MODEL_URI,
        scale: 8.0,                    // 缩放到 ~45m 长 (真实客机大小)
        minimumPixelSize: 24,          // 远距离最小像素保证可见
        color: Cesium.Color.WHITE,
      },
      label: {
        text: 'CCA1234',
        font: '13px Microsoft YaHei',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -45),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.3),
      },
    });

    // 飞行轨迹尾迹
    this.pathEntity = this.viewer.entities.add({
      name: '飞行轨迹',
      polyline: {
        positions: new Cesium.CallbackProperty(() => {
          return self._getPathPositionsUpTo(self._simTime);
        }, false),
        width: 3,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.15,
          color: Cesium.Color.CYAN.withAlpha(0.6),
        }),
        clampToGround: false,
      },
    });

    return this.entity;
  }

  setSimTime(time) {
    this._simTime = time;
  }

  _getPositionAtTime(time) {
    const pt = this._interpolate(time);
    if (!pt) return Cesium.Cartesian3.fromDegrees(
      this.allPoints[0].lon, this.allPoints[0].lat, this.allPoints[0].alt
    );
    return Cesium.Cartesian3.fromDegrees(pt.lon, pt.lat, pt.alt);
  }

  _getHeadingAtTime(time) {
    const pt = this._interpolate(time);
    if (!pt) return 0;
    const next = this._interpolate(time + 0.1);
    if (!next) return 0;
    const dx = next.lon - pt.lon;
    const dy = next.lat - pt.lat;
    return Math.atan2(dx, dy);
  }

  _getPathPositionsUpTo(time) {
    const positions = [];
    for (const pt of this.allPoints) {
      if (pt.time <= time) {
        positions.push(pt.lon, pt.lat, pt.alt);
      } else if (positions.length >= 2) {
        const current = this._interpolate(time);
        if (current) positions.push(current.lon, current.lat, current.alt);
        break;
      }
    }
    if (positions.length < 6) return undefined;
    return Cesium.Cartesian3.fromDegreesArrayHeights(positions);
  }

  _interpolate(time) {
    const pts = this.allPoints;
    if (pts.length === 0) return null;
    if (time <= pts[0].time) return pts[0];
    if (time >= pts[pts.length - 1].time) return pts[pts.length - 1];

    for (let i = 0; i < pts.length - 1; i++) {
      if (time >= pts[i].time && time <= pts[i + 1].time) {
        const t = (time - pts[i].time) / (pts[i + 1].time - pts[i].time);
        return {
          lon: Cesium.Math.lerp(pts[i].lon, pts[i + 1].lon, t),
          lat: Cesium.Math.lerp(pts[i].lat, pts[i + 1].lat, t),
          alt: Cesium.Math.lerp(pts[i].alt, pts[i + 1].alt, t),
        };
      }
    }
    return pts[pts.length - 1];
  }

  destroy() {
    if (this.entity) {
      this.viewer.entities.remove(this.entity);
      this.entity = null;
    }
    if (this.pathEntity) {
      this.viewer.entities.remove(this.pathEntity);
      this.pathEntity = null;
    }
  }
}
