namespace CesiumApi.Models;

public class Department
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public int? ParentId { get; set; }
    public int SortOrder { get; set; } = 0;
    public string? Leader { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Department? Parent { get; set; }
    public ICollection<Department> Children { get; set; } = new List<Department>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
