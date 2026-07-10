using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class SyncMenuDataFromMock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1574));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1581));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1583));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1584));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1586));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1587));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1588));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1589));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1591));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1592));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1455), null, 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1461), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Name", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1463), "数据分析", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1464), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1465), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1466), "Dashboard", "仪表盘", "/dashboard", null, 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1467), "DesktopWindows", "大屏展示", null, "/big-screen", null, 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1469), "Map", "地图相关", null, null, null, 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1470), "Map", "Cesium地图", 8, "/map", null, 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1471), "Layers", "OpenLayer地图", 8, "/openlayer-map", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1472), "MapOutlined", "Leaflet地图", 8, "/leaflet-map", null, 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1473), "TableChart", "数据表格", null, null, null, 5 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1474), "Volcano", "地震数据", 12, "/earthquake-table", null, 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1475), "Storm", "台风数据", 12, "/typhoon-table", null, 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1477), "Waves", "风力数据", 12, "/wind-table", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1478), "Air", "空气质量", 12, "/airquality-table", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1479), "admin", 6 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1480), "admin" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1481), "admin" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1482), "admin" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1483), "admin" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1486), null, 7 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1487), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1488), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1489), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1490), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1491), null, 8 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1492), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "Name", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1494), "审计日志", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1495), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "Icon", "Name", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1523), "Insights", "影像转BIM", null, 9 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "Name", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1524), "其他", null, 10 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1526), null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1527), "Help", "常见问题", "/settings/faq", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1528), "Send", "聊天", "/settings/chat", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1529), "Storage", "文件管理", "/settings/files", null });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1530), "Settings", "设置", null, null, null, 11 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1531), "Info", "简介", 37, "/settings/introduction", null, 1 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1532), "Settings", "设置", 37, "/settings", null, 2 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1533), "Wallpaper", "背景设置", 37, "/settings/background", null, 3 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1535), "DashboardOutlined", "看板", 37, "/settings/dashboard", null, 4 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1536), "Folder", "项目", 37, "/settings/projects", null, 5 });

            migrationBuilder.InsertData(
                table: "Menus",
                columns: new[] { "Id", "CreatedAt", "Icon", "IsVisible", "Name", "ParentId", "Path", "Permission", "SortOrder", "UpdatedAt" },
                values: new object[,]
                {
                    { 43, new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1537), "Help", true, "常见问题", 37, "/settings/faq", null, 6, null },
                    { 44, new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1538), "People", true, "个人资料", 37, "/settings/users", null, 7, null },
                    { 45, new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1539), "Security", true, "认证", 37, "/settings/auth", null, 8, null },
                    { 46, new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1540), "Storage", true, "文件管理", 37, "/settings/files", null, 9, null },
                    { 47, new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1541), "Send", true, "聊天", 37, "/settings/chat", null, 10, null }
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1347));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 10, 7, 27, 1, 406, DateTimeKind.Utc).AddTicks(1352));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 47);

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
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4863), "home", 0 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4869), "home:workbench" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Name", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4871), "分析页", "home:analysis" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4873), "home:notifications" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4875), "home:sendNotification" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4877), "Map", "地图管理", null, "map", 1 });

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
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4884), "BarChart", "专题数据", null, null, "data" });

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
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4892), "Monitor", "大屏", null, "/big-screen", "bigScreen" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4893), "Table", "数据表格", null, "/dataTables", "dataTables" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4895), "permission", 5 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4896), "permission:users" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4898), "permission:roles" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4901), "permission:menus" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4902), "permission:departments" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4904), "attendance", 6 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4960), "attendance:report" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4962), "attendance:workhour" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4963), "attendance:leave" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4965), "attendance:annual" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4966), "log", 7 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4968), "log:login" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "Name", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4969), "查询日志", "log:audit" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4971), "log:visitor" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "Icon", "Name", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4973), "Image", "图片转BIM", "imageToBim", 8 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "Name", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4974), "设置", "settings", 9 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4976), "settings:intro" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4979), "Settings", "设置", "/settings", "settings:main" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4980), "Wallpaper", "背景设置", "/settings/background", "settings:background" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "Icon", "Name", "Path", "Permission" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4982), "DashboardOutlined", "看板", "/settings/dashboard", "settings:dashboard" });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4985), "Folder", "项目", 32, "/settings/projects", "settings:projects", 5 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4987), "Help", "常见问题", 32, "/settings/faq", "settings:faq", 6 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4989), "People", "用户", 32, "/settings/users", "settings:users", 7 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4990), "Security", "认证", 32, "/settings/auth", "settings:auth", 8 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4992), "Storage", "文件管理", 32, "/settings/files", "settings:files", 9 });

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "Icon", "Name", "ParentId", "Path", "Permission", "SortOrder" },
                values: new object[] { new DateTime(2026, 7, 7, 14, 35, 5, 835, DateTimeKind.Utc).AddTicks(4993), "Send", "聊天", 32, "/settings/chat", "settings:chat", 10 });

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
        }
    }
}
