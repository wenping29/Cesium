# Cesium Web 项目

一个基于 React + .NET WebAPI 的 Cesium 地图可视化平台。

## 项目结构

```
.
├── backend/                 # .NET WebAPI 后端
│   ├── src/
│   │   ├── Controllers/    # API 控制器
│   │   ├── Models/         # 数据模型
│   │   ├── DTOs/           # 数据传输对象
│   │   ├── Data/           # 数据库上下文
│   │   ├── Services/       # 业务服务
│   │   └── Helpers/        # 辅助工具
│   ├── seed-data/         # 测试数据生成工具
│   ├── Program.cs          # 应用入口
│   ├── CesiumApi.csproj    # 项目文件
│   ├── appsettings.json    # 配置文件
│   ├── schema.sql          # 数据库结构
│   ├── seed-data.sql       # 测试数据脚本
│   ├── init-db.ps1         # Windows 数据库初始化脚本
│   ├── init-db.sh         # Linux/macOS 数据库初始化脚本
│   ├── DATABASE.md        # 数据库详细说明
│   └── cesium.db           # SQLite 数据库
├── MS_Web/                 # React 前端
│   ├── src/
│   │   ├── pages/          # 页面组件
│   │   ├── components/     # 通用组件
│   │   ├── store/          # Zustand 状态管理
│   │   ├── api/            # API 请求封装
│   │   └── App.jsx         # 路由配置
│   └── package.json
└── react-axios-mock/       # 旧版前端（Mock数据）
```

## 功能特性

### 后端 API (.NET 9.0)

- ✅ JWT 身份认证
- ✅ Swagger API 文档
- ✅ SQLite 数据库
- ✅ 用户注册/登录
- ✅ 修改密码
- ✅ 获取用户信息
- ✅ 角色管理 (Admin, User, Manager, Editor, Viewer)
- ✅ 基于角色的授权

### 前端 (React 19 + MUI)

- ✅ 登录页面
- ✅ 用户管理
- ✅ 修改密码
- ✅ 编辑个人资料
- ✅ Cesium 地图可视化
- ✅ 大屏展示
- ✅ 多语言支持 (i18next)
- ✅ 响应式设计

## 快速开始

### 前置要求

- .NET 9.0 SDK
- Node.js 18+
- npm 或 yarn

### 启动后端

```bash
cd backend
dotnet run
```

后端将在 `https://localhost:5001` 启动

访问 Swagger 文档: `https://localhost:5001/swagger`

### 启动前端

```bash
cd MS_Web
npm install
npm run dev
```

前端将在 `http://localhost:5173` 启动
https://element-plus-admin.cn/#/dashboard/analysis

https://preview.pro.ant.design/user/login?redirect=%2Fuser%2Flogin%2F%3Fredirect%3D%252Fwelcome%252F
## 测试账号

系统预置了以下测试账号（所有用户密码均已加密存储）：

| 用户名 | 邮箱 | 密码 | 角色 | 说明 |
|--------|------|------|------|------|
| admin | admin@example.com | Admin123! | Admin, User | 系统管理员，拥有全部权限 |
| john.doe | john@example.com | Test123! | Manager, User | 经理角色 |
| jane.smith | jane@example.com | Test123! | Editor, User | 编辑角色 |
| bob.wilson | bob@example.com | Test123! | User | 普通用户 |
| alice.brown | alice@example.com | Test123! | User | 普通用户 |
| charlie.davis | charlie@example.com | Test123! | Viewer | 只读用户 |
| diana.miller | diana@example.com | Test123! | User | 普通用户 |
| edward.taylor | edward@example.com | Test123! | - | 无角色用户 |
| fiona.anderson | fiona@example.com | Test123! | - | 无角色用户 |
| george.thomas | george@example.com | Test123! | - | 无角色用户 |

## 角色说明

| 角色 | 权限 |
|------|------|
| Admin | 全部权限，包括用户管理、角色分配 |
| Manager | 管理权限 |
| Editor | 编辑权限 |
| User | 普通用户权限 |
| Viewer | 只读权限 |

## API 接口

### 认证接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | - |
| POST | `/api/auth/login` | 用户登录 | - |
| PUT | `/api/auth/change-password` | 修改密码 | ✅ |

### 用户接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/user/profile` | 获取当前用户信息 | ✅ |
| GET | `/api/user/all` | 获取所有用户 | Admin |
| POST | `/api/user/{userId}/roles/{roleName}` | 为用户添加角色 | Admin |
| DELETE | `/api/user/{userId}/roles/{roleName}` | 移除用户角色 | Admin |

## 数据库

### 表结构

- **Users**: 用户表
- **Roles**: 角色表
- **UserRoles**: 用户角色关联表

### SQL 脚本

| 文件 | 说明 |
|------|------|
| `schema.sql` | 数据库结构（表、索引、默认角色） |
| `seed-data.sql` | 测试数据（包含10个用户和角色关联） |
| `init-db.ps1` | Windows 一键初始化脚本 |
| `init-db.sh` | Linux/macOS 一键初始化脚本 |

### 初始化数据库

#### 方式一：自动初始化（推荐）

直接运行 WebAPI，数据库会在首次启动时自动创建。

```bash
cd backend
dotnet run
```

#### 方式二：使用初始化脚本

Windows (PowerShell):
```powershell
.\init-db.ps1
```

Linux/macOS:
```bash
chmod +x init-db.sh
./init-db.sh
```

#### 方式三：手动执行 SQL

```bash
# 创建表结构
sqlite3 cesium.db < schema.sql

# 生成测试数据（需要 .NET SDK）
cd seed-data
dotnet run
```

### 重置数据库

```bash
cd backend
rm cesium.db

# 重启 WebAPI 或运行初始化脚本
```

详细数据库说明请参考 `backend/DATABASE.md`

## 开发说明

### 后端配置

配置文件: `backend/appsettings.json`

```json
{
  "Jwt": {
    "Key": "CesiumSecretKeyMustBeAtLeast32CharactersLongForSecurity",
    "Issuer": "CesiumApi",
    "Audience": "CesiumApp",
    "ExpireDays": "7"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=cesium.db"
  }
}
```

### 前端 API 配置

配置文件: `MS_Web/src/api/index.js`

```javascript
const request = axios.create({
  baseURL: 'https://localhost:5001/api',
  timeout: 10000,
})
```

## 技术栈

### 后端

- .NET 9.0 WebAPI
- Entity Framework Core
- SQLite
- JWT Bearer Authentication
- Swashbuckle (Swagger)

### 前端

- React 19
- Vite
- Material-UI
- Zustand (状态管理)
- React Router
- Axios
- i18next
- Cesium.js
- Leaflet
- OpenLayers

## License

MIT
