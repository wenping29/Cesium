export const TIANDITU_TOKEN = import.meta.env.VITE_TIANDITU_TOKEN || ''

// 天地图 WMTS 图层编号：底图 vec/img/ter，对应注记 cva/cia/cta
export const TIANDITU_BASEMAPS = {
  vec: { layer: 'vec', annotation: 'cva', maxLevel: 18 },
  img: { layer: 'img', annotation: 'cia', maxLevel: 18 },
  ter: { layer: 'ter', annotation: 'cta', maxLevel: 14 },
}
