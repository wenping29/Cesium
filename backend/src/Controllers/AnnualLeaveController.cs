using CesiumApi.Data;
using CesiumApi.DTOs;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnnualLeaveController : ControllerBase
{
    private readonly AppDbContext _context;

    public AnnualLeaveController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AnnualLeaveRecordDto>>> GetAnnualLeaves(int? year = null, int? userId = null)
    {
        var query = _context.AnnualLeaveRecords
            .Include(a => a.User)
            .AsQueryable();

        if (year.HasValue)
            query = query.Where(a => a.Year == year.Value);
        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        var records = await query
            .OrderByDescending(a => a.Year)
            .ThenBy(a => a.UserId)
            .ToListAsync();

        return records.Select(a => new AnnualLeaveRecordDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = a.User?.Username ?? string.Empty,
            Year = a.Year,
            TotalDays = a.TotalDays,
            UsedDays = a.UsedDays,
            RemainingDays = a.RemainingDays,
            CarriedOverDays = a.CarriedOverDays,
            Remark = a.Remark,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AnnualLeaveRecordDto>> GetAnnualLeave(int id)
    {
        var record = await _context.AnnualLeaveRecords
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (record == null) return NotFound();

        return new AnnualLeaveRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = record.User?.Username ?? string.Empty,
            Year = record.Year,
            TotalDays = record.TotalDays,
            UsedDays = record.UsedDays,
            RemainingDays = record.RemainingDays,
            CarriedOverDays = record.CarriedOverDays,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        };
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<AnnualLeaveRecordDto>>> GetMyAnnualLeaves(int? year = null)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null) return Unauthorized();
        var userId = int.Parse(userIdStr);

        var query = _context.AnnualLeaveRecords
            .Where(a => a.UserId == userId)
            .AsQueryable();

        if (year.HasValue)
            query = query.Where(a => a.Year == year.Value);

        var records = await query
            .OrderByDescending(a => a.Year)
            .ToListAsync();

        return records.Select(a => new AnnualLeaveRecordDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = User.Identity?.Name ?? string.Empty,
            Year = a.Year,
            TotalDays = a.TotalDays,
            UsedDays = a.UsedDays,
            RemainingDays = a.RemainingDays,
            CarriedOverDays = a.CarriedOverDays,
            Remark = a.Remark,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AnnualLeaveRecordDto>> CreateAnnualLeave(CreateAnnualLeaveDto dto)
    {
        var exists = await _context.AnnualLeaveRecords
            .AnyAsync(a => a.UserId == dto.UserId && a.Year == dto.Year);
        if (exists) return BadRequest("该用户该年度的年假记录已存在");

        var record = new AnnualLeaveRecord
        {
            UserId = dto.UserId,
            Year = dto.Year,
            TotalDays = dto.TotalDays,
            UsedDays = dto.UsedDays,
            RemainingDays = dto.TotalDays + dto.CarriedOverDays - dto.UsedDays,
            CarriedOverDays = dto.CarriedOverDays,
            Remark = dto.Remark,
            CreatedAt = DateTime.UtcNow
        };

        _context.AnnualLeaveRecords.Add(record);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(dto.UserId);
        return CreatedAtAction(nameof(GetAnnualLeave), new { id = record.Id }, new AnnualLeaveRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = user?.Username ?? string.Empty,
            Year = record.Year,
            TotalDays = record.TotalDays,
            UsedDays = record.UsedDays,
            RemainingDays = record.RemainingDays,
            CarriedOverDays = record.CarriedOverDays,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAnnualLeave(int id, UpdateAnnualLeaveDto dto)
    {
        var record = await _context.AnnualLeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.TotalDays = dto.TotalDays;
        record.UsedDays = dto.UsedDays;
        record.RemainingDays = dto.TotalDays + dto.CarriedOverDays - dto.UsedDays;
        record.CarriedOverDays = dto.CarriedOverDays;
        record.Remark = dto.Remark;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAnnualLeave(int id)
    {
        var record = await _context.AnnualLeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.AnnualLeaveRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
