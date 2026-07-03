using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddLoginLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Code = table.Column<string>(type: "TEXT", nullable: true),
                    ParentId = table.Column<int>(type: "INTEGER", nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    Leader = table.Column<string>(type: "TEXT", nullable: true),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Departments_Departments_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Menus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Path = table.Column<string>(type: "TEXT", nullable: true),
                    Icon = table.Column<string>(type: "TEXT", nullable: true),
                    ParentId = table.Column<int>(type: "INTEGER", nullable: true),
                    SortOrder = table.Column<int>(type: "INTEGER", nullable: false),
                    IsVisible = table.Column<bool>(type: "INTEGER", nullable: false),
                    Permission = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Menus", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Menus_Menus_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Phone = table.Column<string>(type: "TEXT", nullable: true),
                    Avatar = table.Column<string>(type: "TEXT", nullable: true),
                    DepartmentId = table.Column<int>(type: "INTEGER", nullable: true),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Departments_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Departments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "RoleMenus",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false),
                    MenuId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleMenus", x => new { x.RoleId, x.MenuId });
                    table.ForeignKey(
                        name: "FK_RoleMenus_Menus_MenuId",
                        column: x => x.MenuId,
                        principalTable: "Menus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleMenus_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnnualLeaveRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalDays = table.Column<decimal>(type: "TEXT", nullable: false),
                    UsedDays = table.Column<decimal>(type: "TEXT", nullable: false),
                    RemainingDays = table.Column<decimal>(type: "TEXT", nullable: false),
                    CarriedOverDays = table.Column<decimal>(type: "TEXT", nullable: false),
                    Remark = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnnualLeaveRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnnualLeaveRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AttendanceRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CheckInTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    CheckOutTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Remark = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendanceRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LeaveRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    LeaveType = table.Column<string>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Days = table.Column<decimal>(type: "TEXT", nullable: false),
                    Hours = table.Column<decimal>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Reason = table.Column<string>(type: "TEXT", nullable: true),
                    Remark = table.Column<string>(type: "TEXT", nullable: true),
                    ApproverId = table.Column<int>(type: "INTEGER", nullable: true),
                    ApprovedAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaveRecords_Users_ApproverId",
                        column: x => x.ApproverId,
                        principalTable: "Users",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LeaveRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoginLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    IpAddress = table.Column<string>(type: "TEXT", nullable: true),
                    DeviceInfo = table.Column<string>(type: "TEXT", nullable: true),
                    BrowserInfo = table.Column<string>(type: "TEXT", nullable: true),
                    OsInfo = table.Column<string>(type: "TEXT", nullable: true),
                    LoginTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoginLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoginLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    RoleId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkHourRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    RegularHours = table.Column<decimal>(type: "TEXT", nullable: false),
                    OvertimeHours = table.Column<decimal>(type: "TEXT", nullable: false),
                    WeekendHours = table.Column<decimal>(type: "TEXT", nullable: false),
                    HolidayHours = table.Column<decimal>(type: "TEXT", nullable: false),
                    ProjectName = table.Column<string>(type: "TEXT", nullable: true),
                    TaskDescription = table.Column<string>(type: "TEXT", nullable: true),
                    Remark = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkHourRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkHourRecords_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Address", "Code", "CreatedAt", "Email", "IsActive", "Leader", "Name", "ParentId", "Phone", "SortOrder", "UpdatedAt" },
                values: new object[] { 1, "北京市朝阳区建国路88号", "HQ", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5448), "zhangzong@company.com", true, "张总", "总公司", null, "010-88888888", 1, null });

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CreatedAt", "Icon", "IsVisible", "Name", "ParentId", "Path", "Permission", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5384), "Home", true, "首页", null, null, "home", 0, null },
                    { 4, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5392), "Settings", true, "权限管理", null, null, "permission", 1, null },
                    { 9, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5481), "Schedule", true, "考勤管理", null, null, "attendance", 2, null }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "CreatedAt", "Description", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5286), "系统管理员", "Admin", null },
                    { 2, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5291), "普通用户", "User", null }
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Address", "Code", "CreatedAt", "Email", "IsActive", "Leader", "Name", "ParentId", "Phone", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 2, "北京市朝阳区建国路88号A座3层", "TECH", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5453), "tech@company.com", true, "李经理", "技术部", 1, "010-88888801", 1, null },
                    { 3, "北京市朝阳区建国路88号A座5层", "PROD", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5455), "product@company.com", true, "王经理", "产品部", 1, "010-88888802", 2, null },
                    { 4, "北京市朝阳区建国路88号B座2层", "MKT", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5456), "marketing@company.com", true, "赵经理", "市场部", 1, "010-88888803", 3, null },
                    { 5, "北京市朝阳区建国路88号B座3层", "SALES", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5458), "sales@company.com", true, "孙经理", "销售部", 1, "010-88888804", 4, null },
                    { 6, "北京市朝阳区建国路88号A座8层", "HR", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5459), "hr@company.com", true, "周经理", "人事部", 1, "010-88888805", 5, null },
                    { 7, "北京市朝阳区建国路88号A座9层", "FIN", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5461), "finance@company.com", true, "吴经理", "财务部", 1, "010-88888806", 6, null }
                });

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CreatedAt", "Icon", "IsVisible", "Name", "ParentId", "Path", "Permission", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 2, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5389), "Dashboard", true, "工作台", 1, "/workbench", "home:workbench", 1, null },
                    { 3, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5391), "Analytics", true, "分析页", 1, "/analysis", "home:analysis", 2, null },
                    { 5, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5393), "People", true, "用户管理", 4, "/user-management", "permission:users", 1, null },
                    { 6, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5425), "Shield", true, "角色管理", 4, "/role-management", "permission:roles", 2, null },
                    { 7, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5427), "Menu", true, "菜单管理", 4, "/menu-management", "permission:menus", 3, null },
                    { 8, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5428), "Business", true, "部门管理", 4, "/department-management", "permission:departments", 4, null },
                    { 10, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5482), "Description", true, "打开报表", 9, "/attendance-report", "attendance:report", 1, null },
                    { 11, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5484), "Timer", true, "工时报表", 9, "/workhour-report", "attendance:workhour", 2, null },
                    { 12, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5485), "HolidayVillage", true, "休假报表", 9, "/leave-report", "attendance:leave", 3, null },
                    { 13, new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5487), "BeachAccess", true, "年假报表", 9, "/annual-leave-report", "attendance:annual", 4, null }
                });

            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Address", "Code", "CreatedAt", "Email", "IsActive", "Leader", "Name", "ParentId", "Phone", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 8, "北京市朝阳区建国路88号A座301室", "DEV1", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5462), "dev1@company.com", true, "郑组长", "研发一组", 2, "010-88888011", 1, null },
                    { 9, "北京市朝阳区建国路88号A座302室", "DEV2", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5464), "dev2@company.com", true, "陈组长", "研发二组", 2, "010-88888012", 2, null },
                    { 10, "北京市朝阳区建国路88号A座4层", "OPS", new DateTime(2026, 7, 3, 9, 4, 55, 872, DateTimeKind.Utc).AddTicks(5465), "ops@company.com", true, "刘组长", "运维部", 2, "010-88888013", 3, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnnualLeaveRecords_UserId",
                table: "AnnualLeaveRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecords_UserId",
                table: "AttendanceRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Code",
                table: "Departments",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Departments_ParentId",
                table: "Departments",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRecords_ApproverId",
                table: "LeaveRecords",
                column: "ApproverId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRecords_UserId",
                table: "LeaveRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LoginLogs_LoginTime",
                table: "LoginLogs",
                column: "LoginTime");

            migrationBuilder.CreateIndex(
                name: "IX_LoginLogs_UserId",
                table: "LoginLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Menus_ParentId",
                table: "Menus",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_RoleMenus_MenuId",
                table: "RoleMenus",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DepartmentId",
                table: "Users",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkHourRecords_UserId",
                table: "WorkHourRecords",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnnualLeaveRecords");

            migrationBuilder.DropTable(
                name: "AttendanceRecords");

            migrationBuilder.DropTable(
                name: "LeaveRecords");

            migrationBuilder.DropTable(
                name: "LoginLogs");

            migrationBuilder.DropTable(
                name: "RoleMenus");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "WorkHourRecords");

            migrationBuilder.DropTable(
                name: "Menus");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Departments");
        }
    }
}
