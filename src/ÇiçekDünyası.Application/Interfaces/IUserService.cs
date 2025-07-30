using ÇiçekDünyası.Application.DTOs;

namespace ÇiçekDünyası.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserDto?> GetByIdAsync(int id);
        Task<IEnumerable<UserDto>> GetAllAsync();
        Task<UserDto> CreateAsync(CreateUserDto createUserDto);
        Task<UserDto> UpdateAsync(int id, UpdateUserDto updateUserDto);
        Task DeleteAsync(int id);
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        Task<bool> ExistsAsync(int id);
    }
} 