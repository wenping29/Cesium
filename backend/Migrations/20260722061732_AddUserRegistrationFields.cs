using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRegistrationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Bio",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Hometown",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1717));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1723));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1724));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1726));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1727));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1729));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1730));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1731));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1732));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1734));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1585));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1592));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1593));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1594));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1596));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1597));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1598));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1599));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1600));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1601));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1602));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1604));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1605));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1606));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1607));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1608));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1609));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1610));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1611));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 20,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1612));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1614));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1615));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1617));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1618));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1619));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1620));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1622));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1623));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1624));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1625));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1666));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1668));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1669));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1670));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1671));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1672));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1674));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 38,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1675));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 39,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1676));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 40,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1677));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1678));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1679));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 43,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1680));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 44,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1682));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 45,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1683));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 46,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1684));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 47,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 6, 17, 31, 384, DateTimeKind.Utc).AddTicks(1685));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Bio",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Hometown",
                table: "Users");

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2204));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2211));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2213));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2214));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2216));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2217));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2218));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2220));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2221));

            migrationBuilder.UpdateData(
                table: "Departments",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2222));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2059));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2064));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2084));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2087));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2089));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2090));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2091));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2092));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2093));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2094));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2096));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2097));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2098));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2099));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2100));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2101));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 17,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2102));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 18,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2104));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 19,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2105));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 20,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2106));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 21,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2107));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 22,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2108));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 23,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2110));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 24,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2112));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 25,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2113));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 26,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2114));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 27,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2115));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 28,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2116));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 29,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2117));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 30,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2118));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 31,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2119));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 32,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2121));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 33,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2122));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 34,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2123));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 35,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2124));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 36,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2125));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 37,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2126));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 38,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2128));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 39,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2129));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 40,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2131));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 41,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2132));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 42,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2133));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 43,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2134));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 44,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2135));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 45,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2136));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 46,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2169));

            migrationBuilder.UpdateData(
                table: "Menus",
                keyColumn: "Id",
                keyValue: 47,
                column: "CreatedAt",
                value: new DateTime(2026, 7, 22, 2, 48, 46, 35, DateTimeKind.Utc).AddTicks(2173));
        }
    }
}
