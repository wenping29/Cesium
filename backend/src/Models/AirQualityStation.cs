namespace CesiumApi.Models;

public class AirQualityStation
{
    public int Id { get; set; }
    public string Station { get; set; } = string.Empty;
    public double Lat { get; set; }
    public double Lng { get; set; }
    public int Aqi { get; set; }
    public int Pm25 { get; set; }
    public int Pm10 { get; set; }
    public int O3 { get; set; }
    public int No2 { get; set; }
    public DateTime Time { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
