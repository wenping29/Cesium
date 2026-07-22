namespace CesiumApi.Models;

public class WindRecord
{
    public int Id { get; set; }
    public string Region { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public int Direction { get; set; }
    public double Speed { get; set; }
    public double Gust { get; set; }
    public DateTime Time { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
