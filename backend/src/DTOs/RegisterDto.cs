namespace CesiumApi.DTOs;

public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Name { get; set; }
    public string? Phone { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? Hometown { get; set; }
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public int? DepartmentId { get; set; }
    public bool IsActive { get; set; } = true;
}
