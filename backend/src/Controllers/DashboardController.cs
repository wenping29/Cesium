using CesiumApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetStats()
    {
        var userCount = await _context.Users.CountAsync();
        var roleCount = await _context.Roles.CountAsync();
        var departmentCount = await _context.Departments.CountAsync();
        var menuCount = await _context.Menus.CountAsync();
        var loginLogCount = await _context.LoginLogs.CountAsync();
        var attendanceCount = await _context.AttendanceRecords.CountAsync();
        var workHourCount = await _context.WorkHourRecords.CountAsync();
        var leaveCount = await _context.LeaveRecords.CountAsync();
        var annualLeaveCount = await _context.AnnualLeaveRecords.CountAsync();

        return Ok(new
        {
            users = userCount,
            roles = roleCount,
            departments = departmentCount,
            menus = menuCount,
            loginLogs = loginLogCount,
            attendanceRecords = attendanceCount,
            workHourRecords = workHourCount,
            leaveRecords = leaveCount,
            annualLeaveRecords = annualLeaveCount,
        });
    }
}
