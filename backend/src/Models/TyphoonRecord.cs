namespace CesiumApi.Models;

public class TyphoonRecord
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Strength { get; set; } = string.Empty;
    public int WindSpeed { get; set; }
    public int Pressure { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string? PathJson { get; set; }
    public DateTime Time { get; set; }
    public string Status { get; set; } = "historical";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
