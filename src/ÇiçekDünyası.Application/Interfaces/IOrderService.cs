using ÇiçekDünyası.Application.DTOs;

namespace ÇiçekDünyası.Application.Interfaces
{
    public interface IOrderService
    {
        Task<OrderDto?> GetByIdAsync(int id);
        Task<IEnumerable<OrderDto>> GetAllAsync();
        Task<IEnumerable<OrderDto>> GetByUserIdAsync(int userId);
        Task<IEnumerable<OrderDto>> GetByStatusAsync(string status);
        Task<OrderDto> CreateAsync(int userId, CreateOrderDto createOrderDto);
        Task<OrderDto> UpdateAsync(int id, UpdateOrderDto updateOrderDto);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<OrderDto> UpdateStatusAsync(int id, string status);
    }
} 