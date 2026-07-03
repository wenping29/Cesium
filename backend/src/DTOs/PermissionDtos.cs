namespace CesiumApi.DTOs;

// Menu DTOs
public class MenuDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Path { get; set; }
    public string? Icon { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; }
    public string? Permission { get; set; }
    public List<MenuDto>? Children { get; set; }
}

public class CreateMenuDto
{
    public string Name { get; set; } = string.Empty;
    public string? Path { get; set; }
    public string? Icon { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; } = 0;
    public bool IsVisible { get; set; } = true;
    public string? Permission { get; set; }
}

public class UpdateMenuDto
{
    public string Name { get; set; } = string.Empty;
    public string? Path { get; set; }
    public string? Icon { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public bool IsVisible { get; set; }
    public string? Permission { get; set; }
}

// Role DTOs
public class RoleDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<int>? MenuIds { get; set; }
    public List<string>? MenuNames { get; set; }
}

public class CreateRoleDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<int>? MenuIds { get; set; }
}

public class UpdateRoleDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<int>? MenuIds { get; set; }
}

// Department DTOs
public class DepartmentDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public string? Leader { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; }
    public int UserCount { get; set; }
    public List<DepartmentDto>? Children { get; set; }
}

public class CreateDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; } = 0;
    public string? Leader { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
}

public class UpdateDepartmentDto
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; }
    public string? Leader { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; }
}

// User DTO (extended)
public class UserDetailDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public bool IsActive { get; set; }
    public List<string> Roles { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int? DepartmentId { get; set; }
    public List<string>? Roles { get; set; }
}

public class UpdateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public int? DepartmentId { get; set; }
    public bool IsActive { get; set; }
    public List<string>? Roles { get; set; }
}

public class ResetPasswordDto
{
    public string NewPassword { get; set; } = "123456"; // 默认密码
}
