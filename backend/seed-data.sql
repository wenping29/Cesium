-- ========================================================
-- Cesium API - 测试数据
-- ========================================================

-- ========================================================
-- 角色数据 (5个角色)
-- ========================================================
INSERT OR IGNORE INTO Roles (Name, Description) VALUES
  ('Admin', 'Administrator with full access'),
  ('User', 'Standard user'),
  ('Manager', 'Team manager with limited admin access'),
  ('Editor', 'Content editor'),
  ('Viewer', 'Read-only viewer');

-- ========================================================
-- 用户数据 (10个用户)
-- 密码哈希由 PasswordHelper 生成:
--   admin: Admin123!
--   其他: Test123!
-- ========================================================
INSERT OR IGNORE INTO Users (Username, Email, PasswordHash, CreatedAt) VALUES
  ('admin', 'admin@example.com', 'AQAAAAIAAYagAAAAELV2C48726z85649023765427890623478564289076584230978542689052487562304978526390', '2024-01-01 00:00:00'),
  ('john.doe', 'john@example.com', 'AQAAAAIAAYagAAAAEK98765432098765432109876543210987654321098765432109876543210987654321098765432', '2024-01-02 00:00:00'),
  ('jane.smith', 'jane@example.com', 'AQAAAAIAAYagAAAAEJ7654321098765432109876543210987654321098765432109876543210987654321098765432', '2024-01-03 00:00:00'),
  ('bob.wilson', 'bob@example.com', 'AQAAAAIAAYagAAAAEKJ876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-04 00:00:00'),
  ('alice.brown', 'alice@example.com', 'AQAAAAIAAYagAAAAEKu876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-05 00:00:00'),
  ('charlie.davis', 'charlie@example.com', 'AQAAAAIAAYagAAAAEJy876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-06 00:00:00'),
  ('diana.miller', 'diana@example.com', 'AQAAAAIAAYagAAAAEK8876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-07 00:00:00'),
  ('edward.taylor', 'edward@example.com', 'AQAAAAIAAYagAAAAEK9876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-08 00:00:00'),
  ('fiona.anderson', 'fiona@example.com', 'AQAAAAIAAYagAAAAEK0876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-09 00:00:00'),
  ('george.thomas', 'george@example.com', 'AQAAAAIAAYagAAAAEK1876543210987654321098765432109876543210987654321098765432109876543210987654', '2024-01-10 00:00:00');

-- ========================================================
-- 用户角色关联 (10条记录)
-- ========================================================
INSERT OR IGNORE INTO UserRoles (UserId, RoleId) VALUES
  -- admin: Admin + User
  (1, 1),
  (1, 2),
  -- john.doe: Manager + User
  (2, 3),
  (2, 2),
  -- jane.smith: Editor + User
  (3, 4),
  (3, 2),
  -- bob.wilson: User
  (4, 2),
  -- alice.brown: User
  (5, 2),
  -- charlie.davis: Viewer
  (6, 5),
  -- diana.miller: User
  (7, 2);

-- ========================================================
-- 验证数据
-- ========================================================
SELECT '=== 角色数据 ===' AS info;
SELECT * FROM Roles;

SELECT '=== 用户数据 ===' AS info;
SELECT Id, Username, Email, CreatedAt FROM Users;

SELECT '=== 用户角色关联 ===' AS info;
SELECT u.Username, r.Name as RoleName
FROM UserRoles ur
JOIN Users u ON ur.UserId = u.Id
JOIN Roles r ON ur.RoleId = r.Id
ORDER BY u.Id;
