namespace CesiumApi.DTOs;

public class LoginLogDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? DeviceInfo { get; set; }
    public string? BrowserInfo { get; set; }
    public string? OsInfo { get; set; }
    public DateTime LoginTime { get; set; }
    public DateTime CreatedAt { get; set; }
}
