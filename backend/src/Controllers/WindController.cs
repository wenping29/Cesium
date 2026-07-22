using CesiumApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WindController : ControllerBase
{
    private readonly AppDbContext _context;

    public WindController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var all = await _context.WindRecords
            .OrderByDescending(w => w.Time)
            .ToListAsync();

        var records = all
            .GroupBy(w => w.Region)
            .Select(g => g.First())
            .Select(w => new
            {
                id = "wd_" + w.Id.ToString("D3"),
                w.Region,
                w.Lat,
                w.Lng,
                w.Direction,
                w.Speed,
                w.Gust,
                time = w.Time.ToString("HH:mm:ss"),
            })
            .ToList();

        return Ok(new
        {
            code = 200,
            message = "success",
            data = records,
        });
    }
}
