namespace CesiumApi.Models;

public class WorkHourRecord
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DateTime Date { get; set; }
    public decimal RegularHours { get; set; }
    public decimal OvertimeHours { get; set; }
    public decimal WeekendHours { get; set; }
    public decimal HolidayHours { get; set; }
    public string? ProjectName { get; set; }
    public string? TaskDescription { get; set; }
    public string? Remark { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User? User { get; set; }
}
