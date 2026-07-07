using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMenus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5044));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5050));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5052));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5054));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5057));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5059));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5061));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5063));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5065));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(5067));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4863));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4869));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4871));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4873), "Notifications", "通知中心", 1, "/notifications", "home:notifications", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4875), "Send", "发送消息", 1, "/send-notification", "home:sendNotification", 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4877), "Map", "地图管理", null, null, "map", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4879), "Map", "Cesium地图", 6, "/map", "map:cesium", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4880), "Layers", "OL地图", 6, "/openlayer-map", "map:openlayer", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4882), "MapOutlined", "Leaflet地图", 6, "/leaflet-map", "map:leaflet", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4884), "BarChart", "专题数据", null, null, "data", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4885), "Volcano", "地震数据表格", 10, "/earthquake-table", "data:earthquake", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4887), "Storm", "台风数据表格", 10, "/typhoon-table", "data:typhoon", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4889), "Waves", "风向数据表格", 10, "/wind-table", "data:wind", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4890), "Air", "空气质量数据表格", 10, "/airquality-table", "data:airquality", 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4892), "Monitor", "大屏", null, "/big-screen", "bigScreen", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4893), "Table", "数据表格", null, "/dataTables", "dataTables", 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4895), "Settings", "权限管理", null, null, "permission", 5 });

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CreatedAt", "Icon", "IsVisible", "Name", "ParentId", "Path", "Permission", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 18, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4896), "People", true, "用户管理", 17, "/user-management", "permission:users", 1, null },
                    { 19, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4898), "Shield", true, "角色管理", 17, "/role-management", "permission:roles", 2, null },
                    { 20, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4901), "Menu", true, "菜单管理", 17, "/menu-management", "permission:menus", 3, null },
                    { 21, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4902), "Business", true, "部门管理", 17, "/department-management", "permission:departments", 4, null },
                    { 22, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4904), "Schedule", true, "考勤管理", null, null, "attendance", 6, null },
                    { 27, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4966), "History", true, "日志管理", null, null, "log", 7, null },
                    { 31, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4973), "Image", true, "图片转BIM", null, "/image-to-bim", "imageToBim", 8, null },
                    { 32, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4974), "Settings", true, "设置", null, null, "settings", 9, null }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4712));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4719));

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CreatedAt", "Icon", "IsVisible", "Name", "ParentId", "Path", "Permission", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 23, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4960), "Description", true, "打卡报表", 22, "/attendance-report", "attendance:report", 1, null },
                    { 24, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4962), "Timer", true, "工时报表", 22, "/workhour-report", "attendance:workhour", 2, null },
                    { 25, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4963), "HolidayVillage", true, "休假报表", 22, "/leave-report", "attendance:leave", 3, null },
                    { 26, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4965), "BeachAccess", true, "年假报表", 22, "/annual-leave-report", "attendance:annual", 4, null },
                    { 28, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4968), "History", true, "登录日志", 27, "/login-log-report", "log:login", 1, null },
                    { 29, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4969), "FindInPage", true, "查询日志", 27, "/audit-log-report", "log:audit", 2, null },
                    { 30, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4971), "Visibility", true, "访客日志", 27, "/visitor-log-report", "log:visitor", 3, null },
                    { 33, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4976), "Info", true, "简介", 32, "/settings/introduction", "settings:intro", 1, null },
                    { 34, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4979), "Settings", true, "设置", 32, "/settings", "settings:main", 2, null },
                    { 35, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4980), "Wallpaper", true, "背景设置", 32, "/settings/background", "settings:background", 3, null },
                    { 36, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4982), "DashboardOutlined", true, "看板", 32, "/settings/dashboard", "settings:dashboard", 4, null },
                    { 37, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4985), "Folder", true, "项目", 32, "/settings/projects", "settings:projects", 5, null },
                    { 38, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4987), "Help", true, "常见问题", 32, "/settings/faq", "settings:faq", 6, null },
                    { 39, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4989), "People", true, "用户", 32, "/settings/users", "settings:users", 7, null },
                    { 40, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4990), "Security", true, "认证", 32, "/settings/auth", "settings:auth", 8, null },
                    { 41, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4992), "Storage", true, "文件管理", 32, "/settings/files", "settings:files", 9, null },
                    { 42, new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4993), "Send", true, "聊天", 32, "/settings/chat", "settings:chat", 10, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9145));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9152));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9154));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9157));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9158));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9161));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9163));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9164));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9167));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9169));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9099));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9105));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9107));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9109), "Settings", "权限管理", null, null, "permission", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9111), "People", "用户管理", 4, "/user-management", "permission:users", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9112), "Shield", "角色管理", 4, "/role-management", "permission:roles", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9114), "Menu", "菜单管理", 4, "/menu-management", "permission:menus", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9117), "Business", "部门管理", 4, "/department-management", "permission:departments", 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9193), "Schedule", "考勤管理", null, null, "attendance", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9195), "Description", "打开报表", 9, "/attendance-report", "attendance:report", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9197), "Timer", "工时报表", 9, "/workhour-report", "attendance:workhour", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9199), "HolidayVillage", "休假报表", 9, "/leave-report", "attendance:leave", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9200), "BeachAccess", "年假报表", 9, "/annual-leave-report", "attendance:annual", 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9218), "History", "日志管理", null, null, "log", 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9221), "History", "登录日志", 14, "/login-log-report", "log:login", 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9275), "FindInPage", "查询日志", 14, "/audit-log-report", "log:audit", 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(9276), "Visibility", "访客日志", 14, "/visitor-log-report", "log:visitor", 3 });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(8957));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 7, 14, 26, 10, 272, DateTimeKind.Utc).AddTicks(8963));
        }
    }
}
