using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalysisController : ControllerBase
{
    [HttpGet]
    public IActionResult Get([FromQuery] string timeRange = "7days")
    {
        var random = new Random();

        var totalRevenue = random.Next(80000, 200000);
        var visits = random.Next(5000, 15000);
        var payments = random.Next(3000, 10000);
        var conversionRate = random.Next(50, 95);

        var revenueTrend = random.Next(-15, 20);
        var visitsTrend = random.Next(-10, 15);
        var paymentsTrend = random.Next(-12, 18);
        var conversionTrend = random.Next(-8, 12);

        var months = new[] { "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月" };
        var now = DateTime.UtcNow;
        var salesData = new List<object>();
        var count = timeRange switch
        {
            "today" => 24,
            "7days" => 7,
            "30days" => 30,
            "90days" => 12,
            "year" => 12,
            _ => 7,
        };

        if (timeRange == "today")
        {
            for (var i = 0; i < count; i++)
                salesData.Add(new { month = $"{i}:00", value = random.Next(500, 5000) });
        }
        else if (timeRange is "7days" or "30days")
        {
            for (var i = count - 1; i >= 0; i--)
            {
                var d = now.AddDays(-i);
                salesData.Add(new { month = $"{d.Month}/{d.Day}", value = random.Next(1000, 8000) });
            }
        }
        else
        {
            for (var i = 0; i < count; i++)
                salesData.Add(new { month = months[i], value = random.Next(2000, 10000) });
        }

        var categories = new[]
        {
            new { name = "电子产品", value = random.Next(20, 45), color = "#1976d2" },
            new { name = "服装配饰", value = random.Next(15, 35), color = "#2e7d32" },
            new { name = "食品饮料", value = random.Next(10, 30), color = "#ed6c02" },
            new { name = "家居生活", value = random.Next(10, 25), color = "#757575" },
        };

        var categoryTotal = categories.Sum(c => c.value);
        categories = categories.Select(c => new { c.name, value = (int)Math.Round((double)c.value / categoryTotal * 100), c.color }).ToArray();

        var productNames = new[] { "无线蓝牙耳机", "智能手表", "便携充电宝", "机械键盘", "运动水杯", "笔记本支架", "USB集线器", "手机壳" };
        var topProducts = productNames
            .OrderByDescending(_ => random.Next())
            .Take(5)
            .Select((name, i) => new
            {
                rank = i + 1,
                name,
                sales = random.Next(200, 2000),
                revenue = $"¥{random.Next(5000, 80000):N0}",
            })
            .ToList();

        return Ok(new
        {
            code = 200,
            message = "success",
            data = new
            {
                keyMetrics = new
                {
                    totalRevenue = new { value = $"¥{totalRevenue:N0}", trend = $"{(revenueTrend >= 0 ? "+" : "")}{revenueTrend}%", trendUp = revenueTrend >= 0 },
                    visits = new { value = $"{visits:N0}", trend = $"{(visitsTrend >= 0 ? "+" : "")}{visitsTrend}%", trendUp = visitsTrend >= 0 },
                    payments = new { value = $"{payments:N0}", trend = $"{(paymentsTrend >= 0 ? "+" : "")}{paymentsTrend}%", trendUp = paymentsTrend >= 0 },
                    conversionRate = new { value = $"{conversionRate}%", trend = $"{(conversionTrend >= 0 ? "+" : "")}{conversionTrend}%", trendUp = conversionTrend >= 0 },
                },
                salesData,
                categories,
                topProducts,
            },
        });
    }
}
