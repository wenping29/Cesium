using CesiumApi.Data;
using CesiumApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace CesiumApi.Controllers;

[ApiController]
[Route("api/system")]
[Authorize]
public class SystemController : ControllerBase
{
    private readonly AppDbContext _context;

    public SystemController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("user/list")]
    public async Task<ActionResult<object>> GetUserList([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? username = null, [FromQuery] string? email = null, [FromQuery] string? status = null)
    {
        var query = _context.Users.AsQueryable();

        if (!string.IsNullOrEmpty(username))
            query = query.Where(u => u.Username.Contains(username));

        if (!string.IsNullOrEmpty(email))
            query = query.Where(u => u.Email.Contains(email));

        if (!string.IsNullOrEmpty(status))
        {
            if (status == "active")
                query = query.Where(u => u.IsActive);
            else if (status == "inactive")
                query = query.Where(u => !u.IsActive);
        }

        var total = await query.CountAsync();
        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .OrderBy(u => u.Id)
            .ToListAsync();

        var userList = users.Select(u => new
        {
            id = u.Id,
            username = u.Username,
            name = u.Name,
            email = u.Email,
            phone = u.Phone,
            status = u.IsActive ? "active" : "inactive",
            createTime = u.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
        }).ToList();

        return Ok(new
        {
            code = 0,
            message = "success",
            data = new
            {
                list = userList,
                total
            }
        });
    }

    [HttpPost("user")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> CreateUser([FromBody] SystemUserCreateDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email);
        if (exists)
            return BadRequest(new { code = -1, message = "用户名或邮箱已存在" });

        var user = new User
        {
            Username = dto.Username,
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            IsActive = dto.Status == "active"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            code = 0,
            message = "success",
            data = new
            {
                id = user.Id,
                username = user.Username,
                name = user.Name,
                email = user.Email,
                phone = user.Phone,
                status = user.IsActive ? "active" : "inactive",
                createTime = user.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")
            }
        });
    }

    [HttpDelete("user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<object>> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return BadRequest(new { code = -1, message = "用户不存在" });

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { code = 0, message = "success" });
    }
}

public class SystemUserCreateDto
{
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Password { get; set; } = string.Empty;
    public string Status { get; set; } = "active";
}