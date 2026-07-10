CREATE TABLE IF NOT EXISTS "Departments" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_Departments" PRIMARY KEY AUTOINCREMENT,

    "Name" TEXT NOT NULL,

    "Code" TEXT NULL,

    "ParentId" INTEGER NULL,

    "SortOrder" INTEGER NOT NULL,

    "Leader" TEXT NULL,

    "Phone" TEXT NULL,

    "Email" TEXT NULL,

    "Address" TEXT NULL,

    "IsActive" INTEGER NOT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_Departments_Departments_ParentId" FOREIGN KEY ("ParentId") REFERENCES "Departments" ("Id") ON DELETE RESTRICT

);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE IF NOT EXISTS "Menus" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_Menus" PRIMARY KEY AUTOINCREMENT,

    "Name" TEXT NOT NULL,

    "Path" TEXT NULL,

    "Icon" TEXT NULL,

    "ParentId" INTEGER NULL,

    "SortOrder" INTEGER NOT NULL,

    "IsVisible" INTEGER NOT NULL,

    "Permission" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_Menus_Menus_ParentId" FOREIGN KEY ("ParentId") REFERENCES "Menus" ("Id") ON DELETE RESTRICT

);
CREATE TABLE IF NOT EXISTS "Roles" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_Roles" PRIMARY KEY AUTOINCREMENT,

    "Name" TEXT NOT NULL,

    "Description" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL

);
CREATE TABLE IF NOT EXISTS "RoleMenus" (

    "RoleId" INTEGER NOT NULL,

    "MenuId" INTEGER NOT NULL,

    CONSTRAINT "PK_RoleMenus" PRIMARY KEY ("RoleId", "MenuId"),

    CONSTRAINT "FK_RoleMenus_Menus_MenuId" FOREIGN KEY ("MenuId") REFERENCES "Menus" ("Id") ON DELETE CASCADE,

    CONSTRAINT "FK_RoleMenus_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE CASCADE

);
CREATE TABLE IF NOT EXISTS "AnnualLeaveRecords" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_AnnualLeaveRecords" PRIMARY KEY AUTOINCREMENT,

    "UserId" INTEGER NOT NULL,

    "Year" INTEGER NOT NULL,

    "TotalDays" TEXT NOT NULL,

    "UsedDays" TEXT NOT NULL,

    "RemainingDays" TEXT NOT NULL,

    "CarriedOverDays" TEXT NOT NULL,

    "Remark" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_AnnualLeaveRecords_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE

);
CREATE TABLE IF NOT EXISTS "AttendanceRecords" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_AttendanceRecords" PRIMARY KEY AUTOINCREMENT,

    "UserId" INTEGER NOT NULL,

    "Date" TEXT NOT NULL,

    "CheckInTime" TEXT NULL,

    "CheckOutTime" TEXT NULL,

    "Status" TEXT NOT NULL,

    "Remark" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_AttendanceRecords_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE

);
CREATE TABLE IF NOT EXISTS "LeaveRecords" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_LeaveRecords" PRIMARY KEY AUTOINCREMENT,

    "UserId" INTEGER NOT NULL,

    "LeaveType" TEXT NOT NULL,

    "StartDate" TEXT NOT NULL,

    "EndDate" TEXT NOT NULL,

    "Days" TEXT NOT NULL,

    "Hours" TEXT NOT NULL,

    "Status" TEXT NOT NULL,

    "Reason" TEXT NULL,

    "Remark" TEXT NULL,

    "ApproverId" INTEGER NULL,

    "ApprovedAt" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_LeaveRecords_Users_ApproverId" FOREIGN KEY ("ApproverId") REFERENCES "Users" ("Id"),

    CONSTRAINT "FK_LeaveRecords_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE

);
CREATE TABLE IF NOT EXISTS "UserRoles" (

    "UserId" INTEGER NOT NULL,

    "RoleId" INTEGER NOT NULL,

    CONSTRAINT "PK_UserRoles" PRIMARY KEY ("UserId", "RoleId"),

    CONSTRAINT "FK_UserRoles_Roles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "Roles" ("Id") ON DELETE CASCADE,

    CONSTRAINT "FK_UserRoles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE

);
CREATE TABLE IF NOT EXISTS "WorkHourRecords" (

    "Id" INTEGER NOT NULL CONSTRAINT "PK_WorkHourRecords" PRIMARY KEY AUTOINCREMENT,

    "UserId" INTEGER NOT NULL,

    "Date" TEXT NOT NULL,

    "RegularHours" TEXT NOT NULL,

    "OvertimeHours" TEXT NOT NULL,

    "WeekendHours" TEXT NOT NULL,

    "HolidayHours" TEXT NOT NULL,

    "ProjectName" TEXT NULL,

    "TaskDescription" TEXT NULL,

    "Remark" TEXT NULL,

    "CreatedAt" TEXT NOT NULL,

    "UpdatedAt" TEXT NULL,

    CONSTRAINT "FK_WorkHourRecords_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE

);
CREATE INDEX "IX_AnnualLeaveRecords_UserId" ON "AnnualLeaveRecords" ("UserId");
CREATE INDEX "IX_AttendanceRecords_UserId" ON "AttendanceRecords" ("UserId");
CREATE UNIQUE INDEX "IX_Departments_Code" ON "Departments" ("Code");
CREATE INDEX "IX_Departments_ParentId" ON "Departments" ("ParentId");
CREATE INDEX "IX_LeaveRecords_ApproverId" ON "LeaveRecords" ("ApproverId");
CREATE INDEX "IX_LeaveRecords_UserId" ON "LeaveRecords" ("UserId");
CREATE INDEX "IX_Menus_ParentId" ON "Menus" ("ParentId");
CREATE INDEX "IX_RoleMenus_MenuId" ON "RoleMenus" ("MenuId");
CREATE UNIQUE INDEX "IX_Roles_Name" ON "Roles" ("Name");
CREATE INDEX "IX_UserRoles_RoleId" ON "UserRoles" ("RoleId");
CREATE INDEX "IX_WorkHourRecords_UserId" ON "WorkHourRecords" ("UserId");
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (

    "MigrationId" TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,

    "ProductVersion" TEXT NOT NULL

);
CREATE TABLE LoginLogs (Id INTEGER PRIMARY KEY AUTOINCREMENT, UserId INTEGER NOT NULL, Username TEXT NOT NULL, IpAddress TEXT, DeviceInfo TEXT, BrowserInfo TEXT, OsInfo TEXT, LoginTime TEXT NOT NULL, CreatedAt TEXT NOT NULL, FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE);
CREATE INDEX IX_LoginLogs_UserId ON LoginLogs(UserId);
CREATE INDEX IX_LoginLogs_LoginTime ON LoginLogs(LoginTime);
CREATE TABLE Notifications (
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
    UpdatedAt TEXT
);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Notifications_Type ON Notifications(Type);
CREATE INDEX IX_Notifications_Read ON Notifications(Read);
CREATE INDEX IX_Notifications_Date ON Notifications(Date);
CREATE TABLE IF NOT EXISTS 'VisitorLogs' (
    'Id' INTEGER NOT NULL CONSTRAINT 'PK_VisitorLogs' PRIMARY KEY AUTOINCREMENT,
    'IpAddress' TEXT NULL,
    'UserAgent' TEXT NULL,
    'PageUrl' TEXT NULL,
    'Referrer' TEXT NULL,
    'VisitTime' TEXT NOT NULL,
    'CreatedAt' TEXT NOT NULL
);
CREATE INDEX 'IX_VisitorLogs_IpAddress' ON 'VisitorLogs' ('IpAddress');
CREATE INDEX 'IX_VisitorLogs_VisitTime' ON 'VisitorLogs' ('VisitTime');
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Username" TEXT NOT NULL, 
    "Email" TEXT NOT NULL,
    "PasswordHash" TEXT NOT NULL,
    "Phone" TEXT NULL,
    "Avatar" TEXT NULL, 
         "Address" TEXT(200),
      "Gender" INTEGER, 
      "Name" varchar(100),
    "DepartmentId" INTEGER NULL,
    "IsActive" INTEGER NOT NULL,
    "CreatedAt" TEXT NOT NULL,
    "UpdatedAt" TEXT NULL,
    CONSTRAINT "FK_Users_Departments_DepartmentId" FOREIGN KEY ("DepartmentId") REFERENCES "Departments" ("Id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX "IX_Users_Username" ON "Users"("Username");
CREATE UNIQUE INDEX "IX_Users_Email" ON "Users"("Email");
