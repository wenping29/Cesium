# 数据库说明

## 数据库文件

- `cesium.db` - SQLite 数据库文件

## 初始化数据库

### 方式一：自动初始化（推荐）

直接运行 WebAPI，数据库会在首次启动时自动创建并初始化角色数据。

```bash
dotnet run
```

### 方式二：使用初始化脚本

Windows (PowerShell):
```powershell
.\init-db.ps1
```

Linux/macOS:
```bash
chmod +x init-db.sh
./init-db.sh
```

### 方式三：手动执行 SQL

```bash
# 创建表结构
sqlite3 cesium.db < schema.sql

# 导入测试数据 (需要先运行 seed-data 项目)
cd seed-data
dotnet run
```

## SQL 文件说明

- `schema.sql` - 数据库结构（表、索引、默认角色）
- `seed-data.sql` - 测试数据脚本（仅供参考，密码哈希需使用 .NET 程序生成）

## 测试数据

### 角色

| ID | 角色名 | 说明 |
|----|--------|------|
| 1 | Admin | 管理员 |
| 2 | User | 普通用户 |
| 3 | Manager | 经理 |
| 4 | Editor | 编辑 |
| 5 | Viewer | 只读用户 |

### 用户

| 用户名 | 邮箱 | 密码 | 角色 |
|--------|------|------|------|
| admin | admin@example.com | Admin123! | Admin, User |
| john.doe | john@example.com | Test123! | Manager, User |
| jane.smith | jane@example.com | Test123! | Editor, User |
| bob.wilson | bob@example.com | Test123! | User |
| alice.brown | alice@example.com | Test123! | User |
| charlie.davis | charlie@example.com | Test123! | Viewer |
| diana.miller | diana@example.com | Test123! | User |
| edward.taylor | edward@example.com | Test123! | - |
| fiona.anderson | fiona@example.com | Test123! | - |
| george.thomas | george@example.com | Test123! | - |

## 重置数据库

```bash
# 删除数据库文件
rm cesium.db

# 重启 WebAPI 或运行初始化脚本
```
