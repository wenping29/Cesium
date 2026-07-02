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
            .WithMany(r => r.RoleMenus ?? new List<RoleMenu>())
            .HasForeignKey(rm => rm.RoleId);

        modelBuilder.Entity<RoleMenu>()
            .HasOne(rm => rm.Menu)
            .WithMany(m => m.RoleMenus ?? new List<RoleMenu>())
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
            new Menu { Id = 1, Name = "权限管理", Path = null, Icon = "Settings", ParentId = null, SortOrder = 1, IsVisible = true, Permission = "permission" },
            new Menu { Id = 2, Name = "用户管理", Path = "/users", Icon = "People", ParentId = 1, SortOrder = 1, IsVisible = true, Permission = "permission:users" },
            new Menu { Id = 3, Name = "角色管理", Path = "/roles", Icon = "Shield", ParentId = 1, SortOrder = 2, IsVisible = true, Permission = "permission:roles" },
            new Menu { Id = 4, Name = "菜单管理", Path = "/menus", Icon = "Menu", ParentId = 1, SortOrder = 3, IsVisible = true, Permission = "permission:menus" },
            new Menu { Id = 5, Name = "部门管理", Path = "/departments", Icon = "Business", ParentId = 1, SortOrder = 4, IsVisible = true, Permission = "permission:departments" }
        );
    }
}
