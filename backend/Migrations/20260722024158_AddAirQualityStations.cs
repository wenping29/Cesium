using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAirQualityStations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AirQualityStations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Station = table.Column<string>(type: "TEXT", nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    Aqi = table.Column<int>(type: "INTEGER", nullable: false),
                    Pm25 = table.Column<int>(type: "INTEGER", nullable: false),
                    Pm10 = table.Column<int>(type: "INTEGER", nullable: false),
                    O3 = table.Column<int>(type: "INTEGER", nullable: false),
                    No2 = table.Column<int>(type: "INTEGER", nullable: false),
                    Time = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AirQualityStations", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AirQualityStations_Station",
                table: "AirQualityStations",
                column: "Station");

            migrationBuilder.CreateIndex(
                name: "IX_AirQualityStations_Time",
                table: "AirQualityStations",
                column: "Time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AirQualityStations");
        }
    }
}
