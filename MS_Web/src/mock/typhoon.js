import Mock from 'mockjs'

const TYPHOON_NAMES = ['杜苏芮', '海葵', '苏拉', '卡努', '泰利', '玛娃', '梅花', '烟花', '利奇马', '山竹']

function generatePath(startLng, startLat, steps) {
  const path = []
  let lng = startLng
  let lat = startLat
  for (let i = 0; i < steps; i++) {
    lng += Mock.Random.float(-0.5, 0.5, 2, 2)
    lat += Mock.Random.float(-0.3, 0.3, 2, 2)
    path.push([lng, lat])
  }
  return path
}

const currentTyphoon = {
  id: 'ty_current',
  name: Mock.Random.pick(TYPHOON_NAMES),
  strength: Mock.Random.pick(['热带风暴', '强热带风暴', '台风', '强台风', '超强台风']),
  windSpeed: Mock.Random.natural(20, 70),
  pressure: Mock.Random.natural(910, 995),
  lat: Mock.Random.float(18, 30, 2, 2),
  lng: Mock.Random.float(115, 130, 2, 2),
  path: generatePath(125, 22, 15),
  time: Mock.Random.now('yyyy-MM-dd HH:mm:ss'),
  status: 'active',
}

const historicalTyphoons = []
for (let i = 1; i <= 20; i++) {
  historicalTyphoons.push({
    id: `ty_hist_${String(i).padStart(3, '0')}`,
    name: Mock.Random.pick(TYPHOON_NAMES),
    strength: Mock.Random.pick(['热带风暴', '强热带风暴', '台风', '强台风', '超强台风']),
    windSpeed: Mock.Random.natural(18, 75),
    pressure: Mock.Random.natural(905, 1000),
    lat: Mock.Random.float(15, 35, 2, 2),
    lng: Mock.Random.float(110, 135, 2, 2),
    path: generatePath(120 + Mock.Random.float(-5, 5, 1, 1), 20 + Mock.Random.float(-5, 5, 1, 1), 12),
    time: Mock.Random.datetime('2015-01-01 00:00:00', '2023-12-31 23:59:59'),
    status: 'historical',
  })
}

Mock.mock(/\/api\/typhoon\/current/, 'get', () => ({
  code: 200,
  message: 'success',
  data: currentTyphoon,
}))

Mock.mock(/\/api\/typhoon\/historical/, 'get', () => ({
  code: 200,
  message: 'success',
  data: historicalTyphoons,
}))
