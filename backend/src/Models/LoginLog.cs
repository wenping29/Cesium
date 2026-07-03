namespace CesiumApi.Models;

public class LoginLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? IpAddress { get; set; }
    public string? DeviceInfo { get; set; }
    public string? BrowserInfo { get; set; }
    public string? OsInfo { get; set; }
    public DateTime LoginTime { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
