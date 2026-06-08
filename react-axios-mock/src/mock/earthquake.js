import Mock from 'mockjs'

const SEISMIC_ZONES = [
  { region: '日本本州东岸近海', latBase: 36, lngBase: 141, latRange: 4, lngRange: 3, weight: 5 },
  { region: '印尼苏门答腊', latBase: -3, lngBase: 100, latRange: 5, lngRange: 4, weight: 4 },
  { region: '智利中部', latBase: -35, lngBase: -72, latRange: 5, lngRange: 3, weight: 3 },
  { region: '墨西哥沿岸', latBase: 18, lngBase: -103, latRange: 4, lngRange: 4, weight: 3 },
  { region: '中国四川', latBase: 30, lngBase: 103, latRange: 3, lngRange: 2, weight: 4 },
  { region: '中国云南', latBase: 25, lngBase: 101, latRange: 3, lngRange: 2, weight: 3 },
  { region: '中国台湾', latBase: 23.5, lngBase: 121, latRange: 2, lngRange: 2, weight: 4 },
  { region: '中国新疆', latBase: 40, lngBase: 83, latRange: 5, lngRange: 5, weight: 2 },
  { region: '菲律宾群岛', latBase: 14, lngBase: 122, latRange: 4, lngRange: 3, weight: 3 },
  { region: '阿拉斯加', latBase: 60, lngBase: -150, latRange: 5, lngRange: 6, weight: 3 },
  { region: '伊朗', latBase: 33, lngBase: 57, latRange: 4, lngRange: 5, weight: 2 },
  { region: '土耳其', latBase: 39, lngBase: 36, latRange: 3, lngRange: 4, weight: 3 },
  { region: '新西兰', latBase: -42, lngBase: 173, latRange: 3, lngRange: 2, weight: 2 },
  { region: '秘鲁', latBase: -12, lngBase: -77, latRange: 4, lngRange: 3, weight: 2 },
  { region: '巴基斯坦', latBase: 30, lngBase: 70, latRange: 3, lngRange: 3, weight: 2 },
  { region: '阿富汗', latBase: 34, lngBase: 67, latRange: 3, lngRange: 3, weight: 2 },
]

const eqData = []
let idCounter = 1

SEISMIC_ZONES.forEach((zone) => {
  const count = Mock.Random.natural(10, 25) * zone.weight
  for (let i = 0; i < count; i++) {
    const mag = Mock.Random.float(2.0, 9.0, 1, 1)
    const lat = zone.latBase + Mock.Random.float(-zone.latRange / 2, zone.latRange / 2, 2, 2)
    const lng = zone.lngBase + Mock.Random.float(-zone.lngRange / 2, zone.lngRange / 2, 2, 2)
    eqData.push({
      id: `eq_${String(idCounter).padStart(4, '0')}`,
      magnitude: mag,
      depth: Mock.Random.float(1.0, 50.0, 1, 1),
      time: Mock.Random.datetime('2020-01-01 00:00:00', '2024-12-31 23:59:59'),
      region: zone.region,
      lat,
      lng,
      description: `M${mag} ${zone.region}，震源深度 ${Mock.Random.float(1, 50, 1, 1)}km`,
    })
    idCounter++
  }
})

eqData.sort((a, b) => new Date(b.time) - new Date(a.time))

Mock.mock(/\/api\/earthquake\/historical/, 'get', () => ({
  code: 200,
  message: 'success',
  data: eqData,
}))
