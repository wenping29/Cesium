namespace CesiumApi.DTOs;

public class CreateVisitorLogDto
{
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public string? PageUrl { get; set; }
    public string? Referrer { get; set; }
}
