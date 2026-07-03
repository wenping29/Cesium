namespace CesiumApi.DTOs;

public class LoginDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? DeviceInfo { get; set; }
    public string? BrowserInfo { get; set; }
    public string? OsInfo { get; set; }
}
