import Mock from 'mockjs'

const { Random } = Mock

const BUILDING_TYPES = [
  { id: 'building', name: '建筑', icon: '🏢' },
  { id: 'bridge', name: '桥梁', icon: '🌉' },
  { id: 'tunnel', name: '隧道', icon: '🚇' },
  { id: 'facility', name: '设施', icon: '🏭' },
  { id: 'pipeline', name: '管线', icon: '🔧' },
]

const conversionRecords = []

function generateDetectedBuildings(count) {
  const buildings = []
  const centerLng = 116.4074
  const centerLat = 39.9042

  for (let i = 0; i < count; i++) {
    const type = BUILDING_TYPES[Random.natural(0, BUILDING_TYPES.length - 1)]
    buildings.push({
      id: `detect_${Random.string('number', 6)}`,
      name: `${['检测', '识别', '提取'][Random.natural(0, 2)]}${type.name}${i + 1}`,
      type: type.id,
      position: {
        lng: Random.float(centerLng - 0.05, centerLng + 0.05, 4, 6),
        lat: Random.float(centerLat - 0.03, centerLat + 0.03, 4, 6),
        height: Random.integer(0, 50),
      },
      height: Random.float(5, 180, 1, 1),
      area: Random.integer(200, 8000),
      confidence: Random.float(0.6, 0.99, 2, 2),
      outline: Array.from({ length: 4 }, () => ({
        lng: Random.float(centerLng - 0.02, centerLng + 0.02, 4, 6),
        lat: Random.float(centerLat - 0.02, centerLat + 0.02, 4, 6),
      })),
      metadata: {
        floors: Random.integer(2, 60),
        yearBuilt: Random.integer(1990, 2025),
        structure: ['钢结构', '混凝土结构', '混合结构'][Random.natural(0, 2)],
      }
    })
  }
  return buildings
}

Mock.mock('/api/image-to-bim/convert', 'post', () => {
  const detectedCount = Random.integer(5, 20)
  const buildings = generateDetectedBuildings(detectedCount)
  const processingTime = Random.integer(2000, 5000)

  const record = {
    id: `conv_${Random.string('number', 6)}`,
    imageName: `upload_${Random.datetime('yyyyMMdd_HHmmss')}.png`,
    imageUrl: Random.image('800x600', Random.color(), '#fff', 'Satellite'),
    status: 'completed',
    progress: 100,
    processingTime,
    detectedCount,
    models: buildings,
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
  }

  conversionRecords.unshift(record)

  return {
    code: 200,
    message: '图片转换完成',
    data: record,
  }
})

Mock.mock('/api/image-to-bim/history', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: conversionRecords.map(({ models, ...rest }) => ({
      ...rest,
      modelCount: models.length,
    })),
  }
})

Mock.mock(/\/api\/image-to-bim\/history\/\w+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const record = conversionRecords.find(r => r.id === id)

  if (record) {
    return {
      code: 200,
      message: 'success',
      data: record,
    }
  }

  return {
    code: 404,
    message: 'Record not found',
    data: null,
  }
})

Mock.mock(/\/api\/image-to-bim\/result\/\w+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const record = conversionRecords.find(r => r.id === id)

  if (record) {
    return {
      code: 200,
      message: 'success',
      data: {
        conversionId: record.id,
        models: record.models,
        totalCount: record.detectedCount,
      },
    }
  }

  return {
    code: 404,
    message: 'Result not found',
    data: null,
  }
})
