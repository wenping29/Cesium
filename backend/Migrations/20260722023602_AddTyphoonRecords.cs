using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CesiumApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTyphoonRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TyphoonRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Strength = table.Column<string>(type: "TEXT", nullable: false),
                    WindSpeed = table.Column<int>(type: "INTEGER", nullable: false),
                    Pressure = table.Column<int>(type: "INTEGER", nullable: false),
                    Lat = table.Column<double>(type: "REAL", nullable: false),
                    Lng = table.Column<double>(type: "REAL", nullable: false),
                    PathJson = table.Column<string>(type: "TEXT", nullable: true),
                    Time = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TyphoonRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TyphoonRecords_Name",
                table: "TyphoonRecords",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_TyphoonRecords_Status",
                table: "TyphoonRecords",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_TyphoonRecords_Time",
                table: "TyphoonRecords",
                column: "Time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TyphoonRecords");
        }
    }
}
