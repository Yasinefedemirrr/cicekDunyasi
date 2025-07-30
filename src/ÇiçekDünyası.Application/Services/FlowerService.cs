using ÇiçekDünyası.Application.DTOs;
using ÇiçekDünyası.Application.Interfaces;
using ÇiçekDünyası.Domain.Entities;
using ÇiçekDünyası.Domain.Interfaces;

namespace ÇiçekDünyası.Application.Services
{
    public class FlowerService : IFlowerService
    {
        private readonly IFlowerRepository _flowerRepository;

        public FlowerService(IFlowerRepository flowerRepository)
        {
            _flowerRepository = flowerRepository;
        }

        public async Task<FlowerDto?> GetByIdAsync(int id)
        {
            var flower = await _flowerRepository.GetByIdAsync(id);
            return flower != null ? MapToDto(flower) : null;
        }

        public async Task<IEnumerable<FlowerDto>> GetAllAsync()
        {
            var flowers = await _flowerRepository.GetAllAsync();
            return flowers.Select(MapToDto);
        }

        public async Task<IEnumerable<FlowerDto>> GetAvailableAsync()
        {
            var flowers = await _flowerRepository.GetAvailableAsync();
            return flowers.Select(MapToDto);
        }

        public async Task<FlowerDto> CreateAsync(CreateFlowerDto createFlowerDto)
        {
            var flower = new Flower
            {
                Name = createFlowerDto.Name,
                Description = createFlowerDto.Description,
                Price = createFlowerDto.Price,
                ImageUrl = createFlowerDto.ImageUrl,
                StockQuantity = createFlowerDto.StockQuantity,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            var createdFlower = await _flowerRepository.AddAsync(flower);
            return MapToDto(createdFlower);
        }

        public async Task<FlowerDto> UpdateAsync(int id, UpdateFlowerDto updateFlowerDto)
        {
            var flower = await _flowerRepository.GetByIdAsync(id);
            if (flower == null)
            {
                throw new InvalidOperationException("Çiçek bulunamadı.");
            }

            flower.Name = updateFlowerDto.Name;
            flower.Description = updateFlowerDto.Description;
            flower.Price = updateFlowerDto.Price;
            flower.ImageUrl = updateFlowerDto.ImageUrl;
            flower.StockQuantity = updateFlowerDto.StockQuantity;
            flower.IsAvailable = updateFlowerDto.IsAvailable;
            flower.UpdatedAt = DateTime.UtcNow;

            var updatedFlower = await _flowerRepository.UpdateAsync(flower);
            return MapToDto(updatedFlower);
        }

        public async Task DeleteAsync(int id)
        {
            if (!await _flowerRepository.ExistsAsync(id))
            {
                throw new InvalidOperationException("Çiçek bulunamadı.");
            }

            await _flowerRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _flowerRepository.ExistsAsync(id);
        }

        public async Task UpdateStockAsync(int id, int quantity)
        {
            if (!await _flowerRepository.ExistsAsync(id))
            {
                throw new InvalidOperationException("Çiçek bulunamadı.");
            }

            await _flowerRepository.UpdateStockAsync(id, quantity);
        }

        private static FlowerDto MapToDto(Flower flower)
        {
            return new FlowerDto
            {
                Id = flower.Id,
                Name = flower.Name,
                Description = flower.Description,
                Price = flower.Price,
                ImageUrl = flower.ImageUrl,
                StockQuantity = flower.StockQuantity,
                IsAvailable = flower.IsAvailable,
                CreatedAt = flower.CreatedAt,
                UpdatedAt = flower.UpdatedAt
            };
        }
    }
} 