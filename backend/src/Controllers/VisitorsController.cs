using CesiumApi.Data;
using CesiumApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VisitorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public VisitorsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
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
