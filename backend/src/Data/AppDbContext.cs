using CesiumApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CesiumApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Menu> Menus { get; set; }
    public DbSet<Department> Departments { get; set; }
    public DbSet<RoleMenu> RoleMenus { get; set; }
    public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
    public DbSet<WorkHourRecord> WorkHourRecords { get; set; }
    public DbSet<LeaveRecord> LeaveRecords { get; set; }
    public DbSet<AnnualLeaveRecord> AnnualLeaveRecords { get; set; }
    public DbSet<LoginLog> LoginLogs { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<VisitorLog> VisitorLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // UserRole configuration
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        // RoleMenu configuration
        modelBuilder.Entity<RoleMenu>()
            .HasKey(rm => new { rm.RoleId, rm.MenuId });

        modelBuilder.Entity<RoleMenu>()
            .HasOne(rm => rm.Role)
            .WithMany(r => r.RoleMenus)
            .HasForeignKey(rm => rm.RoleId);

        modelBuilder.Entity<RoleMenu>()
            .HasOne(rm => rm.Menu)
            .WithMany(m => m.RoleMenus)
            .HasForeignKey(rm => rm.MenuId);

        // Menu configuration
        modelBuilder.Entity<Menu>()
            .HasOne(m => m.Parent)
            .WithMany(m => m.Children)
            .HasForeignKey(m => m.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Department configuration
        modelBuilder.Entity<Department>()
            .HasOne(d => d.Parent)
            .WithMany(d => d.Children)
            .HasForeignKey(d => d.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Department>()
            .HasMany(d => d.Users)
            .WithOne(u => u.Department)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        // Unique indexes
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.Name)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Department>()
            .HasIndex(d => d.Code)
            .IsUnique();

        // LoginLog configuration
        modelBuilder.Entity<LoginLog>()
            .HasOne(ll => ll.User)
            .WithMany()
            .HasForeignKey(ll => ll.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<LoginLog>()
            .HasIndex(ll => ll.UserId);

        modelBuilder.Entity<LoginLog>()
            .HasIndex(ll => ll.LoginTime);

        // Notification configuration
        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.UserId);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.Type);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.Read);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.Date);

        // VisitorLog configuration
        modelBuilder.Entity<VisitorLog>()
            .HasIndex(v => v.VisitTime);

        modelBuilder.Entity<VisitorLog>()
            .HasIndex(v => v.IpAddress);

        // Seed initial data
        SeedInitialData(modelBuilder);
    }

    private void SeedInitialData(ModelBuilder modelBuilder)
    {
        // Seed roles
        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin", Description = "系统管理员" },
            new Role { Id = 2, Name = "User", Description = "普通用户" }
        );

        // Seed menus - 完整菜单结构 (从 mock/menu.js 导入)
        modelBuilder.Entity<Menu>().HasData(
            // 首页 (Id 1-5)
            new Menu { Id = 1, Name = "首页", Path = null, Icon = "Home", ParentId = null, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 2, Name = "工作台", Path = "/workbench", Icon = "Dashboard", ParentId = 1, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 3, Name = "数据分析", Path = "/analysis", Icon = "Analytics", ParentId = 1, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 4, Name = "通知中心", Path = "/notifications", Icon = "Notifications", ParentId = 1, SortOrder = 3, IsVisible = true, Permission = null },
            new Menu { Id = 5, Name = "发送消息", Path = "/send-notification", Icon = "Send", ParentId = 1, SortOrder = 4, IsVisible = true, Permission = null },

            // 仪表盘 (Id 6)
            new Menu { Id = 6, Name = "仪表盘", Path = "/dashboard", Icon = "Dashboard", ParentId = null, SortOrder = 2, IsVisible = true, Permission = null },

            // 大屏展示 (Id 7)
            new Menu { Id = 7, Name = "大屏展示", Path = "/big-screen", Icon = "DesktopWindows", ParentId = null, SortOrder = 3, IsVisible = true, Permission = null },

            // 地图相关 (Id 8-11)
            new Menu { Id = 8, Name = "地图相关", Path = null, Icon = "Map", ParentId = null, SortOrder = 4, IsVisible = true, Permission = null },
            new Menu { Id = 9, Name = "Cesium地图", Path = "/map", Icon = "Map", ParentId = 8, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 10, Name = "OpenLayer地图", Path = "/openlayer-map", Icon = "Layers", ParentId = 8, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 11, Name = "Leaflet地图", Path = "/leaflet-map", Icon = "MapOutlined", ParentId = 8, SortOrder = 3, IsVisible = true, Permission = null },

            // 数据表格 (Id 12-16)
            new Menu { Id = 12, Name = "数据表格", Path = null, Icon = "TableChart", ParentId = null, SortOrder = 5, IsVisible = true, Permission = null },
            new Menu { Id = 13, Name = "地震数据", Path = "/earthquake-table", Icon = "Volcano", ParentId = 12, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 14, Name = "台风数据", Path = "/typhoon-table", Icon = "Storm", ParentId = 12, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 15, Name = "风力数据", Path = "/wind-table", Icon = "Waves", ParentId = 12, SortOrder = 3, IsVisible = true, Permission = null },
            new Menu { Id = 16, Name = "空气质量", Path = "/airquality-table", Icon = "Air", ParentId = 12, SortOrder = 4, IsVisible = true, Permission = null },

            // 权限管理 (Id 17-21)
            new Menu { Id = 17, Name = "权限管理", Path = null, Icon = "Settings", ParentId = null, SortOrder = 6, IsVisible = true, Permission = "admin" },
            new Menu { Id = 18, Name = "用户管理", Path = "/user-management", Icon = "People", ParentId = 17, SortOrder = 1, IsVisible = true, Permission = "admin" },
            new Menu { Id = 19, Name = "角色管理", Path = "/role-management", Icon = "Shield", ParentId = 17, SortOrder = 2, IsVisible = true, Permission = "admin" },
            new Menu { Id = 20, Name = "菜单管理", Path = "/menu-management", Icon = "Menu", ParentId = 17, SortOrder = 3, IsVisible = true, Permission = "admin" },
            new Menu { Id = 21, Name = "部门管理", Path = "/department-management", Icon = "Business", ParentId = 17, SortOrder = 4, IsVisible = true, Permission = "admin" },

            // 考勤管理 (Id 22-26)
            new Menu { Id = 22, Name = "考勤管理", Path = null, Icon = "Schedule", ParentId = null, SortOrder = 7, IsVisible = true, Permission = null },
            new Menu { Id = 23, Name = "打卡报表", Path = "/attendance-report", Icon = "Description", ParentId = 22, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 24, Name = "工时报表", Path = "/workhour-report", Icon = "Timer", ParentId = 22, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 25, Name = "休假报表", Path = "/leave-report", Icon = "HolidayVillage", ParentId = 22, SortOrder = 3, IsVisible = true, Permission = null },
            new Menu { Id = 26, Name = "年假报表", Path = "/annual-leave-report", Icon = "BeachAccess", ParentId = 22, SortOrder = 4, IsVisible = true, Permission = null },

            // 日志管理 (Id 27-30)
            new Menu { Id = 27, Name = "日志管理", Path = null, Icon = "History", ParentId = null, SortOrder = 8, IsVisible = true, Permission = null },
            new Menu { Id = 28, Name = "登录日志", Path = "/login-log-report", Icon = "History", ParentId = 27, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 29, Name = "审计日志", Path = "/audit-log-report", Icon = "FindInPage", ParentId = 27, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 30, Name = "访客日志", Path = "/visitor-log-report", Icon = "Visibility", ParentId = 27, SortOrder = 3, IsVisible = true, Permission = null },

            // 影像转BIM (Id 31)
            new Menu { Id = 31, Name = "影像转BIM", Path = "/image-to-bim", Icon = "Insights", ParentId = null, SortOrder = 9, IsVisible = true, Permission = null },

            // 其他 (Id 32-36)
            new Menu { Id = 32, Name = "其他", Path = null, Icon = "Settings", ParentId = null, SortOrder = 10, IsVisible = true, Permission = null },
            new Menu { Id = 33, Name = "简介", Path = "/settings/introduction", Icon = "Info", ParentId = 32, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 34, Name = "常见问题", Path = "/settings/faq", Icon = "Help", ParentId = 32, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 35, Name = "聊天", Path = "/settings/chat", Icon = "Send", ParentId = 32, SortOrder = 3, IsVisible = true, Permission = null },
            new Menu { Id = 36, Name = "文件管理", Path = "/settings/files", Icon = "Storage", ParentId = 32, SortOrder = 4, IsVisible = true, Permission = null },

            // 设置 (Id 37-47)
            new Menu { Id = 37, Name = "设置", Path = null, Icon = "Settings", ParentId = null, SortOrder = 11, IsVisible = true, Permission = null },
            new Menu { Id = 38, Name = "简介", Path = "/settings/introduction", Icon = "Info", ParentId = 37, SortOrder = 1, IsVisible = true, Permission = null },
            new Menu { Id = 39, Name = "设置", Path = "/settings", Icon = "Settings", ParentId = 37, SortOrder = 2, IsVisible = true, Permission = null },
            new Menu { Id = 40, Name = "背景设置", Path = "/settings/background", Icon = "Wallpaper", ParentId = 37, SortOrder = 3, IsVisible = true, Permission = null },
            new Menu { Id = 41, Name = "看板", Path = "/settings/dashboard", Icon = "DashboardOutlined", ParentId = 37, SortOrder = 4, IsVisible = true, Permission = null },
            new Menu { Id = 42, Name = "项目", Path = "/settings/projects", Icon = "Folder", ParentId = 37, SortOrder = 5, IsVisible = true, Permission = null },
            new Menu { Id = 43, Name = "常见问题", Path = "/settings/faq", Icon = "Help", ParentId = 37, SortOrder = 6, IsVisible = true, Permission = null },
            new Menu { Id = 44, Name = "个人资料", Path = "/settings/users", Icon = "People", ParentId = 37, SortOrder = 7, IsVisible = true, Permission = null },
            new Menu { Id = 45, Name = "认证", Path = "/settings/auth", Icon = "Security", ParentId = 37, SortOrder = 8, IsVisible = true, Permission = null },
            new Menu { Id = 46, Name = "文件管理", Path = "/settings/files", Icon = "Storage", ParentId = 37, SortOrder = 9, IsVisible = true, Permission = null },
            new Menu { Id = 47, Name = "聊天", Path = "/settings/chat", Icon = "Send", ParentId = 37, SortOrder = 10, IsVisible = true, Permission = null }
        );

        // Seed departments (10个部门)
        modelBuilder.Entity<Department>().HasData(
            new Department { Id = 1, Name = "总公司", Code = "HQ", ParentId = null, SortOrder = 1, Leader = "张总", Phone = "010-88888888", Email = "zhangzong@company.com", Address = "北京市朝阳区建国路88号", IsActive = true },
            new Department { Id = 2, Name = "技术部", Code = "TECH", ParentId = 1, SortOrder = 1, Leader = "李经理", Phone = "010-88888801", Email = "tech@company.com", Address = "北京市朝阳区建国路88号A座3层", IsActive = true },
            new Department { Id = 3, Name = "产品部", Code = "PROD", ParentId = 1, SortOrder = 2, Leader = "王经理", Phone = "010-88888802", Email = "product@company.com", Address = "北京市朝阳区建国路88号A座5层", IsActive = true },
            new Department { Id = 4, Name = "市场部", Code = "MKT", ParentId = 1, SortOrder = 3, Leader = "赵经理", Phone = "010-88888803", Email = "marketing@company.com", Address = "北京市朝阳区建国路88号B座2层", IsActive = true },
            new Department { Id = 5, Name = "销售部", Code = "SALES", ParentId = 1, SortOrder = 4, Leader = "孙经理", Phone = "010-88888804", Email = "sales@company.com", Address = "北京市朝阳区建国路88号B座3层", IsActive = true },
            new Department { Id = 6, Name = "人事部", Code = "HR", ParentId = 1, SortOrder = 5, Leader = "周经理", Phone = "010-88888805", Email = "hr@company.com", Address = "北京市朝阳区建国路88号A座8层", IsActive = true },
            new Department { Id = 7, Name = "财务部", Code = "FIN", ParentId = 1, SortOrder = 6, Leader = "吴经理", Phone = "010-88888806", Email = "finance@company.com", Address = "北京市朝阳区建国路88号A座9层", IsActive = true },
            new Department { Id = 8, Name = "研发一组", Code = "DEV1", ParentId = 2, SortOrder = 1, Leader = "郑组长", Phone = "010-88888011", Email = "dev1@company.com", Address = "北京市朝阳区建国路88号A座301室", IsActive = true },
            new Department { Id = 9, Name = "研发二组", Code = "DEV2", ParentId = 2, SortOrder = 2, Leader = "陈组长", Phone = "010-88888012", Email = "dev2@company.com", Address = "北京市朝阳区建国路88号A座302室", IsActive = true },
            new Department { Id = 10, Name = "运维部", Code = "OPS", ParentId = 2, SortOrder = 3, Leader = "刘组长", Phone = "010-88888013", Email = "ops@company.com", Address = "北京市朝阳区建国路88号A座4层", IsActive = true }
        );
    }
}
