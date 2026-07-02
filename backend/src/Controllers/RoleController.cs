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
public class RoleController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<RoleDto>>> GetRoles()
    {
        var roles = await _context.Roles
            .Include(r => r.RoleMenus)
            .OrderBy(r => r.Id)
            .ToListAsync();

        return roles.Select(r => new RoleDto
        {
            Id = r.Id,
            Name = r.Name,
            Description = r.Description,
            MenuIds = r.RoleMenus?.Select(rm => rm.MenuId).ToList()
        }).ToList();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<RoleDto>> GetRole(int id)
    {
        var role = await _context.Roles
            .Include(r => r.RoleMenus)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null) return NotFound();

        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            MenuIds = role.RoleMenus?.Select(rm => rm.MenuId).ToList()
        };
    }

    [HttpPost]
    public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto dto)
    {
        var exists = await _context.Roles.AnyAsync(r => r.Name == dto.Name);
        if (exists) return BadRequest("Role already exists");

        var role = new Role
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _context.Roles.Add(role);
        await _context.SaveChangesAsync();

        if (dto.MenuIds?.Count > 0)
        {
            foreach (var menuId in dto.MenuIds)
            {
                _context.RoleMenus.Add(new RoleMenu { RoleId = role.Id, MenuId = menuId });
            }
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetRole), new { id = role.Id }, new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            MenuIds = dto.MenuIds
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, UpdateRoleDto dto)
    {
        var role = await _context.Roles
            .Include(r => r.RoleMenus)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null) return NotFound();

        if (role.Name != dto.Name)
        {
            var exists = await _context.Roles.AnyAsync(r => r.Name == dto.Name && r.Id != id);
            if (exists) return BadRequest("Role name already exists");
        }

        role.Name = dto.Name;
        role.Description = dto.Description;
        role.UpdatedAt = DateTime.UtcNow;

        if (dto.MenuIds != null)
        {
            _context.RoleMenus.RemoveRange(role.RoleMenus ?? new List<RoleMenu>());
            foreach (var menuId in dto.MenuIds)
            {
                _context.RoleMenus.Add(new RoleMenu { RoleId = role.Id, MenuId = menuId });
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles
            .Include(r => r.UserRoles)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (role == null) return NotFound();

        if ((role.UserRoles?.Count ?? 0) > 0)
            return BadRequest("Cannot delete role with assigned users");

        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
