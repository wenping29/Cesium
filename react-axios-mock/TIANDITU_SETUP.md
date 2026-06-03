# 天地图配置说明

## 问题解决

天地图不显示的问题已解决。主要问题包括：
1. CesiumMap 组件中没有配置天地图图层
2. 天地图的 CORS 跨域问题

## 解决方案

### 1. 申请天地图 Token

1. 访问天地图官网：https://console.tianditu.gov.cn/
2. 注册并登录账号
3. 申请浏览器端的 key (token)
4. 复制获得的 token

### 2. 配置环境变量

1. 复制 `.env.example` 文件为 `.env`
2. 将申请到的 token 填入 `VITE_TIANDITU_TOKEN` 变量

```bash
# .env 文件内容
VITE_TIANDITU_TOKEN=你的天地图token
```

### 3. 重启开发服务器

配置完成后，需要重启开发服务器才能生效：

```bash
npm run dev
```

## 技术实现

### 修改的文件

1. **src/components/CesiumMap.jsx**
   - 添加了天地图图层配置
   - 使用 WebMapTileServiceImageryProvider 加载天地图服务
   - 配置了矢量底图 (vec) 和矢量注记 (cva)
   - 使用代理路径解决 CORS 问题

2. **vite.config.js**
   - 添加了开发服务器代理配置
   - 将 `/tianditu` 请求代理到 `https://t0.tianditu.gov.cn`
   - 解决了跨域问题

3. **.env.example**
   - 创建了环境变量示例文件

### CORS 解决方案

天地图服务存在跨域限制，通过 Vite 开发服务器的代理功能解决：

```javascript
// vite.config.js
server: {
  proxy: {
    '/tianditu': {
      target: 'https://t0.tianditu.gov.cn',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/tianditu/, ''),
      secure: false,
    }
  }
}
```

### 天地图图层说明

- **矢量底图 (vec_w)**: 提供矢量地图底图
- **矢量注记 (cva_w)**: 提供地名标注

其他可选图层：
- **影像底图 (img_w)**: 卫星影像
- **影像注记 (cia_w)**: 影像注记
- **地形底图 (ter_w)**: 地形晕眩

## 注意事项

1. 天地图 token 是必需的，没有 token 无法加载地图
2. 免费版 token 有调用次数限制
3. 建议将 `.env` 文件添加到 `.gitignore`，避免泄露 token
4. 生产环境需要配置正确的域名白名单
5. 代理配置只在开发环境有效，生产环境需要后端代理

## 故障排除

如果地图仍然不显示：

1. 检查浏览器控制台是否有错误信息
2. 确认 token 是否正确配置
3. 检查网络连接是否正常
4. 确认天地图服务是否可用
5. 确认开发服务器代理是否正常工作
6. 重启开发服务器确保配置生效