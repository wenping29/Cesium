namespace CesiumApi.Models;

public class LeaveRecord
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string LeaveType { get; set; } = "personal"; // personal, sick, maternity, etc.
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Days { get; set; }
    public decimal Hours { get; set; }
    public string Status { get; set; } = "pending"; // pending, approved, rejected
    public string? Reason { get; set; }
    public string? Remark { get; set; }
    public int? ApproverId { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User? User { get; set; }
    public User? Approver { get; set; }
}
