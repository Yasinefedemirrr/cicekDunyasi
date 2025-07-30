using ÇiçekDünyası.Domain.Entities;

namespace ÇiçekDünyası.Domain.Interfaces
{
    public interface IFlowerRepository
    {
        Task<Flower?> GetByIdAsync(int id);
        Task<IEnumerable<Flower>> GetAllAsync();
        Task<IEnumerable<Flower>> GetAvailableAsync();
        Task<Flower> AddAsync(Flower flower);
        Task<Flower> UpdateAsync(Flower flower);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task UpdateStockAsync(int id, int quantity);
    }
} 