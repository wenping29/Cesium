using CesiumApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AirQualityController : ControllerBase
{
    private readonly AppDbContext _context;

    public AirQualityController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("current")]
    public async Task<IActionResult> GetCurrent()
    {
        var stations = await _context.AirQualityStations
            .OrderByDescending(a => a.Time)
            .GroupBy(a => a.Station)
            .Select(g => g.First())
            .Select(a => new
            {
                id = "aq_" + a.Id.ToString("D3"),
                a.Station,
                a.Lat,
                a.Lng,
                a.Aqi,
                level = GetLevel(a.Aqi),
                a.Pm25,
                a.Pm10,
                a.O3,
                a.No2,
                time = a.Time.ToString("HH:mm:ss"),
            })
            .ToListAsync();

        return Ok(new
        {
            code = 200,
            message = "success",
            data = stations,
        });
    }

    private static string GetLevel(int aqi) => aqi switch
    {
        <= 50 => "\u4f18",
        <= 100 => "\u826f",
        <= 150 => "\u8f7b\u5ea6\u6c61\u67d3",
        <= 200 => "\u4e2d\u5ea6\u6c61\u67d3",
        <= 300 => "\u91cd\u5ea6\u6c61\u67d3",
        _ => "\u4e25\u91cd\u6c61\u67d3",
    };
}
