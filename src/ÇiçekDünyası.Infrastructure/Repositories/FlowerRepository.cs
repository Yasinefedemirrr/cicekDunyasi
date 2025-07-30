using Microsoft.EntityFrameworkCore;
using ÇiçekDünyası.Domain.Entities;
using ÇiçekDünyası.Domain.Interfaces;
using ÇiçekDünyası.Infrastructure.Data;

namespace ÇiçekDünyası.Infrastructure.Repositories
{
    public class FlowerRepository : IFlowerRepository
    {
        private readonly ApplicationDbContext _context;

        public FlowerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Flower?> GetByIdAsync(int id)
        {
            return await _context.Flowers.FindAsync(id);
        }

        public async Task<IEnumerable<Flower>> GetAllAsync()
        {
            return await _context.Flowers.ToListAsync();
        }

        public async Task<IEnumerable<Flower>> GetAvailableAsync()
        {
            return await _context.Flowers.Where(f => f.IsAvailable && f.StockQuantity > 0).ToListAsync();
        }

        public async Task<Flower> AddAsync(Flower flower)
        {
            _context.Flowers.Add(flower);
            await _context.SaveChangesAsync();
            return flower;
        }

        public async Task<Flower> UpdateAsync(Flower flower)
        {
            flower.UpdatedAt = DateTime.UtcNow;
            _context.Flowers.Update(flower);
            await _context.SaveChangesAsync();
            return flower;
        }

        public async Task DeleteAsync(int id)
        {
            var flower = await _context.Flowers.FindAsync(id);
            if (flower != null)
            {
                _context.Flowers.Remove(flower);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Flowers.AnyAsync(f => f.Id == id);
        }

        public async Task UpdateStockAsync(int id, int quantity)
        {
            var flower = await _context.Flowers.FindAsync(id);
            if (flower != null)
            {
                flower.StockQuantity += quantity;
                flower.UpdatedAt = DateTime.UtcNow;
                if (flower.StockQuantity <= 0)
                {
                    flower.IsAvailable = false;
                }
                await _context.SaveChangesAsync();
            }
        }
    }
} 