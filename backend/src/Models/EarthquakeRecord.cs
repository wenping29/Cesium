namespace CesiumApi.Models;

public class EarthquakeRecord
{
    public int Id { get; set; }
    public double Magnitude { get; set; }
    public double Depth { get; set; }
    public DateTime Time { get; set; }
    public string Region { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
