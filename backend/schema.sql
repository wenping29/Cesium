-- ========================================================
-- Cesium API - 数据库结构
-- ========================================================

-- ========================================================
-- Users 表 - 用户表
-- ========================================================
CREATE TABLE IF NOT EXISTS Users (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Username TEXT NOT NULL UNIQUE,
  Email TEXT NOT NULL UNIQUE,
  PasswordHash TEXT NOT NULL,
  CreatedAt TEXT NOT NULL,
  UpdatedAt TEXT
);

CREATE INDEX IF NOT EXISTS IX_Users_Username ON Users(Username);
CREATE INDEX IF NOT EXISTS IX_Users_Email ON Users(Email);

-- ========================================================
-- Roles 表 - 角色表
-- ========================================================
CREATE TABLE IF NOT EXISTS Roles (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Name TEXT NOT NULL UNIQUE,
  Description TEXT
);

CREATE INDEX IF NOT EXISTS IX_Roles_Name ON Roles(Name);

-- ========================================================
-- UserRoles 表 - 用户角色关联表
-- ========================================================
CREATE TABLE IF NOT EXISTS UserRoles (
  UserId INTEGER NOT NULL,
  RoleId INTEGER NOT NULL,
  PRIMARY KEY (UserId, RoleId),
  FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
  FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_UserRoles_UserId ON UserRoles(UserId);
CREATE INDEX IF NOT EXISTS IX_UserRoles_RoleId ON UserRoles(RoleId);

-- ========================================================
-- 初始化默认角色
-- ========================================================
INSERT OR IGNORE INTO Roles (Name, Description) VALUES
  ('Admin', 'Administrator with full access'),
  ('User', 'Standard user');

-- ========================================================
-- 使用说明
-- ========================================================
-- 执行此文件:
--   sqlite3 cesium.db < schema.sql
--
-- 导入测试数据 (可选):
--   sqlite3 cesium.db < seed-data.sql
-- ========================================================
