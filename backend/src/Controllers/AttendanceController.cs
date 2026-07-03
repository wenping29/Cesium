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
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;

    public AttendanceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<AttendanceRecordDto>>> GetAttendances(
        DateTime? startDate = null, DateTime? endDate = null, int? userId = null)
    {
        var query = _context.AttendanceRecords
            .Include(a => a.User)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value);
        if (userId.HasValue)
            query = query.Where(a => a.UserId == userId.Value);

        var records = await query
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return records.Select(a => new AttendanceRecordDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = a.User?.Username ?? string.Empty,
            Date = a.Date,
            CheckInTime = a.CheckInTime,
            CheckOutTime = a.CheckOutTime,
            Status = a.Status,
            Remark = a.Remark,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AttendanceRecordDto>> GetAttendance(int id)
    {
        var record = await _context.AttendanceRecords
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (record == null) return NotFound();

        return new AttendanceRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = record.User?.Username ?? string.Empty,
            Date = record.Date,
            CheckInTime = record.CheckInTime,
            CheckOutTime = record.CheckOutTime,
            Status = record.Status,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        };
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<AttendanceRecordDto>>> GetMyAttendances(
        DateTime? startDate = null, DateTime? endDate = null)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null) return Unauthorized();
        var userId = int.Parse(userIdStr);

        var query = _context.AttendanceRecords
            .Where(a => a.UserId == userId)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(a => a.Date >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(a => a.Date <= endDate.Value);

        var records = await query
            .OrderByDescending(a => a.Date)
            .ToListAsync();

        return records.Select(a => new AttendanceRecordDto
        {
            Id = a.Id,
            UserId = a.UserId,
            UserName = User.Identity?.Name ?? string.Empty,
            Date = a.Date,
            CheckInTime = a.CheckInTime,
            CheckOutTime = a.CheckOutTime,
            Status = a.Status,
            Remark = a.Remark,
            CreatedAt = a.CreatedAt
        }).ToList();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AttendanceRecordDto>> CreateAttendance(CreateAttendanceDto dto)
    {
        var exists = await _context.AttendanceRecords
            .AnyAsync(a => a.UserId == dto.UserId && a.Date.Date == dto.Date.Date);
        if (exists) return BadRequest("该日期的考勤记录已存在");

        var record = new AttendanceRecord
        {
            UserId = dto.UserId,
            Date = dto.Date,
            CheckInTime = dto.CheckInTime,
            CheckOutTime = dto.CheckOutTime,
            Status = dto.Status,
            Remark = dto.Remark,
            CreatedAt = DateTime.UtcNow
        };

        _context.AttendanceRecords.Add(record);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(dto.UserId);
        return CreatedAtAction(nameof(GetAttendance), new { id = record.Id }, new AttendanceRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = user?.Username ?? string.Empty,
            Date = record.Date,
            CheckInTime = record.CheckInTime,
            CheckOutTime = record.CheckOutTime,
            Status = record.Status,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAttendance(int id, UpdateAttendanceDto dto)
    {
        var record = await _context.AttendanceRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.CheckInTime = dto.CheckInTime;
        record.CheckOutTime = dto.CheckOutTime;
        record.Status = dto.Status;
        record.Remark = dto.Remark;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAttendance(int id)
    {
        var record = await _context.AttendanceRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.AttendanceRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
