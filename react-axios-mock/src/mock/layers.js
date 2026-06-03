import Mock from 'mockjs'

const { Random } = Mock

const DEFAULT_LAYERS = [
  {
    id: 'layer_wms_1',
    name: '全球地形',
    type: 'wms',
    url: 'https://services.ga.gov.au/gis/services/World_Topography/MapServer/WMSServer',
    layers: 'World_Topography',
    format: 'image/png',
    transparent: true,
    visible: false,
    opacity: 0.7,
    maxLevel: 18,
  },
  {
    id: 'layer_wms_2',
    name: '全球街道',
    type: 'wms',
    url: 'https://ows.terrestris.de/osm/service',
    layers: 'OSM-WMS',
    format: 'image/png',
    transparent: true,
    visible: false,
    opacity: 0.8,
    maxLevel: 18,
  },
  {
    id: 'layer_wmts_1',
    name: '天地图地形注记',
    type: 'wmts',
    url: '/tianditu/cta_w/wmts',
    layer: 'cta',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'w',
    visible: false,
    opacity: 1.0,
    maxLevel: 14,
  },
  {
    id: 'layer_xyz_1',
    name: 'OpenStreetMap',
    type: 'xyz',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    visible: false,
    opacity: 0.8,
    maxLevel: 19,
  },
  {
    id: 'layer_xyz_2',
    name: '卫星影像',
    type: 'xyz',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    visible: false,
    opacity: 0.9,
    maxLevel: 17,
  },
]

Mock.mock('/api/layers', 'get', () => ({
  code: 200,
  message: 'success',
  data: DEFAULT_LAYERS,
}))

Mock.mock('/api/layers', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newLayer = {
    id: Random.guid(),
    ...body,
    visible: false,
    opacity: body.opacity || 1.0,
    maxLevel: body.maxLevel || 18,
  }
  return {
    code: 200,
    message: '图层创建成功',
    data: newLayer,
  }
})

Mock.mock(/\/api\/layers\/\w+/, 'put', (options) => {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    message: '图层更新成功',
    data: { id: options.url.split('/').pop(), ...body },
  }
})

Mock.mock(/\/api\/layers\/\w+/, 'delete', () => ({
  code: 200,
  message: '图层删除成功',
}))

export { DEFAULT_LAYERS }
