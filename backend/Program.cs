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

    var attendanceMenus = new (int Id, string Name, string? Path, string Icon, int? ParentId, int SortOrder, string Permission)[]
    {
        (9, "考勤管理", null, "Schedule", null, 2, "attendance"),
        (10, "打开报表", "/attendance-report", "Description", 9, 1, "attendance:report"),
        (11, "工时报表", "/workhour-report", "Timer", 9, 2, "attendance:workhour"),
        (12, "休假报表", "/leave-report", "HolidayVillage", 9, 3, "attendance:leave"),
        (13, "年假报表", "/annual-leave-report", "BeachAccess", 9, 4, "attendance:annual")
    };

    foreach (var menu in attendanceMenus)
    {
        var existing = await context.Menus.FindAsync(menu.Id);
        if (existing == null)
        {
            context.Menus.Add(new Menu
            {
                Id = menu.Id,
                Name = menu.Name,
                Path = menu.Path,
                Icon = menu.Icon,
                ParentId = menu.ParentId,
                SortOrder = menu.SortOrder,
                IsVisible = true,
                Permission = menu.Permission,
                CreatedAt = DateTime.UtcNow
            });
        }
    }
    await context.SaveChangesAsync();

    if (context.AttendanceRecords.Any())
    {
        context.AttendanceRecords.RemoveRange(context.AttendanceRecords);
        await context.SaveChangesAsync();
    }
    
    var currentUser = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
    if (currentUser != null)
    {
        var now = DateTime.UtcNow;
        var random = new Random();
        
        for (int i = 99; i >= 0; i--)
        {
            var date = now.Date.AddDays(-i);
            bool isWeekend = date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
            
            int checkInHour = isWeekend ? 9 : 8;
            int checkOutHour = isWeekend ? 17 : 18;
            
            var randomValue = random.Next(100);
            string status;
            int checkInMinute = 0;
            int checkOutMinute = 0;
            string? remark = null;
            
            if (isWeekend)
            {
                if (randomValue < 30)
                {
                    status = "absent";
                    checkInHour = 0;
                    checkOutHour = 0;
                    remark = "周末休息";
                }
                else
                {
                    status = "weekend";
                    checkInMinute = random.Next(30);
                    checkOutMinute = random.Next(30);
                    remark = "周末加班";
                }
            }
            else
            {
                if (randomValue < 5)
                {
                    status = "absent";
                    checkInHour = 0;
                    checkOutHour = 0;
                    remark = "旷工";
                }
                else if (randomValue < 15)
                {
                    status = "late";
                    checkInMinute = random.Next(60) + 5;
                    checkOutMinute = random.Next(30);
                    remark = "迟到";
                }
                else if (randomValue < 25)
                {
                    status = "early";
                    checkInMinute = random.Next(30);
                    checkOutMinute = -random.Next(60) - 5;
                    remark = "早退";
                }
                else
                {
                    status = "normal";
                    checkInMinute = random.Next(15) - 5;
                    if (checkInMinute < 0) checkInMinute = 0;
                    checkOutMinute = random.Next(30);
                }
            }
            
            var checkInTime = checkInHour > 0 ? new TimeSpan(checkInHour, Math.Max(0, checkInMinute), 0) : (TimeSpan?)null;
            var checkOutTime = checkOutHour > 0 ? new TimeSpan(checkOutHour, Math.Max(0, checkOutMinute), 0) : (TimeSpan?)null;
            
            context.AttendanceRecords.Add(new AttendanceRecord
            {
                UserId = currentUser.Id,
                Date = date,
                CheckInTime = checkInTime,
                CheckOutTime = checkOutTime,
                Status = status,
                Remark = remark,
                CreatedAt = DateTime.UtcNow
            });
        }
        await context.SaveChangesAsync();
    }

    if (!context.WorkHourRecords.Any())
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
        if (user != null)
        {
            var now = DateTime.UtcNow;
            for (int i = 6; i >= 0; i--)
            {
                var date = now.Date.AddDays(-i);
                bool isWeekend = date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
                
                context.WorkHourRecords.Add(new WorkHourRecord
                {
                    UserId = user.Id,
                    Date = date,
                    RegularHours = isWeekend ? 0 : 8,
                    OvertimeHours = isWeekend ? 0 : 1,
                    WeekendHours = isWeekend ? 8 : 0,
                    HolidayHours = 0,
                    ProjectName = "Cesium项目",
                    TaskDescription = "地图开发",
                    CreatedAt = DateTime.UtcNow
                });
            }
            await context.SaveChangesAsync();
        }
    }

    if (!context.LeaveRecords.Any())
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
        if (user != null)
        {
            context.LeaveRecords.AddRange(new[]
            {
                new LeaveRecord
                {
                    UserId = user.Id,
                    LeaveType = "personal",
                    StartDate = DateTime.UtcNow.Date.AddDays(-10),
                    EndDate = DateTime.UtcNow.Date.AddDays(-9),
                    Days = 2,
                    Hours = 0,
                    Status = "approved",
                    Reason = "个人事务",
                    ApproverId = user.Id,
                    ApprovedAt = DateTime.UtcNow.Date.AddDays(-11),
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-12)
                },
                new LeaveRecord
                {
                    UserId = user.Id,
                    LeaveType = "sick",
                    StartDate = DateTime.UtcNow.Date.AddDays(-5),
                    EndDate = DateTime.UtcNow.Date.AddDays(-5),
                    Days = 1,
                    Hours = 0,
                    Status = "approved",
                    Reason = "感冒发烧",
                    ApproverId = user.Id,
                    ApprovedAt = DateTime.UtcNow.Date.AddDays(-6),
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-6)
                },
                new LeaveRecord
                {
                    UserId = user.Id,
                    LeaveType = "annual",
                    StartDate = DateTime.UtcNow.Date.AddDays(7),
                    EndDate = DateTime.UtcNow.Date.AddDays(9),
                    Days = 3,
                    Hours = 0,
                    Status = "pending",
                    Reason = "年度休假",
                    CreatedAt = DateTime.UtcNow.Date.AddDays(-1)
                }
            });
            await context.SaveChangesAsync();
        }
    }

    if (!context.AnnualLeaveRecords.Any())
    {
        var user = await context.Users.FirstOrDefaultAsync(u => u.Username == "admin");
        if (user != null)
        {
            context.AnnualLeaveRecords.Add(new AnnualLeaveRecord
            {
                UserId = user.Id,
                Year = DateTime.UtcNow.Year,
                TotalDays = 15,
                UsedDays = 5,
                RemainingDays = 10,
                CarriedOverDays = 2,
                CreatedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }
    }
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
