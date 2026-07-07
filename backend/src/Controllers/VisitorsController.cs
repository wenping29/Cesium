using CesiumApi.Data;
using CesiumApi.DTOs;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VisitorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public VisitorsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> RecordVisit([FromBody] CreateVisitorLogDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (ip == "::1") ip = "127.0.0.1";
        if (string.IsNullOrWhiteSpace(ip))
            ip = dto.IpAddress;

        var log = new VisitorLog
        {
            IpAddress = ip,
            UserAgent = dto.UserAgent,
            PageUrl = dto.PageUrl,
            Referrer = dto.Referrer,
            VisitTime = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
        };

        _context.VisitorLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(new { id = log.Id });
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PagedResult<VisitorLogDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? ipAddress = null,
        [FromQuery] string? pageUrl = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.VisitorLogs.AsQueryable();

        if (!string.IsNullOrWhiteSpace(ipAddress))
            query = query.Where(v => v.IpAddress != null && v.IpAddress.Contains(ipAddress));

        if (!string.IsNullOrWhiteSpace(pageUrl))
            query = query.Where(v => v.PageUrl != null && v.PageUrl.Contains(pageUrl));

        if (startDate.HasValue)
            query = query.Where(v => v.VisitTime >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(v => v.VisitTime <= endDate.Value);

        var total = await query.CountAsync();

        var logs = await query
            .OrderByDescending(v => v.VisitTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new VisitorLogDto
            {
                Id = v.Id,
                IpAddress = v.IpAddress,
                UserAgent = v.UserAgent,
                PageUrl = v.PageUrl,
                Referrer = v.Referrer,
                VisitTime = v.VisitTime,
                CreatedAt = v.CreatedAt,
            })
            .ToListAsync();

        return new PagedResult<VisitorLogDto>
        {
            Total = total,
            Page = page,
            PageSize = pageSize,
            Data = logs,
        };
    }
}
