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
public class WorkHourController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkHourController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("all")]
    public async Task<ActionResult<List<WorkHourRecordDto>>> All(int page = 1, int pageSize = 20, int? month = null)
    {
        var query = _context.WorkHourRecords
            .Include(w => w.User)
            .AsQueryable();

        var records = await query
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return records.Select(w => new WorkHourRecordDto
        {
            Id = w.Id,
            UserId = w.UserId,
            UserName = w.User?.Username ?? string.Empty,
            Date = w.Date,
            RegularHours = w.RegularHours,
            OvertimeHours = w.OvertimeHours,
            WeekendHours = w.WeekendHours,
            HolidayHours = w.HolidayHours,
            ProjectName = w.ProjectName,
            TaskDescription = w.TaskDescription,
            Remark = w.Remark,
            CreatedAt = w.CreatedAt
        }).ToList();
    }

    [HttpGet("list")]
    public async Task<ActionResult<List<WorkHourRecordDto>>> GetWorkHours(
        DateTime? startDate = null, DateTime? endDate = null, int? userId = null)
    {
        var query = _context.WorkHourRecords
            .Include(w => w.User)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(w => w.Date >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(w => w.Date <= endDate.Value);
        if (userId.HasValue)
            query = query.Where(w => w.UserId == userId.Value);

        var records = await query
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return records.Select(w => new WorkHourRecordDto
        {
            Id = w.Id,
            UserId = w.UserId,
            UserName = w.User?.Username ?? string.Empty,
            Date = w.Date,
            RegularHours = w.RegularHours,
            OvertimeHours = w.OvertimeHours,
            WeekendHours = w.WeekendHours,
            HolidayHours = w.HolidayHours,
            ProjectName = w.ProjectName,
            TaskDescription = w.TaskDescription,
            Remark = w.Remark,
            CreatedAt = w.CreatedAt
        }).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WorkHourRecordDto>> GetWorkHour(int id)
    {
        var record = await _context.WorkHourRecords
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (record == null) return NotFound();

        return new WorkHourRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = record.User?.Username ?? string.Empty,
            Date = record.Date,
            RegularHours = record.RegularHours,
            OvertimeHours = record.OvertimeHours,
            WeekendHours = record.WeekendHours,
            HolidayHours = record.HolidayHours,
            ProjectName = record.ProjectName,
            TaskDescription = record.TaskDescription,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        };
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<WorkHourRecordDto>>> GetMyWorkHours(
        DateTime? startDate = null, DateTime? endDate = null)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null) return Unauthorized();
        var userId = int.Parse(userIdStr);

        var query = _context.WorkHourRecords
            .Where(w => w.UserId == userId)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(w => w.Date >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(w => w.Date <= endDate.Value);

        var records = await query
            .OrderByDescending(w => w.Date)
            .ToListAsync();

        return records.Select(w => new WorkHourRecordDto
        {
            Id = w.Id,
            UserId = w.UserId,
            UserName = User.Identity?.Name ?? string.Empty,
            Date = w.Date,
            RegularHours = w.RegularHours,
            OvertimeHours = w.OvertimeHours,
            WeekendHours = w.WeekendHours,
            HolidayHours = w.HolidayHours,
            ProjectName = w.ProjectName,
            TaskDescription = w.TaskDescription,
            Remark = w.Remark,
            CreatedAt = w.CreatedAt
        }).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<WorkHourRecordDto>> CreateWorkHour(CreateWorkHourDto dto)
    {
        var record = new WorkHourRecord
        {
            UserId = dto.UserId,
            Date = dto.Date,
            RegularHours = dto.RegularHours,
            OvertimeHours = dto.OvertimeHours,
            WeekendHours = dto.WeekendHours,
            HolidayHours = dto.HolidayHours,
            ProjectName = dto.ProjectName,
            TaskDescription = dto.TaskDescription,
            Remark = dto.Remark,
            CreatedAt = DateTime.UtcNow
        };

        _context.WorkHourRecords.Add(record);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(dto.UserId);
        return CreatedAtAction(nameof(GetWorkHour), new { id = record.Id }, new WorkHourRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = user?.Username ?? string.Empty,
            Date = record.Date,
            RegularHours = record.RegularHours,
            OvertimeHours = record.OvertimeHours,
            WeekendHours = record.WeekendHours,
            HolidayHours = record.HolidayHours,
            ProjectName = record.ProjectName,
            TaskDescription = record.TaskDescription,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkHour(int id, UpdateWorkHourDto dto)
    {
        var record = await _context.WorkHourRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.RegularHours = dto.RegularHours;
        record.OvertimeHours = dto.OvertimeHours;
        record.WeekendHours = dto.WeekendHours;
        record.HolidayHours = dto.HolidayHours;
        record.ProjectName = dto.ProjectName;
        record.TaskDescription = dto.TaskDescription;
        record.Remark = dto.Remark;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkHour(int id)
    {
        var record = await _context.WorkHourRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.WorkHourRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
