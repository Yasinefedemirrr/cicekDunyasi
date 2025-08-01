namespace ÇiçekDünyası.Domain.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        
        public int OrderId { get; set; }
        
        public int FlowerId { get; set; }
        
        public string FlowerName { get; set; } = string.Empty;
        
        public int Quantity { get; set; }
        
        public decimal UnitPrice { get; set; }
        
        public decimal TotalPrice { get; set; }
        
        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual Flower Flower { get; set; } = null!;
    }
} 