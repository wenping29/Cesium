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
│   ├── Migrations/         # EF Core 迁移文件
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
│   │   ├── i18n/           # 国际化语言文件
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
- ✅ 用户管理 (CRUD)
- ✅ 角色管理 (Admin, User, Manager, Editor, Viewer)
- ✅ 部门管理 (树形结构)
- ✅ 菜单管理 (树形结构，权限控制)
- ✅ 基于角色的授权
- ✅ 通知/消息管理
- ✅ 考勤管理
- ✅ 工时报表
- ✅ 休假管理
- ✅ 年假管理
- ✅ 登录日志
- ✅ 访客日志
- ✅ 审计日志
- ✅ 仪表板统计数据

### 前端 (React 19 + MUI)

- ✅ 登录页面
- ✅ 用户管理 (含搜索筛选功能)
- ✅ 角色管理 (含搜索筛选功能)
- ✅ 部门管理 (含搜索筛选功能，树形显示)
- ✅ 菜单管理 (含搜索筛选功能，树形显示)
- ✅ 通知中心 (含搜索筛选功能)
- ✅ 消息管理 (含搜索筛选功能)
- ✅ 修改密码
- ✅ 编辑个人资料
- ✅ 工作台
- ✅ 数据分析
- ✅ 考勤报表
- ✅ 工时报表
- ✅ 休假报表
- ✅ 年假报表
- ✅ 登录日志
- ✅ 访客日志
- ✅ 审计日志
- ✅ Cesium 地图可视化
- ✅ Leaflet 地图
- ✅ OpenLayers 地图
- ✅ 大屏展示
- ✅ 多语言支持 (i18next: 中文/英文/日文)
- ✅ 主题切换 (浅色/深色/海洋/森林/日落/午夜)
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

## 数据库

### 表结构

- **Users**: 用户表
- **Roles**: 角色表
- **UserRoles**: 用户角色关联表
- **Menus**: 菜单表
- **RoleMenus**: 角色菜单关联表
- **Departments**: 部门表
- **Notifications**: 通知表
- **AttendanceRecords**: 考勤记录表
- **WorkHourRecords**: 工时记录表
- **LeaveRecords**: 休假记录表
- **AnnualLeaveRecords**: 年假记录表
- **LoginLogs**: 登录日志表
- **VisitorLogs**: 访客日志表
- **AuditLogs**: 审计日志表

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
| GET | `/api/user/{id}` | 获取单个用户 | Admin |
| POST | `/api/user` | 创建用户 | Admin |
| PUT | `/api/user/{id}` | 更新用户 | Admin |
| DELETE | `/api/user/{id}` | 删除用户 | Admin |
| POST | `/api/user/{userId}/roles/{roleName}` | 为用户添加角色 | Admin |
| DELETE | `/api/user/{userId}/roles/{roleName}` | 移除用户角色 | Admin |

### 角色接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/role/all` | 获取所有角色 | Admin |
| GET | `/api/role/{id}` | 获取单个角色 | Admin |
| POST | `/api/role` | 创建角色 | Admin |
| PUT | `/api/role/{id}` | 更新角色 | Admin |
| DELETE | `/api/role/{id}` | 删除角色 | Admin |

### 部门接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/department/all` | 获取所有部门 | Admin |
| GET | `/api/department/{id}` | 获取单个部门 | Admin |
| POST | `/api/department` | 创建部门 | Admin |
| PUT | `/api/department/{id}` | 更新部门 | Admin |
| DELETE | `/api/department/{id}` | 删除部门 | Admin |

### 菜单接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/menu/all` | 获取所有菜单 | Admin |
| GET | `/api/menu/user` | 获取当前用户菜单 | ✅ |
| GET | `/api/menu/{id}` | 获取单个菜单 | Admin |
| POST | `/api/menu` | 创建菜单 | Admin |
| PUT | `/api/menu/{id}` | 更新菜单 | Admin |
| DELETE | `/api/menu/{id}` | 删除菜单 | Admin |

### 通知接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/notification` | 获取当前用户通知 | ✅ |
| GET | `/api/notification/all` | 获取所有通知 | Admin |
| GET | `/api/notification/{id}` | 获取单个通知 | ✅ |
| POST | `/api/notification` | 创建通知 | Admin |
| PUT | `/api/notification/{id}/read` | 标记为已读 | ✅ |
| PUT | `/api/notification/read-all` | 全部标记为已读 | ✅ |
| DELETE | `/api/notification/{id}` | 删除通知 | ✅ |

### 考勤接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/attendance` | 获取考勤记录 | ✅ |
| POST | `/api/attendance/check-in` | 签到 | ✅ |
| POST | `/api/attendance/check-out` | 签退 | ✅ |

### 日志接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/loginlogs` | 获取登录日志 | Admin |
| GET | `/api/visitors` | 获取访客日志 | - |
| POST | `/api/visitors` | 记录访客日志 | - |

### 仪表板接口

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | `/api/dashboard/stats` | 获取统计数据 | ✅ |

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

### 页面查询筛选功能

所有管理页面都支持统一的查询筛选功能：

- **搜索框**: 支持按名称/标题搜索
- **筛选下拉框**: 按类型/状态/部门等筛选
- **查询按钮**: 点击后应用筛选条件
- **重置按钮**: 一键清空所有筛选

已实现查询筛选的页面：
- 用户管理
- 角色管理
- 部门管理
- 菜单管理
- 通知中心
- 消息管理

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
- Material-UI (MUI)
- Zustand (状态管理)
- React Router
- Axios
- i18next (多语言)
- Cesium.js
- Leaflet
- OpenLayers

## License

MIT
