using CesiumApi.Data;
using CesiumApi.DTOs;
using CesiumApi.Helpers;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == int.Parse(userId));

        if (user == null) return NotFound();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
        };
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<UserDetailDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Include(u => u.Department)
            .OrderBy(u => u.Id)
            .ToListAsync();

        return users.Select(u => new UserDetailDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Phone = u.Phone,
            Avatar = u.Avatar,
            DepartmentId = u.DepartmentId,
            DepartmentName = u.Department?.Name,
            IsActive = u.IsActive,
            Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList(),
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDetailDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        return new UserDetailDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Phone = user.Phone,
            Avatar = user.Avatar,
            DepartmentId = user.DepartmentId,
            DepartmentName = user.Department?.Name,
            IsActive = user.IsActive,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList(),
            CreatedAt = user.CreatedAt
        };
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<UserDetailDto>> CreateUser(CreateUserDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email);
        if (exists) return BadRequest("Username or email already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = PasswordHelper.HashPassword(dto.Password),
            Phone = dto.Phone,
            DepartmentId = dto.DepartmentId,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        if (dto.Roles?.Count > 0)
        {
            foreach (var roleName in dto.Roles)
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
                if (role != null)
                {
                    _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
                }
            }
            await _context.SaveChangesAsync();
        }

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new UserDetailDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Phone = user.Phone,
            DepartmentId = user.DepartmentId,
            IsActive = user.IsActive,
            Roles = dto.Roles ?? new List<string>(),
            CreatedAt = user.CreatedAt
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null) return NotFound();

        var exists = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id);
        if (exists) return BadRequest("Email already exists");

        user.Email = dto.Email;
        user.Phone = dto.Phone;
        user.DepartmentId = dto.DepartmentId;
        user.IsActive = dto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        if (dto.Roles != null)
        {
            _context.UserRoles.RemoveRange(user.UserRoles ?? new List<UserRole>());
            foreach (var roleName in dto.Roles)
            {
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
                if (role != null)
                {
                    _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
                }
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{userId}/roles/{roleName}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddRole(int userId, string roleName)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
        if (role == null)
        {
            role = new Role { Name = roleName };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
        }

        if (user.UserRoles.Any(ur => ur.RoleId == role.Id))
            return BadRequest("User already has this role");

        user.UserRoles.Add(new UserRole { RoleId = role.Id });
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpDelete("{userId}/roles/{roleName}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RemoveRole(int userId, string roleName)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound("User not found");

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == roleName);
        if (role == null) return NotFound("Role not found");

        var userRole = user.UserRoles.FirstOrDefault(ur => ur.RoleId == role.Id);
        if (userRole != null)
        {
            user.UserRoles.Remove(userRole);
            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpPost("{id}/reset-password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResetPassword(int id, ResetPasswordDto? dto = null)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound("User not found");

        var newPassword = dto?.NewPassword ?? "123456";
        user.PasswordHash = PasswordHelper.HashPassword(newPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Password reset successfully", DefaultPassword = newPassword });
    }
}
