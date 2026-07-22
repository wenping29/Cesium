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
        var records = await _context.WindRecords
            .OrderByDescending(w => w.Time)
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
            .ToListAsync();

        return Ok(new
        {
            code = 200,
            message = "success",
            data = records,
        });
    }
}
