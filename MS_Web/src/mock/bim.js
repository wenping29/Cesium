import Mock from 'mockjs'

const { Random } = Mock

// BIM模型类型
const BIM_TYPES = [
  { id: 'building', name: '建筑模型', icon: '🏢' },
  { id: 'bridge', name: '桥梁模型', icon: '🌉' },
  { id: 'tunnel', name: '隧道模型', icon: '🚇' },
  { id: 'facility', name: '设施模型', icon: '🏭' },
  { id: 'pipeline', name: '管线模型', icon: '🔧' },
]

// 模拟BIM模型数据
const bimModels = [
  {
    id: 'bim_001',
    name: '中央商务区A栋',
    type: 'building',
    description: '位于城市中心的现代化办公大楼，高45层，建筑面积12万平方米',
    position: { lng: 116.4074, lat: 39.9042, height: 0 },
    modelUrl: '/models/central_building_a.glb',
    thumbnail: '/thumbnails/central_building_a.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-03-20 14:22:00',
    metadata: {
      floors: 45,
      area: 120000,
      yearBuilt: 2023,
      architect: '建筑设计院',
      developer: '地产开发集团'
    }
  },
  {
    id: 'bim_002',
    name: '跨江大桥主桥',
    type: 'bridge',
    description: '连接两岸的重要交通枢纽，全长2.3公里，双向6车道',
    position: { lng: 116.4174, lat: 39.9142, height: 0 },
    modelUrl: '/models/river_bridge.glb',
    thumbnail: '/thumbnails/river_bridge.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-02-10 09:15:00',
    updatedAt: '2024-04-05 11:30:00',
    metadata: {
      length: 2300,
      lanes: 6,
      yearBuilt: 2022,
      engineer: '桥梁工程公司',
      capacity: '80000辆/日'
    }
  },
  {
    id: 'bim_003',
    name: '地铁2号线隧道',
    type: 'tunnel',
    description: '城市轨道交通的重要组成部分，全长15.6公里，设12个站点',
    position: { lng: 116.3874, lat: 39.8942, height: -20 },
    modelUrl: '/models/subway_tunnel.glb',
    thumbnail: '/thumbnails/subway_tunnel.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-01-20 16:45:00',
    updatedAt: '2024-03-15 09:20:00',
    metadata: {
      length: 15600,
      stations: 12,
      depth: 20,
      contractor: '隧道工程局',
      dailyPassengers: '500000人次'
    }
  },
  {
    id: 'bim_004',
    name: '智慧工厂园区',
    type: 'facility',
    description: '现代化智能制造园区，包含生产车间、仓储中心、办公楼等',
    position: { lng: 116.4274, lat: 39.9242, height: 0 },
    modelUrl: '/models/smart_factory.glb',
    thumbnail: '/thumbnails/smart_factory.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-03-01 13:20:00',
    updatedAt: '2024-05-10 16:45:00',
    metadata: {
      area: 85000,
      buildings: 8,
      employees: 1200,
      capacity: '年产50万台设备'
    }
  },
  {
    id: 'bim_005',
    name: '城市综合管廊',
    type: 'pipeline',
    description: '地下综合管廊系统，包含电力、通信、给水、燃气等管线',
    position: { lng: 116.3974, lat: 39.9042, height: -8 },
    modelUrl: '/models/utility_tunnel.glb',
    thumbnail: '/thumbnails/utility_tunnel.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-02-25 11:00:00',
    updatedAt: '2024-04-20 14:15:00',
    metadata: {
      length: 8500,
      depth: 8,
      pipelines: ['电力', '通信', '给水', '燃气'],
      operator: '市政管理公司'
    }
  },
  {
    id: 'bim_006',
    name: '科技园区B栋',
    type: 'building',
    description: '高科技企业研发中心，配备先进的实验设备和办公设施',
    position: { lng: 116.4374, lat: 39.9342, height: 0 },
    modelUrl: '/models/tech_building_b.glb',
    thumbnail: '/thumbnails/tech_building_b.png',
    status: 'processing',
    progress: 65,
    createdAt: '2024-04-01 10:00:00',
    updatedAt: '2024-06-01 15:30:00',
    metadata: {
      floors: 32,
      area: 68000,
      yearBuilt: 2024,
      architect: '科技建筑设计院',
      developer: '科技园区开发公司'
    }
  },
  {
    id: 'bim_007',
    name: '体育中心体育馆',
    type: 'facility',
    description: '多功能体育场馆，可举办篮球、羽毛球、乒乓球等赛事',
    position: { lng: 116.4174, lat: 39.8842, height: 0 },
    modelUrl: '/models/sports_center.glb',
    thumbnail: '/thumbnails/sports_center.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-01-10 14:30:00',
    updatedAt: '2024-03-25 10:45:00',
    metadata: {
      area: 45000,
      capacity: 15000,
      yearBuilt: 2023,
      builder: '体育建设集团',
      events: '体育赛事、演唱会、展览'
    }
  },
  {
    id: 'bim_008',
    name: '高架桥立交系统',
    type: 'bridge',
    description: '城市重要交通枢纽，连接三条主干道，缓解交通压力',
    position: { lng: 116.4474, lat: 39.9442, height: 15 },
    modelUrl: '/models/overpass_interchange.glb',
    thumbnail: '/thumbnails/overpass_interchange.png',
    status: 'active',
    progress: 100,
    createdAt: '2024-02-15 09:00:00',
    updatedAt: '2024-04-10 13:20:00',
    metadata: {
      levels: 3,
      length: 1800,
      yearBuilt: 2022,
      engineer: '交通规划设计院',
      trafficFlow: '120000辆/日'
    }
  }
]

// 获取BIM模型列表
Mock.mock('/api/bim/models', 'get', () => {
  return {
    code: 200,
    message: 'success',
    data: {
      models: bimModels,
      types: BIM_TYPES,
      total: bimModels.length
    }
  }
})

// 获取BIM模型详情
Mock.mock(/\/api\/bim\/models\/\w+/, 'get', (options) => {
  const id = options.url.split('/').pop()
  const model = bimModels.find(m => m.id === id)
  
  if (model) {
    return {
      code: 200,
      message: 'success',
      data: model
    }
  } else {
    return {
      code: 404,
      message: 'Model not found',
      data: null
    }
  }
})

// 创建BIM模型
Mock.mock('/api/bim/models', 'post', (options) => {
  const body = JSON.parse(options.body)
  const newModel = {
    id: `bim_${Random.string('number', 3)}`,
    ...body,
    status: 'processing',
    progress: 0,
    createdAt: Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
  }
  bimModels.push(newModel)
  
  return {
    code: 200,
    message: '创建成功',
    data: newModel
  }
})

// 更新BIM模型
Mock.mock(/\/api\/bim\/models\/\w+/, 'put', (options) => {
  const id = options.url.split('/').pop()
  const body = JSON.parse(options.body)
  const index = bimModels.findIndex(m => m.id === id)
  
  if (index !== -1) {
    bimModels[index] = {
      ...bimModels[index],
      ...body,
      updatedAt: Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
    
    return {
      code: 200,
      message: '更新成功',
      data: bimModels[index]
    }
  } else {
    return {
      code: 404,
      message: 'Model not found',
      data: null
    }
  }
})

// 删除BIM模型
Mock.mock(/\/api\/bim\/models\/\w+/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  const index = bimModels.findIndex(m => m.id === id)
  
  if (index !== -1) {
    bimModels.splice(index, 1)
    
    return {
      code: 200,
      message: '删除成功',
      data: { id }
    }
  } else {
    return {
      code: 404,
      message: 'Model not found',
      data: null
    }
  }
})