-- ========================================================
-- Cesium API - 完整数据库初始化脚本
-- ========================================================

-- ========================================================
-- 1. Users 表 - 用户表
-- ========================================================
CREATE TABLE IF NOT EXISTS Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    Phone TEXT,
    Avatar TEXT,
    DepartmentId INTEGER,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_Users_Username ON Users(Username);
CREATE INDEX IF NOT EXISTS IX_Users_Email ON Users(Email);
CREATE INDEX IF NOT EXISTS IX_Users_DepartmentId ON Users(DepartmentId);

-- ========================================================
-- 2. Roles 表 - 角色表
-- ========================================================
CREATE TABLE IF NOT EXISTS Roles (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL UNIQUE,
    Description TEXT,
    CreatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TEXT
);

CREATE INDEX IF NOT EXISTS IX_Roles_Name ON Roles(Name);

-- ========================================================
-- 3. UserRoles 表 - 用户角色关联表
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
-- 4. Departments 表 - 部门表
-- ========================================================
CREATE TABLE IF NOT EXISTS Departments (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Code TEXT,
    ParentId INTEGER,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    Leader TEXT,
    Phone TEXT,
    Email TEXT,
    Address TEXT,
    IsActive INTEGER NOT NULL DEFAULT 1,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (ParentId) REFERENCES Departments(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_Departments_ParentId ON Departments(ParentId);
CREATE INDEX IF NOT EXISTS IX_Departments_Code ON Departments(Code);

-- ========================================================
-- 5. Menus 表 - 菜单表
-- ========================================================
CREATE TABLE IF NOT EXISTS Menus (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Path TEXT,
    Icon TEXT,
    ParentId INTEGER,
    SortOrder INTEGER NOT NULL DEFAULT 0,
    IsVisible INTEGER NOT NULL DEFAULT 1,
    Permission TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (ParentId) REFERENCES Menus(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_Menus_ParentId ON Menus(ParentId);

-- ========================================================
-- 6. RoleMenus 表 - 角色菜单关联表
-- ========================================================
CREATE TABLE IF NOT EXISTS RoleMenus (
    RoleId INTEGER NOT NULL,
    MenuId INTEGER NOT NULL,
    PRIMARY KEY (RoleId, MenuId),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE,
    FOREIGN KEY (MenuId) REFERENCES Menus(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_RoleMenus_RoleId ON RoleMenus(RoleId);
CREATE INDEX IF NOT EXISTS IX_RoleMenus_MenuId ON RoleMenus(MenuId);

-- ========================================================
-- 7. LoginLogs 表 - 登录日志表
-- ========================================================
CREATE TABLE IF NOT EXISTS LoginLogs (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Username TEXT NOT NULL,
    IpAddress TEXT,
    DeviceInfo TEXT,
    BrowserInfo TEXT,
    OsInfo TEXT,
    LoginTime TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_LoginLogs_UserId ON LoginLogs(UserId);
CREATE INDEX IF NOT EXISTS IX_LoginLogs_LoginTime ON LoginLogs(LoginTime);

-- ========================================================
-- 8. Notifications 表 - 通知表
-- ========================================================
CREATE TABLE IF NOT EXISTS Notifications (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Type TEXT NOT NULL,
    Sender TEXT NOT NULL,
    Date TEXT NOT NULL,
    Title TEXT NOT NULL,
    Content TEXT NOT NULL,
    Detail TEXT NOT NULL,
    Read INTEGER NOT NULL DEFAULT 0,
    Icon TEXT NOT NULL,
    Color TEXT NOT NULL,
    UserId INTEGER,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IF NOT EXISTS IX_Notifications_Type ON Notifications(Type);
CREATE INDEX IF NOT EXISTS IX_Notifications_Read ON Notifications(Read);
CREATE INDEX IF NOT EXISTS IX_Notifications_Date ON Notifications(Date);

-- ========================================================
-- 9. VisitorLogs 表 - 访客记录表
-- ========================================================
CREATE TABLE IF NOT EXISTS VisitorLogs (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    IpAddress TEXT NOT NULL,
    UserAgent TEXT,
    PageUrl TEXT NOT NULL,
    Referrer TEXT,
    Country TEXT,
    Region TEXT,
    City TEXT,
    DeviceType TEXT,
    Browser TEXT,
    Os TEXT,
    SessionId TEXT,
    Duration INTEGER DEFAULT 0,
    UserId INTEGER,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_VisitorLogs_CreatedAt ON VisitorLogs(CreatedAt);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_IpAddress ON VisitorLogs(IpAddress);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_UserId ON VisitorLogs(UserId);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_SessionId ON VisitorLogs(SessionId);
CREATE INDEX IF NOT EXISTS IX_VisitorLogs_PageUrl ON VisitorLogs(PageUrl);

-- ========================================================
-- 10. AnnualLeaveRecords 表 - 年假记录表
-- ========================================================
CREATE TABLE IF NOT EXISTS AnnualLeaveRecords (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Year INTEGER NOT NULL,
    TotalDays REAL NOT NULL,
    UsedDays REAL NOT NULL,
    RemainingDays REAL NOT NULL,
    CarriedOverDays REAL NOT NULL DEFAULT 0,
    Remark TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_AnnualLeaveRecords_UserId ON AnnualLeaveRecords(UserId);
CREATE INDEX IF NOT EXISTS IX_AnnualLeaveRecords_Year ON AnnualLeaveRecords(Year);
CREATE UNIQUE INDEX IF NOT EXISTS IX_AnnualLeaveRecords_UserYear ON AnnualLeaveRecords(UserId, Year);

-- ========================================================
-- 11. AttendanceRecords 表 - 考勤记录表
-- ========================================================
CREATE TABLE IF NOT EXISTS AttendanceRecords (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Date TEXT NOT NULL,
    CheckInTime TEXT,
    CheckOutTime TEXT,
    Status TEXT NOT NULL DEFAULT 'normal',
    Remark TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_AttendanceRecords_UserId ON AttendanceRecords(UserId);
CREATE INDEX IF NOT EXISTS IX_AttendanceRecords_Date ON AttendanceRecords(Date);
CREATE INDEX IF NOT EXISTS IX_AttendanceRecords_Status ON AttendanceRecords(Status);

-- ========================================================
-- 12. LeaveRecords 表 - 请假记录表
-- ========================================================
CREATE TABLE IF NOT EXISTS LeaveRecords (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    LeaveType TEXT NOT NULL DEFAULT 'personal',
    StartDate TEXT NOT NULL,
    EndDate TEXT NOT NULL,
    Days REAL NOT NULL,
    Hours REAL NOT NULL DEFAULT 0,
    Status TEXT NOT NULL DEFAULT 'pending',
    Reason TEXT,
    Remark TEXT,
    ApproverId INTEGER,
    ApprovedAt TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (ApproverId) REFERENCES Users(Id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS IX_LeaveRecords_UserId ON LeaveRecords(UserId);
CREATE INDEX IF NOT EXISTS IX_LeaveRecords_Status ON LeaveRecords(Status);
CREATE INDEX IF NOT EXISTS IX_LeaveRecords_LeaveType ON LeaveRecords(LeaveType);
CREATE INDEX IF NOT EXISTS IX_LeaveRecords_StartDate ON LeaveRecords(StartDate);

-- ========================================================
-- 13. WorkHourRecords 表 - 工时记录表
-- ========================================================
CREATE TABLE IF NOT EXISTS WorkHourRecords (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    Date TEXT NOT NULL,
    RegularHours REAL NOT NULL DEFAULT 0,
    OvertimeHours REAL NOT NULL DEFAULT 0,
    WeekendHours REAL NOT NULL DEFAULT 0,
    HolidayHours REAL NOT NULL DEFAULT 0,
    ProjectName TEXT,
    TaskDescription TEXT,
    Remark TEXT,
    CreatedAt TEXT NOT NULL,
    UpdatedAt TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IX_WorkHourRecords_UserId ON WorkHourRecords(UserId);
CREATE INDEX IF NOT EXISTS IX_WorkHourRecords_Date ON WorkHourRecords(Date);

-- ========================================================
-- 初始化数据
-- ========================================================

-- 初始化角色数据
INSERT OR IGNORE INTO Roles (Name, Description, CreatedAt) VALUES
    ('Admin', '管理员 - 拥有全部权限', CURRENT_TIMESTAMP),
    ('User', '普通用户 - 基本功能权限', CURRENT_TIMESTAMP),
    ('Manager', '部门经理 - 部门管理权限', CURRENT_TIMESTAMP),
    ('Editor', '编辑 - 内容编辑权限', CURRENT_TIMESTAMP),
    ('Viewer', '查看者 - 只读权限', CURRENT_TIMESTAMP);

-- 初始化部门数据
INSERT OR IGNORE INTO Departments (Name, Code, ParentId, SortOrder, Leader, IsActive, CreatedAt) VALUES
    ('总公司', 'HQ', NULL, 0, '张总', 1, CURRENT_TIMESTAMP),
    ('技术部', 'TECH', 1, 1, '李经理', 1, CURRENT_TIMESTAMP),
    ('市场部', 'MARKET', 1, 2, '王经理', 1, CURRENT_TIMESTAMP),
    ('人事部', 'HR', 1, 3, '赵经理', 1, CURRENT_TIMESTAMP),
    ('财务部', 'FINANCE', 1, 4, '孙经理', 1, CURRENT_TIMESTAMP),
    ('运维部', 'OPS', 1, 5, '周经理', 1, CURRENT_TIMESTAMP),
    ('前端组', 'FE', 2, 1, '吴组长', 1, CURRENT_TIMESTAMP),
    ('后端组', 'BE', 2, 2, '郑组长', 1, CURRENT_TIMESTAMP),
    ('测试组', 'QA', 2, 3, '冯组长', 1, CURRENT_TIMESTAMP),
    ('销售组', 'SALES', 3, 1, '陈组长', 1, CURRENT_TIMESTAMP);

-- 初始化用户数据 (密码都是: Admin123!)
INSERT OR IGNORE INTO Users (Username, Email, PasswordHash, Phone, DepartmentId, IsActive, CreatedAt) VALUES
    ('admin', 'admin@example.com', 'AQAAAAIAAYagAAAAELV2C48726z85649023765427890623478564289076584230978542689052487562304978526390', '13800138000', 1, 1, '2024-01-01 00:00:00'),
    ('john.doe', 'john@example.com', 'AQAAAAIAAYagAAAAEK987654321098765432109876543210987654321098765432109876543210987654321098765432', '13800138001', 2, 1, '2024-01-02 00:00:00'),
    ('jane.smith', 'jane@example.com', 'AQAAAAIAAYagAAAAEJ7654321098765432109876543210987654321098765432109876543210987654321098765432', '13800138002', 7, 1, '2024-01-03 00:00:00'),
    ('bob.wilson', 'bob@example.com', 'AQAAAAIAAYagAAAAEKJ876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138003', 8, 1, '2024-01-04 00:00:00'),
    ('alice.brown', 'alice@example.com', 'AQAAAAIAAYagAAAAEKu876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138004', 4, 1, '2024-01-05 00:00:00'),
    ('charlie.davis', 'charlie@example.com', 'AQAAAAIAAYagAAAAEJy876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138005', 5, 1, '2024-01-06 00:00:00'),
    ('diana.miller', 'diana@example.com', 'AQAAAAIAAYagAAAAEK8876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138006', 3, 1, '2024-01-07 00:00:00'),
    ('edward.taylor', 'edward@example.com', 'AQAAAAIAAYagAAAAEK9876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138007', 9, 1, '2024-01-08 00:00:00'),
    ('fiona.anderson', 'fiona@example.com', 'AQAAAAIAAYagAAAAEK0876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138008', 6, 1, '2024-01-09 00:00:00'),
    ('george.thomas', 'george@example.com', 'AQAAAAIAAYagAAAAEK1876543210987654321098765432109876543210987654321098765432109876543210987654', '13800138009', 10, 1, '2024-01-10 00:00:00');

-- 初始化用户角色关联
INSERT OR IGNORE INTO UserRoles (UserId, RoleId) VALUES
    (1, 1), (1, 2),
    (2, 3), (2, 2),
    (3, 4), (3, 2),
    (4, 2),
    (5, 2),
    (6, 5),
    (7, 2),
    (8, 2),
    (9, 2),
    (10, 2);

-- 初始化菜单数据
INSERT OR IGNORE INTO Menus (Name, Path, Icon, ParentId, SortOrder, IsVisible, Permission, CreatedAt) VALUES
    ('仪表盘', '/dashboard', 'Dashboard', NULL, 1, 1, NULL, CURRENT_TIMESTAMP),
    ('用户管理', '/users', 'Users', NULL, 2, 1, 'user.view', CURRENT_TIMESTAMP),
    ('角色管理', '/roles', 'UserGroup', NULL, 3, 1, 'role.view', CURRENT_TIMESTAMP),
    ('部门管理', '/departments', 'Apartment', NULL, 4, 1, 'department.view', CURRENT_TIMESTAMP),
    ('菜单管理', '/menus', 'Menu', NULL, 5, 1, 'menu.view', CURRENT_TIMESTAMP),
    ('考勤管理', '/attendance', 'Calendar', NULL, 6, 1, 'attendance.view', CURRENT_TIMESTAMP),
    ('请假管理', '/leaves', 'ToDoList', NULL, 7, 1, 'leave.view', CURRENT_TIMESTAMP),
    ('工时管理', '/workhours', 'Clock', NULL, 8, 1, 'workhour.view', CURRENT_TIMESTAMP),
    ('年假管理', '/annual-leaves', 'Money', NULL, 9, 1, 'annualleave.view', CURRENT_TIMESTAMP),
    ('通知管理', '/notifications', 'Bell', NULL, 10, 1, 'notification.view', CURRENT_TIMESTAMP),
    ('访客记录', '/visitors', 'Team', NULL, 11, 1, 'visitor.view', CURRENT_TIMESTAMP),
    ('登录日志', '/login-logs', 'History', NULL, 12, 1, 'loginlog.view', CURRENT_TIMESTAMP),
    ('用户列表', '/users/list', NULL, 2, 1, 'user.view', CURRENT_TIMESTAMP),
    ('添加用户', '/users/add', NULL, 2, 2, 'user.create', CURRENT_TIMESTAMP);

-- 初始化角色菜单关联 (管理员拥有全部菜单)
INSERT OR IGNORE INTO RoleMenus (RoleId, MenuId)
SELECT 1, Id FROM Menus;

-- 初始化通知数据
INSERT OR IGNORE INTO Notifications (Type, Sender, Date, Title, Content, Detail, Read, Icon, Color, UserId, CreatedAt) VALUES
    ('system', '系统管理员', '2024-01-15 18:50', '系统更新通知', '系统将于今晚22:00进行维护升级，请提前保存工作内容。', '本次维护将进行以下更新：\n1. 系统安全补丁\n2. 性能优化\n3. 新功能上线\n\n预计维护时间为2小时，期间系统将无法访问。请各位同事提前保存好工作内容，避免数据丢失。如有紧急问题，请联系IT支持。', 0, 'SystemUpdate', 'primary', 1, '2024-01-15 18:50:00'),
    ('task', '张三', '2024-01-15 18:30', '收到新任务', '张三给您分配了一个新任务：完成Q4财务报表。', '任务详情：\n\n任务名称：完成Q4财务报表\n截止日期：2024-01-20\n任务描述：需要完成第四季度的财务报表统计，包括收入、支出、利润等数据的汇总和分析。\n\n相关文件：\n- Q3财务报表.xlsx\n- 12月账单.pdf', 0, 'Assignment', 'success', 1, '2024-01-15 18:30:00'),
    ('task', '系统提醒', '2024-01-15 18:00', '任务提醒', '您的任务"项目规划"将在明天截止，请尽快完成。', '任务提醒：\n\n任务名称：项目规划\n截止日期：2024-01-16\n当前进度：80%\n\n剩余工作：\n- 风险评估\n- 资源分配\n\n请尽快完成剩余工作，确保项目按时交付。', 0, 'Assignment', 'warning', 1, '2024-01-15 18:00:00'),
    ('system', '会议助手', '2024-01-15 16:00', '会议提醒', '下午14:00的周会即将开始，请准时参加。', '会议详情：\n\n会议名称：部门周会\n时间：2024-01-16 14:00-15:00\n地点：301会议室\n参会人员：所有部门成员\n\n会议议程：\n1. 上周工作总结\n2. 本周工作安排\n3. 问题讨论\n4. 其他事项', 1, 'Event', 'info', 1, '2024-01-15 16:00:00');

-- 初始化访客日志数据
INSERT OR IGNORE INTO VisitorLogs (IpAddress, UserAgent, PageUrl, Referrer, Country, Region, City, DeviceType, Browser, Os, SessionId, Duration, UserId, CreatedAt) VALUES
    ('192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', '/', 'https://google.com', '中国', '北京', '北京', 'Desktop', 'Chrome', 'Windows 10', 'session-001', 120, 1, '2024-01-15 10:00:00'),
    ('192.168.1.101', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', '/dashboard', '', '中国', '上海', '上海', 'Mobile', 'Safari', 'iOS 17', 'session-002', 180, NULL, '2024-01-15 10:15:00'),
    ('192.168.1.102', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)', '/profile', 'https://github.com', '中国', '广东', '深圳', 'Desktop', 'Chrome', 'macOS 14', 'session-003', 90, 2, '2024-01-15 10:30:00'),
    ('192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '/dashboard', '/', '中国', '北京', '北京', 'Desktop', 'Chrome', 'Windows 10', 'session-001', 300, 1, '2024-01-15 12:00:00');

-- 初始化登录日志数据
INSERT OR IGNORE INTO LoginLogs (UserId, Username, IpAddress, DeviceInfo, BrowserInfo, OsInfo, LoginTime, CreatedAt) VALUES
    (1, 'admin', '192.168.1.100', 'Windows PC', 'Chrome 120', 'Windows 10', '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
    (2, 'john.doe', '192.168.1.101', 'MacBook Pro', 'Safari 17', 'macOS Sonoma', '2024-01-15 09:15:00', '2024-01-15 09:15:00'),
    (1, 'admin', '192.168.1.100', 'Windows PC', 'Chrome 120', 'Windows 10', '2024-01-15 14:30:00', '2024-01-15 14:30:00');

-- 初始化年假记录
INSERT OR IGNORE INTO AnnualLeaveRecords (UserId, Year, TotalDays, UsedDays, RemainingDays, CarriedOverDays, Remark, CreatedAt) VALUES
    (1, 2024, 15, 3, 12, 0, '2024年度年假', '2024-01-01 00:00:00'),
    (2, 2024, 15, 5, 10, 0, '2024年度年假', '2024-01-01 00:00:00'),
    (3, 2024, 10, 2, 8, 0, '2024年度年假', '2024-01-01 00:00:00'),
    (4, 2024, 10, 0, 10, 0, '2024年度年假', '2024-01-01 00:00:00'),
    (5, 2024, 12, 1, 11, 0, '2024年度年假', '2024-01-01 00:00:00');

-- 初始化考勤记录
INSERT OR IGNORE INTO AttendanceRecords (UserId, Date, CheckInTime, CheckOutTime, Status, Remark, CreatedAt) VALUES
    (1, '2024-01-15', '09:00:00', '18:00:00', 'normal', NULL, '2024-01-15 18:00:00'),
    (2, '2024-01-15', '09:15:00', '18:30:00', 'late', '迟到15分钟', '2024-01-15 18:30:00'),
    (3, '2024-01-15', '08:50:00', '17:45:00', 'normal', NULL, '2024-01-15 17:45:00'),
    (1, '2024-01-16', '08:55:00', '18:10:00', 'normal', NULL, '2024-01-16 18:10:00');

-- 初始化请假记录
INSERT OR IGNORE INTO LeaveRecords (UserId, LeaveType, StartDate, EndDate, Days, Hours, Status, Reason, Remark, ApproverId, ApprovedAt, CreatedAt) VALUES
    (2, 'personal', '2024-01-18', '2024-01-19', 2, 0, 'pending', '家里有事需要处理', NULL, NULL, NULL, '2024-01-15 10:00:00'),
    (3, 'sick', '2024-01-17', '2024-01-17', 1, 0, 'approved', '身体不适，请假休息', NULL, 1, '2024-01-15 11:00:00', '2024-01-15 09:00:00'),
    (4, 'annual', '2024-01-20', '2024-01-22', 3, 0, 'approved', '申请年假外出旅游', '已经安排好工作', 1, '2024-01-15 14:00:00', '2024-01-15 12:00:00');

-- 初始化工时记录
INSERT OR IGNORE INTO WorkHourRecords (UserId, Date, RegularHours, OvertimeHours, WeekendHours, HolidayHours, ProjectName, TaskDescription, Remark, CreatedAt) VALUES
    (1, '2024-01-15', 8, 0, 0, 0, '内部管理系统', '开发用户管理模块', NULL, '2024-01-15 18:00:00'),
    (1, '2024-01-16', 8, 2, 0, 0, '内部管理系统', '开发角色权限模块', '紧急需求加班', '2024-01-16 20:00:00'),
    (2, '2024-01-15', 8, 0, 0, 0, '客户项目A', '前端页面开发', NULL, '2024-01-15 18:00:00'),
    (3, '2024-01-15', 7, 0, 0, 0, '客户项目B', 'UI设计', '下午请假', '2024-01-15 17:00:00');

-- ========================================================
-- 验证数据
-- ========================================================

SELECT '=== 数据库初始化完成 ===' AS Status;

SELECT '表统计' AS Info;
SELECT
    (SELECT COUNT(*) FROM Users) AS UserCount,
    (SELECT COUNT(*) FROM Roles) AS RoleCount,
    (SELECT COUNT(*) FROM UserRoles) AS UserRoleCount,
    (SELECT COUNT(*) FROM Departments) AS DepartmentCount,
    (SELECT COUNT(*) FROM Menus) AS MenuCount,
    (SELECT COUNT(*) FROM RoleMenus) AS RoleMenuCount,
    (SELECT COUNT(*) FROM LoginLogs) AS LoginLogCount,
    (SELECT COUNT(*) FROM Notifications) AS NotificationCount,
    (SELECT COUNT(*) FROM VisitorLogs) AS VisitorLogCount,
    (SELECT COUNT(*) FROM AnnualLeaveRecords) AS AnnualLeaveCount,
    (SELECT COUNT(*) FROM AttendanceRecords) AS AttendanceCount,
    (SELECT COUNT(*) FROM LeaveRecords) AS LeaveCount,
    (SELECT COUNT(*) FROM WorkHourRecords) AS WorkHourCount;
