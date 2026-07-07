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
    public string Username { get; set; } = string.Empty;
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

public class UpdateProfileDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Avatar { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
}

// 考勤DTOs
public class AttendanceRecordDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TimeSpan? CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "normal";
    public string? Remark { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAttendanceDto
{
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan? CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "normal";
    public string? Remark { get; set; }
}

public class UpdateAttendanceDto
{
    public TimeSpan? CheckInTime { get; set; }
    public TimeSpan? CheckOutTime { get; set; }
    public string Status { get; set; } = "normal";
    public string? Remark { get; set; }
}

// 工时DTOs
public class WorkHourRecordDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public decimal RegularHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public decimal WeekendHours { get; set; }
    public decimal HolidayHours { get; set; }
    public decimal TotalHours => RegularHours + OvertimeHours + WeekendHours + HolidayHours;
    public string? ProjectName { get; set; }
    public string? TaskDescription { get; set; }
    public string? Remark { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateWorkHourDto
{
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public decimal RegularHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public decimal WeekendHours { get; set; }
    public decimal HolidayHours { get; set; }
    public string? ProjectName { get; set; }
    public string? TaskDescription { get; set; }
    public string? Remark { get; set; }
}

public class UpdateWorkHourDto
{
    public decimal RegularHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public decimal WeekendHours { get; set; }
    public decimal HolidayHours { get; set; }
    public string? ProjectName { get; set; }
    public string? TaskDescription { get; set; }
    public string? Remark { get; set; }
}

// 休假DTOs
public class LeaveRecordDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string LeaveType { get; set; } = "personal";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Days { get; set; }
    public decimal Hours { get; set; }
    public string Status { get; set; } = "pending";
    public string? Reason { get; set; }
    public string? Remark { get; set; }
    public int? ApproverId { get; set; }
    public string? ApproverName { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateLeaveDto
{
    public int UserId { get; set; }
    public string LeaveType { get; set; } = "personal";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Days { get; set; }
    public decimal Hours { get; set; }
    public string? Reason { get; set; }
    public string? Remark { get; set; }
}

public class UpdateLeaveDto
{
    public string LeaveType { get; set; } = "personal";
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Days { get; set; }
    public decimal Hours { get; set; }
    public string Status { get; set; } = "pending";
    public string? Reason { get; set; }
    public string? Remark { get; set; }
    public int? ApproverId { get; set; }
}

// 年假DTOs
public class AnnualLeaveRecordDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal TotalDays { get; set; }
    public decimal UsedDays { get; set; }
    public decimal RemainingDays { get; set; }
    public decimal CarriedOverDays { get; set; }
    public string? Remark { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateAnnualLeaveDto
{
    public int UserId { get; set; }
    public int Year { get; set; }
    public decimal TotalDays { get; set; }
    public decimal UsedDays { get; set; }
    public decimal CarriedOverDays { get; set; }
    public string? Remark { get; set; }
}

public class UpdateAnnualLeaveDto
{
    public decimal TotalDays { get; set; }
    public decimal UsedDays { get; set; }
    public decimal CarriedOverDays { get; set; }
    public string? Remark { get; set; }
}
