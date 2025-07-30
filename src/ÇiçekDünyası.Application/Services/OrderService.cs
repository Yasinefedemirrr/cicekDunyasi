using ÇiçekDünyası.Application.DTOs;
using ÇiçekDünyası.Application.Interfaces;
using ÇiçekDünyası.Domain.Entities;
using ÇiçekDünyası.Domain.Interfaces;

namespace ÇiçekDünyası.Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IFlowerRepository _flowerRepository;

        public OrderService(IOrderRepository orderRepository, IFlowerRepository flowerRepository)
        {
            _orderRepository = orderRepository;
            _flowerRepository = flowerRepository;
        }

        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order != null ? MapToDto(order) : null;
        }

        public async Task<IEnumerable<OrderDto>> GetAllAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDto>> GetByUserIdAsync(int userId)
        {
            var orders = await _orderRepository.GetByUserIdAsync(userId);
            return orders.Select(MapToDto);
        }

        public async Task<IEnumerable<OrderDto>> GetByStatusAsync(string status)
        {
            var orders = await _orderRepository.GetByStatusAsync(status);
            return orders.Select(MapToDto);
        }

        public async Task<OrderDto> CreateAsync(int userId, CreateOrderDto createOrderDto)
        {
            var order = new Order
            {
                UserId = userId,
                CustomerName = createOrderDto.CustomerName,
                DeliveryAddress = createOrderDto.DeliveryAddress,
                PhoneNumber = createOrderDto.PhoneNumber,
                Notes = createOrderDto.Notes,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = 0
            };

            var orderItems = new List<OrderItem>();
            decimal totalAmount = 0;

            foreach (var itemDto in createOrderDto.OrderItems)
            {
                var flower = await _flowerRepository.GetByIdAsync(itemDto.FlowerId);
                if (flower == null)
                {
                    throw new InvalidOperationException($"Çiçek bulunamadı: {itemDto.FlowerId}");
                }

                if (!flower.IsAvailable || flower.StockQuantity < itemDto.Quantity)
                {
                    throw new InvalidOperationException($"Yetersiz stok: {flower.Name}");
                }

                var orderItem = new OrderItem
                {
                    FlowerId = itemDto.FlowerId,
                    Quantity = itemDto.Quantity,
                    UnitPrice = flower.Price,
                    TotalPrice = flower.Price * itemDto.Quantity
                };

                orderItems.Add(orderItem);
                totalAmount += orderItem.TotalPrice;

                // Update stock
                await _flowerRepository.UpdateStockAsync(itemDto.FlowerId, -itemDto.Quantity);
            }

            order.TotalAmount = totalAmount;
            order.OrderItems = orderItems;

            var createdOrder = await _orderRepository.AddAsync(order);
            return MapToDto(createdOrder);
        }

        public async Task<OrderDto> UpdateAsync(int id, UpdateOrderDto updateOrderDto)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
            {
                throw new InvalidOperationException("Sipariş bulunamadı.");
            }

            order.Status = updateOrderDto.Status;
            order.DeliveryDate = updateOrderDto.DeliveryDate;
            order.Notes = updateOrderDto.Notes;

            var updatedOrder = await _orderRepository.UpdateAsync(order);
            return MapToDto(updatedOrder);
        }

        public async Task DeleteAsync(int id)
        {
            if (!await _orderRepository.ExistsAsync(id))
            {
                throw new InvalidOperationException("Sipariş bulunamadı.");
            }

            await _orderRepository.DeleteAsync(id);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _orderRepository.ExistsAsync(id);
        }

        public async Task<OrderDto> UpdateStatusAsync(int id, string status)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
            {
                throw new InvalidOperationException("Sipariş bulunamadı.");
            }

            order.Status = status;
            await _orderRepository.UpdateAsync(order);
            
            return MapToDto(order);
        }

        private static OrderDto MapToDto(Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                CustomerName = order.CustomerName,
                DeliveryAddress = order.DeliveryAddress,
                PhoneNumber = order.PhoneNumber,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                OrderDate = order.OrderDate,
                DeliveryDate = order.DeliveryDate,
                Notes = order.Notes,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    FlowerId = oi.FlowerId,
                    FlowerName = oi.Flower.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };
        }
    }
} 