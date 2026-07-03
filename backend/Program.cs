using System.Text;
using CesiumApi.Data;
using CesiumApi.Helpers;
using CesiumApi.Models;
using CesiumApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<TokenService>();

var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "DefaultSecretKeyMustBeAtLeast32CharsLong!");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await context.Database.EnsureCreatedAsync();

    // 初始化角色
    var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
    if (adminRole == null)
    {
        adminRole = new Role { Name = "Admin", Description = "系统管理员" };
        context.Roles.Add(adminRole);
        await context.SaveChangesAsync();
    }

    var userRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "User");
    if (userRole == null)
    {
        userRole = new Role { Name = "User", Description = "普通用户" };
        context.Roles.Add(userRole);
        await context.SaveChangesAsync();
    }

    // 初始化管理员用户
    var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
    if (adminUser == null)
    {
        adminUser = new User
        {
            Username = "admin",
            Email = "admin@example.com",
            PasswordHash = PasswordHelper.HashPassword("Admin123!"),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        context.Users.Add(adminUser);
        await context.SaveChangesAsync();

        context.UserRoles.Add(new UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });
        context.UserRoles.Add(new UserRole { UserId = adminUser.Id, RoleId = userRole.Id });
        await context.SaveChangesAsync();
    }

    // 初始化部门数据（10个部门）
    var departments = new (int Id, string Name, string Code, int? ParentId, int SortOrder, string Leader, string Phone, string Email, string Address)[]
    {
        (1, "总公司", "HQ", null, 1, "张总", "010-88888888", "zhangzong@company.com", "北京市朝阳区建国路88号"),
        (2, "技术部", "TECH", 1, 1, "李经理", "010-88888801", "tech@company.com", "北京市朝阳区建国路88号A座3层"),
        (3, "产品部", "PROD", 1, 2, "王经理", "010-88888802", "product@company.com", "北京市朝阳区建国路88号A座5层"),
        (4, "市场部", "MKT", 1, 3, "赵经理", "010-88888803", "marketing@company.com", "北京市朝阳区建国路88号B座2层"),
        (5, "销售部", "SALES", 1, 4, "孙经理", "010-88888804", "sales@company.com", "北京市朝阳区建国路88号B座3层"),
        (6, "人事部", "HR", 1, 5, "周经理", "010-88888805", "hr@company.com", "北京市朝阳区建国路88号A座8层"),
        (7, "财务部", "FIN", 1, 6, "吴经理", "010-88888806", "finance@company.com", "北京市朝阳区建国路88号A座9层"),
        (8, "研发一组", "DEV1", 2, 1, "郑组长", "010-88888011", "dev1@company.com", "北京市朝阳区建国路88号A座301室"),
        (9, "研发二组", "DEV2", 2, 2, "陈组长", "010-88888012", "dev2@company.com", "北京市朝阳区建国路88号A座302室"),
        (10, "运维部", "OPS", 2, 3, "刘组长", "010-88888013", "ops@company.com", "北京市朝阳区建国路88号A座4层")
    };

    foreach (var dept in departments)
    {
        var existing = await context.Departments.FindAsync(dept.Id);
        if (existing == null)
        {
            context.Departments.Add(new Department
            {
                Id = dept.Id,
                Name = dept.Name,
                Code = dept.Code,
                ParentId = dept.ParentId,
                SortOrder = dept.SortOrder,
                Leader = dept.Leader,
                Phone = dept.Phone,
                Email = dept.Email,
                Address = dept.Address,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
    await context.SaveChangesAsync();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
