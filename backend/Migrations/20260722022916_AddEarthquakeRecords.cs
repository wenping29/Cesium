using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddEarthquakeRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EarthquakeRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Magnitude = table.Column<double>(type: "REAL", nullable: false),
                    Depth = table.Column<double>(type: "REAL", nullable: false),
                    Time = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Region = table.Column<string>(type: "TEXT", nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EarthquakeRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EarthquakeRecords_Magnitude",
                table: "EarthquakeRecords",
                column: "Magnitude");

            migrationBuilder.CreateIndex(
                name: "IX_EarthquakeRecords_Region",
                table: "EarthquakeRecords",
                column: "Region");

            migrationBuilder.CreateIndex(
                name: "IX_EarthquakeRecords_Time",
                table: "EarthquakeRecords",
                column: "Time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EarthquakeRecords");
        }
    }
}
