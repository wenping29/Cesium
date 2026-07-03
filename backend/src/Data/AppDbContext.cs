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

        // Seed menus
        modelBuilder.Entity<Menu>().HasData(
            new Menu { Id = 1, Name = "首页", Path = null, Icon = "Home", ParentId = null, SortOrder = 0, IsVisible = true, Permission = "home" },
            new Menu { Id = 2, Name = "工作台", Path = "/workbench", Icon = "Dashboard", ParentId = 1, SortOrder = 1, IsVisible = true, Permission = "home:workbench" },
            new Menu { Id = 3, Name = "分析页", Path = "/analysis", Icon = "Analytics", ParentId = 1, SortOrder = 2, IsVisible = true, Permission = "home:analysis" },
            new Menu { Id = 4, Name = "权限管理", Path = null, Icon = "Settings", ParentId = null, SortOrder = 1, IsVisible = true, Permission = "permission" },
            new Menu { Id = 5, Name = "用户管理", Path = "/user-management", Icon = "People", ParentId = 4, SortOrder = 1, IsVisible = true, Permission = "permission:users" },
            new Menu { Id = 6, Name = "角色管理", Path = "/role-management", Icon = "Shield", ParentId = 4, SortOrder = 2, IsVisible = true, Permission = "permission:roles" },
            new Menu { Id = 7, Name = "菜单管理", Path = "/menu-management", Icon = "Menu", ParentId = 4, SortOrder = 3, IsVisible = true, Permission = "permission:menus" },
            new Menu { Id = 8, Name = "部门管理", Path = "/department-management", Icon = "Business", ParentId = 4, SortOrder = 4, IsVisible = true, Permission = "permission:departments" }
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

        // Seed attendance menus (考勤菜单)
        modelBuilder.Entity<Menu>().HasData(
            new Menu { Id = 9, Name = "考勤管理", Path = null, Icon = "Schedule", ParentId = null, SortOrder = 2, IsVisible = true, Permission = "attendance" },
            new Menu { Id = 10, Name = "打开报表", Path = "/attendance-report", Icon = "Description", ParentId = 9, SortOrder = 1, IsVisible = true, Permission = "attendance:report" },
            new Menu { Id = 11, Name = "工时报表", Path = "/workhour-report", Icon = "Timer", ParentId = 9, SortOrder = 2, IsVisible = true, Permission = "attendance:workhour" },
            new Menu { Id = 12, Name = "休假报表", Path = "/leave-report", Icon = "HolidayVillage", ParentId = 9, SortOrder = 3, IsVisible = true, Permission = "attendance:leave" },
            new Menu { Id = 13, Name = "年假报表", Path = "/annual-leave-report", Icon = "BeachAccess", ParentId = 9, SortOrder = 4, IsVisible = true, Permission = "attendance:annual" }
        );
    }
}
