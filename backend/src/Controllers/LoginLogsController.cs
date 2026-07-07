using CesiumApi.Data;
using CesiumApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LoginLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public LoginLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<LoginLogDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] int? userId = null,
        [FromQuery] string? username = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.LoginLogs.AsQueryable();

        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);

        if (!string.IsNullOrWhiteSpace(username))
            query = query.Where(l => l.Username.Contains(username));

        if (startDate.HasValue)
            query = query.Where(l => l.LoginTime >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(l => l.LoginTime <= endDate.Value);

        var total = await query.CountAsync();

        var logs = await query
            .OrderByDescending(l => l.LoginTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new LoginLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Username = l.Username,
                IpAddress = l.IpAddress,
                DeviceInfo = l.DeviceInfo,
                BrowserInfo = l.BrowserInfo,
                OsInfo = l.OsInfo,
                LoginTime = l.LoginTime,
                CreatedAt = l.CreatedAt,
            })
            .ToListAsync();

        return new PagedResult<LoginLogDto>
        {
            Total = total,
            Page = page,
            PageSize = pageSize,
            Data = logs,
        };
    }

    [HttpGet("my")]
    public async Task<ActionResult<PagedResult<LoginLogDto>>> GetMyLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var uid = int.Parse(userId);

        var total = await _context.LoginLogs.CountAsync(l => l.UserId == uid);

        var logs = await _context.LoginLogs
            .Where(l => l.UserId == uid)
            .OrderByDescending(l => l.LoginTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(l => new LoginLogDto
            {
                Id = l.Id,
                UserId = l.UserId,
                Username = l.Username,
                IpAddress = l.IpAddress,
                DeviceInfo = l.DeviceInfo,
                BrowserInfo = l.BrowserInfo,
                OsInfo = l.OsInfo,
                LoginTime = l.LoginTime,
                CreatedAt = l.CreatedAt,
            })
            .ToListAsync();

        return new PagedResult<LoginLogDto>
        {
            Total = total,
            Page = page,
            PageSize = pageSize,
            Data = logs,
        };
    }
}
