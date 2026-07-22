using CesiumApi.Data;
using CesiumApi.DTOs;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class MenuController : ControllerBase
{
    private readonly AppDbContext _context;

    public MenuController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<List<MenuDto>>> GetMenus()
    {
        var menus = await _context.Menus
            .Where(m => m.IsVisible)
            .OrderBy(m => m.SortOrder)
            .ToListAsync();

        if (!User.Identity?.IsAuthenticated ?? true)
            return BuildMenuTree(menus, null);

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var userRoleIds = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        var allowedMenuIds = await _context.RoleMenus
            .Where(rm => userRoleIds.Contains(rm.RoleId))
            .Select(rm => rm.MenuId)
            .Distinct()
            .ToListAsync();

        var allowedIds = new HashSet<int>(allowedMenuIds);
        var filtered = menus.Where(m => allowedIds.Contains(m.Id)).ToList();

        var parentIds = filtered
            .Where(m => m.ParentId.HasValue)
            .Select(m => m.ParentId!.Value)
            .ToHashSet();
        while (parentIds.Count > 0)
        {
            var newParentIds = new HashSet<int>();
            foreach (var pid in parentIds)
            {
                if (allowedIds.Contains(pid)) continue;
                allowedIds.Add(pid);
                var parent = menus.FirstOrDefault(m => m.Id == pid);
                if (parent?.ParentId.HasValue == true)
                    newParentIds.Add(parent.ParentId.Value);
            }
            parentIds = newParentIds;
        }

        filtered = menus.Where(m => allowedIds.Contains(m.Id)).ToList();
        return BuildMenuTree(filtered, null);
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<ActionResult<List<MenuDto>>> GetAllMenus()
    {
        var menus = await _context.Menus
            .OrderBy(m => m.SortOrder)
            .ToListAsync();


        return BuildMenuTree(menus, null);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MenuDto>> GetMenu(int id)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null) return NotFound();

        return new MenuDto
        {
            Id = menu.Id,
            Name = menu.Name,
            Path = menu.Path,
            Icon = menu.Icon,
            ParentId = menu.ParentId,
            SortOrder = menu.SortOrder,
            IsVisible = menu.IsVisible,
            Permission = menu.Permission
        };
    }

    [HttpPost]
    public async Task<ActionResult<MenuDto>> CreateMenu(CreateMenuDto dto)
    {
        var menu = new Menu
        {
            Name = dto.Name,
            Path = dto.Path,
            Icon = dto.Icon,
            ParentId = dto.ParentId,
            SortOrder = dto.SortOrder,
            IsVisible = dto.IsVisible,
            Permission = dto.Permission
        };

        _context.Menus.Add(menu);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMenu), new { id = menu.Id }, new MenuDto
        {
            Id = menu.Id,
            Name = menu.Name,
            Path = menu.Path,
            Icon = menu.Icon,
            ParentId = menu.ParentId,
            SortOrder = menu.SortOrder,
            IsVisible = menu.IsVisible,
            Permission = menu.Permission
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenu(int id, UpdateMenuDto dto)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null) return NotFound();

        menu.Name = dto.Name;
        menu.Path = dto.Path;
        menu.Icon = dto.Icon;
        menu.ParentId = dto.ParentId;
        menu.SortOrder = dto.SortOrder;
        menu.IsVisible = dto.IsVisible;
        menu.Permission = dto.Permission;
        menu.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenu(int id)
    {
        var menu = await _context.Menus.FindAsync(id);
        if (menu == null) return NotFound();

        var hasChildren = await _context.Menus.AnyAsync(m => m.ParentId == id);
        if (hasChildren) return BadRequest("Cannot delete menu with children");

        _context.Menus.Remove(menu);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private List<MenuDto> BuildMenuTree(List<Menu> allMenus, int? parentId)
    {
        return allMenus
            .Where(m => m.ParentId == parentId)
            .Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                Path = m.Path,
                Icon = m.Icon,
                ParentId = m.ParentId,
                SortOrder = m.SortOrder,
                IsVisible = m.IsVisible,
                Permission = m.Permission,
                Children = BuildMenuTree(allMenus, m.Id)
            })
            .ToList();
    }
}
