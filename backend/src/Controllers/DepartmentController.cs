using CesiumApi.Data;
using CesiumApi.DTOs;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DepartmentController : ControllerBase
{
    private readonly AppDbContext _context;

    public DepartmentController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<DepartmentDto>>> GetDepartments()
    {
        var departments = await _context.Departments
            .Include(d => d.Users)
            .Where(d => d.IsActive)
            .OrderBy(d => d.SortOrder)
            .ToListAsync();

        return BuildDepartmentTree(departments, null);
    }

    [HttpGet("all")]
        [AllowAnonymous]
    public async Task<ActionResult<List<DepartmentDto>>> GetAllDepartments()
    {
        var departments = await _context.Departments
            .Include(d => d.Users)
            .OrderBy(d => d.SortOrder)
            .ToListAsync();

        return BuildDepartmentTree(departments, null);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Users)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return NotFound();

        return new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Code = department.Code,
            ParentId = department.ParentId,
            SortOrder = department.SortOrder,
            Leader = department.Leader,
            Phone = department.Phone,
            Email = department.Email,
            Address = department.Address,
            IsActive = department.IsActive,
            UserCount = department.Users?.Count ?? 0
        };
    }

    [HttpPost]
    public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto dto)
    {
        if (!string.IsNullOrEmpty(dto.Code))
        {
            var exists = await _context.Departments.AnyAsync(d => d.Code == dto.Code);
            if (exists) return BadRequest("Department code already exists");
        }

        var department = new Department
        {
            Name = dto.Name,
            Code = dto.Code,
            ParentId = dto.ParentId,
            SortOrder = dto.SortOrder,
            Leader = dto.Leader,
            Phone = dto.Phone,
            Email = dto.Email,
            Address = dto.Address,
            IsActive = true
        };

        _context.Departments.Add(department);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, new DepartmentDto
        {
            Id = department.Id,
            Name = department.Name,
            Code = department.Code,
            ParentId = department.ParentId,
            SortOrder = department.SortOrder,
            Leader = department.Leader,
            Phone = department.Phone,
            Email = department.Email,
            Address = department.Address,
            IsActive = department.IsActive
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateDepartment(int id, UpdateDepartmentDto dto)
    {
        var department = await _context.Departments.FindAsync(id);
        if (department == null) return NotFound();

        if (!string.IsNullOrEmpty(dto.Code) && dto.Code != department.Code)
        {
            var exists = await _context.Departments.AnyAsync(d => d.Code == dto.Code && d.Id != id);
            if (exists) return BadRequest("Department code already exists");
        }

        department.Name = dto.Name;
        department.Code = dto.Code;
        department.ParentId = dto.ParentId;
        department.SortOrder = dto.SortOrder;
        department.Leader = dto.Leader;
        department.Phone = dto.Phone;
        department.Email = dto.Email;
        department.Address = dto.Address;
        department.IsActive = dto.IsActive;
        department.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDepartment(int id)
    {
        var department = await _context.Departments
            .Include(d => d.Users)
            .Include(d => d.Children)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (department == null) return NotFound();

        if ((department.Children?.Count ?? 0) > 0)
            return BadRequest("Cannot delete department with children");

        if ((department.Users?.Count ?? 0) > 0)
            return BadRequest("Cannot delete department with users");

        _context.Departments.Remove(department);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private List<DepartmentDto> BuildDepartmentTree(List<Department> allDepartments, int? parentId)
    {
        return allDepartments
            .Where(d => d.ParentId == parentId)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Code = d.Code,
                ParentId = d.ParentId,
                SortOrder = d.SortOrder,
                Leader = d.Leader,
                Phone = d.Phone,
                Email = d.Email,
                Address = d.Address,
                IsActive = d.IsActive,
                UserCount = d.Users?.Count ?? 0,
                Children = BuildDepartmentTree(allDepartments, d.Id)
            })
            .ToList();
    }
}
