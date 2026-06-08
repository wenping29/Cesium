export function generateEarthquakeHeatmap(earthquakes, options = {}) {
  const {
    width = 1024,
    height = 512,
    radius = 30,
    blur = 20,
    minOpacity = 0,
    maxOpacity = 0.8,
  } = options

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)

  if (!earthquakes || earthquakes.length === 0) return canvas

  const lats = earthquakes.map((e) => e.lat)
  const lngs = earthquakes.map((e) => e.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const padLat = (maxLat - minLat) * 0.1 || 5
  const padLng = (maxLng - minLng) * 0.1 || 5
  const boundsMinLat = minLat - padLat
  const boundsMaxLat = maxLat + padLat
  const boundsMinLng = minLng - padLng
  const boundsMaxLng = maxLng + padLng

  const xScale = width / (boundsMaxLng - boundsMinLng)
  const yScale = height / (boundsMaxLat - boundsMinLat)

  const maxMag = Math.max(...earthquakes.map((e) => e.magnitude))
  const minMag = Math.min(...earthquakes.map((e) => e.magnitude))
  const magRange = maxMag - minMag || 1

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext('2d')

  const gradient = tempCtx.createRadialGradient(0, 0, 0, 0, 0, radius)
  gradient.addColorStop(0, `rgba(0,0,0,1)`)
  gradient.addColorStop(1, `rgba(0,0,0,0)`)

  const circleCanvas = document.createElement('canvas')
  circleCanvas.width = radius * 2
  circleCanvas.height = radius * 2
  const circleCtx = circleCanvas.getContext('2d')
  circleCtx.clearRect(0, 0, radius * 2, radius * 2)
  const g = circleCtx.createRadialGradient(radius, radius, 0, radius, radius, radius)
  g.addColorStop(0, `rgba(0,0,0,1)`)
  g.addColorStop(1, `rgba(0,0,0,0)`)
  circleCtx.fillStyle = g
  circleCtx.fillRect(0, 0, radius * 2, radius * 2)

  earthquakes.forEach((eq) => {
    const x = (eq.lng - boundsMinLng) * xScale
    const y = height - (eq.lat - boundsMinLat) * yScale
    const weight = (eq.magnitude - minMag) / magRange * 0.5 + 0.5
    tempCtx.globalAlpha = weight
    tempCtx.drawImage(circleCanvas, x - radius, y - radius)
  })

  const blurRadius = blur
  const tempData = tempCtx.getImageData(0, 0, width, height)
  const blurred = blurImageData(tempData, width, height, blurRadius)

  const resultCanvas = document.createElement('canvas')
  resultCanvas.width = width
  resultCanvas.height = height
  const resultCtx = resultCanvas.getContext('2d')

  const colorRamp = createColorRamp()
  const resultImageData = resultCtx.createImageData(width, height)
  const pixels = resultImageData.data

  let maxVal = 0
  for (let i = 0; i < blurred.length; i++) {
    if (blurred[i] > maxVal) maxVal = blurred[i]
  }
  if (maxVal === 0) maxVal = 1

  for (let i = 0; i < width * height; i++) {
    const val = blurred[i] / maxVal
    if (val < minOpacity) {
      pixels[i * 4] = 0
      pixels[i * 4 + 1] = 0
      pixels[i * 4 + 2] = 0
      pixels[i * 4 + 3] = 0
    } else {
      const color = colorRamp(val)
      const alpha = Math.min(val, maxOpacity)
      pixels[i * 4] = color[0]
      pixels[i * 4 + 1] = color[1]
      pixels[i * 4 + 2] = color[2]
      pixels[i * 4 + 3] = Math.round(alpha * 255)
    }
  }

  resultCtx.putImageData(resultImageData, 0, 0)
  return resultCanvas
}

function blurImageData(data, width, height, radius) {
  const size = width * height
  const result = new Float64Array(size)
  const temp = new Float64Array(size)

  for (let i = 0; i < size; i++) {
    result[i] = data.data[i * 4]
  }

  const sigma = radius / 3
  const kernelSize = Math.ceil(radius * 2) + 1
  const kernel = new Float64Array(kernelSize)
  let kernelSum = 0
  for (let i = 0; i < kernelSize; i++) {
    const x = i - Math.floor(kernelSize / 2)
    kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma))
    kernelSum += kernel[i]
  }
  for (let i = 0; i < kernelSize; i++) {
    kernel[i] /= kernelSum
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      for (let k = 0; k < kernelSize; k++) {
        const sx = x + k - Math.floor(kernelSize / 2)
        if (sx < 0 || sx >= width) continue
        sum += result[y * width + sx] * kernel[k]
      }
      temp[y * width + x] = sum
    }
  }

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0
      for (let k = 0; k < kernelSize; k++) {
        const sy = y + k - Math.floor(kernelSize / 2)
        if (sy < 0 || sy >= height) continue
        sum += temp[sy * width + x] * kernel[k]
      }
      result[y * width + x] = sum
    }
  }

  return result
}

function createColorRamp() {
  const stops = [
    { pos: 0.0, color: [0, 0, 80] },
    { pos: 0.2, color: [0, 60, 200] },
    { pos: 0.4, color: [0, 200, 200] },
    { pos: 0.5, color: [0, 220, 80] },
    { pos: 0.6, color: [200, 200, 0] },
    { pos: 0.8, color: [220, 80, 0] },
    { pos: 1.0, color: [200, 0, 0] },
  ]

  return (t) => {
    t = Math.max(0, Math.min(1, t))
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i]
      const b = stops[i + 1]
      if (t >= a.pos && t <= b.pos) {
        const f = (t - a.pos) / (b.pos - a.pos)
        return [
          Math.round(a.color[0] + (b.color[0] - a.color[0]) * f),
          Math.round(a.color[1] + (b.color[1] - a.color[1]) * f),
          Math.round(a.color[2] + (b.color[2] - a.color[2]) * f),
        ]
      }
    }
    return stops[stops.length - 1].color
  }
}
