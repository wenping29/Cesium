-- ========================================================
-- Cesium API - 数据库结构
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
-- 使用说明
-- ========================================================
-- 执行此文件:
--   sqlite3 cesium.db < schema.sql
--
-- 导入完整测试数据 (可选):
--   sqlite3 cesium.db < database-init.sql
-- ========================================================
