namespace CesiumApi.DTOs;

public class VisitorLogDto
{
    public int Id { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? PageUrl { get; set; }
    public string? Referrer { get; set; }
    public DateTime VisitTime { get; set; }
    public DateTime CreatedAt { get; set; }
}
