namespace CesiumApi.Models;

public class Notification
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Sender { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
    public bool Read { get; set; }
    public string Icon { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public int? UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
