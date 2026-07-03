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
public class LeaveController : ControllerBase
{
    private readonly AppDbContext _context;

    public LeaveController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<LeaveRecordDto>>> GetLeaves(
        DateTime? startDate = null, DateTime? endDate = null, int? userId = null, string? status = null)
    {
        var query = _context.LeaveRecords
            .Include(l => l.User)
            .Include(l => l.Approver)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(l => l.StartDate >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(l => l.EndDate <= endDate.Value);
        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(l => l.Status == status);

        var records = await query
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        return records.Select(l => new LeaveRecordDto
        {
            Id = l.Id,
            UserId = l.UserId,
            UserName = l.User?.Username ?? string.Empty,
            LeaveType = l.LeaveType,
            StartDate = l.StartDate,
            EndDate = l.EndDate,
            Days = l.Days,
            Hours = l.Hours,
            Status = l.Status,
            Reason = l.Reason,
            Remark = l.Remark,
            ApproverId = l.ApproverId,
            ApproverName = l.Approver?.Username,
            ApprovedAt = l.ApprovedAt,
            CreatedAt = l.CreatedAt
        }).ToList();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<LeaveRecordDto>> GetLeave(int id)
    {
        var record = await _context.LeaveRecords
            .Include(l => l.User)
            .Include(l => l.Approver)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (record == null) return NotFound();

        return new LeaveRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = record.User?.Username ?? string.Empty,
            LeaveType = record.LeaveType,
            StartDate = record.StartDate,
            EndDate = record.EndDate,
            Days = record.Days,
            Hours = record.Hours,
            Status = record.Status,
            Reason = record.Reason,
            Remark = record.Remark,
            ApproverId = record.ApproverId,
            ApproverName = record.Approver?.Username,
            ApprovedAt = record.ApprovedAt,
            CreatedAt = record.CreatedAt
        };
    }

    [HttpGet("my")]
    public async Task<ActionResult<List<LeaveRecordDto>>> GetMyLeaves(
        DateTime? startDate = null, DateTime? endDate = null, string? status = null)
    {
        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null) return Unauthorized();
        var userId = int.Parse(userIdStr);

        var query = _context.LeaveRecords
            .Include(l => l.Approver)
            .Where(l => l.UserId == userId)
            .AsQueryable();

        if (startDate.HasValue)
            query = query.Where(l => l.StartDate >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(l => l.EndDate <= endDate.Value);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(l => l.Status == status);

        var records = await query
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        return records.Select(l => new LeaveRecordDto
        {
            Id = l.Id,
            UserId = l.UserId,
            UserName = User.Identity?.Name ?? string.Empty,
            LeaveType = l.LeaveType,
            StartDate = l.StartDate,
            EndDate = l.EndDate,
            Days = l.Days,
            Hours = l.Hours,
            Status = l.Status,
            Reason = l.Reason,
            Remark = l.Remark,
            ApproverId = l.ApproverId,
            ApproverName = l.Approver?.Username,
            ApprovedAt = l.ApprovedAt,
            CreatedAt = l.CreatedAt
        }).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<LeaveRecordDto>> CreateLeave(CreateLeaveDto dto)
    {
        var record = new LeaveRecord
        {
            UserId = dto.UserId,
            LeaveType = dto.LeaveType,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Days = dto.Days,
            Hours = dto.Hours,
            Status = "pending",
            Reason = dto.Reason,
            Remark = dto.Remark,
            CreatedAt = DateTime.UtcNow
        };

        _context.LeaveRecords.Add(record);
        await _context.SaveChangesAsync();

        var user = await _context.Users.FindAsync(dto.UserId);
        return CreatedAtAction(nameof(GetLeave), new { id = record.Id }, new LeaveRecordDto
        {
            Id = record.Id,
            UserId = record.UserId,
            UserName = user?.Username ?? string.Empty,
            LeaveType = record.LeaveType,
            StartDate = record.StartDate,
            EndDate = record.EndDate,
            Days = record.Days,
            Hours = record.Hours,
            Status = record.Status,
            Reason = record.Reason,
            Remark = record.Remark,
            CreatedAt = record.CreatedAt
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateLeave(int id, UpdateLeaveDto dto)
    {
        var record = await _context.LeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.LeaveType = dto.LeaveType;
        record.StartDate = dto.StartDate;
        record.EndDate = dto.EndDate;
        record.Days = dto.Days;
        record.Hours = dto.Hours;
        record.Status = dto.Status;
        record.Reason = dto.Reason;
        record.Remark = dto.Remark;
        record.ApproverId = dto.ApproverId;
        if (dto.Status == "approved" && !record.ApprovedAt.HasValue)
        {
            record.ApprovedAt = DateTime.UtcNow;
        }
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ApproveLeave(int id)
    {
        var record = await _context.LeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        var userIdStr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userIdStr == null) return Unauthorized();

        record.Status = "approved";
        record.ApproverId = int.Parse(userIdStr);
        record.ApprovedAt = DateTime.UtcNow;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RejectLeave(int id, [FromBody] string? remark)
    {
        var record = await _context.LeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        record.Status = "rejected";
        record.Remark = remark;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteLeave(int id)
    {
        var record = await _context.LeaveRecords.FindAsync(id);
        if (record == null) return NotFound();

        _context.LeaveRecords.Remove(record);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
