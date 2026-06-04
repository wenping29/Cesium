# 部署指南

## 构建

```bash
npm run build
```

产物输出到 `dist/` 目录。

## 部署方式

### 1. Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /cesium/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 2. 阿里云 OSS / AWS S3

- 上传 `dist/` 目录到存储桶
- 开启静态网站托管
- 配置默认首页为 `index.html`
- 设置 404 页面为 `index.html`（支持 SPA 路由）
- 缓存策略：`assets/*` 和 `cesium/*` 设置 `max-age=31536000,public,immutable`

### 3. Vercel

在项目根目录创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 4. Docker

```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 环境变量

生产环境通过 `import.meta.env.VITE_*` 注入，构建时已编译进代码，无需在部署平台额外配置（除非重构）。
