using System.ComponentModel.DataAnnotations;

namespace ÇiçekDünyası.Domain.Entities
{
    public class Contact
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsRead { get; set; } = false;
    }
} 