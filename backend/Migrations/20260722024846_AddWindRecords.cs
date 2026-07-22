using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddWindRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WindRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Region = table.Column<string>(type: "TEXT", nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    Direction = table.Column<int>(type: "INTEGER", nullable: false),
                    Speed = table.Column<double>(type: "REAL", nullable: false),
                    Gust = table.Column<double>(type: "REAL", nullable: false),
                    Time = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WindRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WindRecords_Region",
                table: "WindRecords",
                column: "Region");

            migrationBuilder.CreateIndex(
                name: "IX_WindRecords_Time",
                table: "WindRecords",
                column: "Time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WindRecords");
        }
    }
}
