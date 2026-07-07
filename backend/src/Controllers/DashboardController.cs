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

    [HttpGet("workbench")]
    public async Task<ActionResult<object>> GetWorkbenchData()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var todayVisits = await _context.VisitorLogs
            .CountAsync(v => v.VisitTime >= today && v.VisitTime < tomorrow);

        var todayNewUsers = await _context.Users
            .CountAsync(u => u.CreatedAt >= today && u.CreatedAt < tomorrow);

        var pendingTasks = await _context.LeaveRecords
            .CountAsync(l => l.Status == "Pending");

        var unreadMessages = await _context.Notifications
            .CountAsync(n => !n.Read);

        return Ok(new
        {
            todayVisits,
            todayNewUsers,
            pendingTasks,
            unreadMessages,
        });
    }
}
