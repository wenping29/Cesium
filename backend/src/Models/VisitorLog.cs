namespace CesiumApi.Models;

public class VisitorLog
{
    public int Id { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? PageUrl { get; set; }
    public string? Referrer { get; set; }
    public DateTime VisitTime { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
