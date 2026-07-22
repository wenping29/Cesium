using System.Text.Json;
using CesiumApi.Data;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TyphoonController : ControllerBase
{
    private readonly AppDbContext _context;

    public TyphoonController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("historical")]
    public async Task<IActionResult> GetHistorical(
        [FromQuery] string? name = null,
        [FromQuery] string? strength = null)
    {
        var query = _context.TyphoonRecords
            .Where(t => t.Status == "historical")
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(name))
            query = query.Where(t => t.Name.Contains(name));

        if (!string.IsNullOrWhiteSpace(strength))
            query = query.Where(t => t.Strength.Contains(strength));

        var records = await query
            .OrderByDescending(t => t.Time)
            .Select(t => new
            {
                id = t.Name + "_" + t.Id,
                t.Name,
                t.Strength,
                t.WindSpeed,
                t.Pressure,
                t.Lat,
                t.Lng,
                path = t.PathJson,
                t.Time,
                t.Status,
            })
            .ToListAsync();

        var result = records.Select(r => new
        {
            r.id,
            r.Name,
            r.Strength,
            r.WindSpeed,
            r.Pressure,
            r.Lat,
            r.Lng,
            path = JsonSerializer.Deserialize<List<double[]>>(r.path ?? "[]"),
            r.Time,
            r.Status,
        });

        return Ok(new
        {
            code = 200,
            message = "success",
            data = result,
        });
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var record = await _context.TyphoonRecords
            .Where(t => t.Status == "active")
            .OrderByDescending(t => t.Time)
            .FirstOrDefaultAsync();

        if (record == null)
        {
            return Ok(new
            {
                code = 200,
                message = "success",
                data = (object?)null,
            });
        }

        var path = JsonSerializer.Deserialize<List<double[]>>(record.PathJson ?? "[]");

        return Ok(new
        {
            code = 200,
            message = "success",
            data = new
            {
                id = record.Name + "_" + record.Id,
                record.Name,
                record.Strength,
                record.WindSpeed,
                record.Pressure,
                record.Lat,
                record.Lng,
                path,
                record.Time,
                record.Status,
            },
        });
    }
}
