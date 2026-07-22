using CesiumApi.Data;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EarthquakeController : ControllerBase
{
    private readonly AppDbContext _context;

    public EarthquakeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("historical")]
    public async Task<IActionResult> GetHistorical(
        [FromQuery] int? page = null,
        [FromQuery] int? pageSize = null,
        [FromQuery] string? region = null,
        [FromQuery] double? minMagnitude = null,
        [FromQuery] double? maxMagnitude = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.EarthquakeRecords.AsQueryable();

        if (!string.IsNullOrWhiteSpace(region))
            query = query.Where(e => e.Region.Contains(region));

        if (minMagnitude.HasValue)
            query = query.Where(e => e.Magnitude >= minMagnitude.Value);

        if (maxMagnitude.HasValue)
            query = query.Where(e => e.Magnitude <= maxMagnitude.Value);

        if (startDate.HasValue)
            query = query.Where(e => e.Time >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(e => e.Time <= endDate.Value);

        query = query.OrderByDescending(e => e.Time);

        if (page.HasValue && pageSize.HasValue)
        {
            var total = await query.CountAsync();
            var records = await query
                .Skip((page.Value - 1) * pageSize.Value)
                .Take(pageSize.Value)
                .Select(e => new
                {
                    id = e.Id,
                    magnitude = e.Magnitude,
                    depth = e.Depth,
                    time = e.Time,
                    region = e.Region,
                    lat = e.Lat,
                    lng = e.Lng,
                    description = e.Description,
                })
                .ToListAsync();

            return Ok(new
            {
                code = 200,
                message = "success",
                data = records,
                total,
                page = page.Value,
                pageSize = pageSize.Value,
            });
        }

        var allRecords = await query
            .Select(e => new
            {
                id = e.Id,
                magnitude = e.Magnitude,
                depth = e.Depth,
                time = e.Time,
                region = e.Region,
                lat = e.Lat,
                lng = e.Lng,
                description = e.Description,
            })
            .ToListAsync();

        return Ok(new
        {
            code = 200,
            message = "success",
            data = allRecords,
        });
    }
}
