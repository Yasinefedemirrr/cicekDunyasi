using ÇiçekDünyası.Application.DTOs;

namespace ÇiçekDünyası.Application.Interfaces
{
    public interface IFlowerService
    {
        Task<FlowerDto?> GetByIdAsync(int id);
        Task<IEnumerable<FlowerDto>> GetAllAsync();
        Task<IEnumerable<FlowerDto>> GetAvailableAsync();
        Task<FlowerDto> CreateAsync(CreateFlowerDto createFlowerDto);
        Task<FlowerDto> UpdateAsync(int id, UpdateFlowerDto updateFlowerDto);
        Task<FlowerDto> UpdateStatusAsync(int id, bool isAvailable);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task UpdateStockAsync(int id, int quantity);
    }
} 