using ÇiçekDünyası.Application.DTOs;

namespace ÇiçekDünyası.Application.Interfaces
{
    public interface IContactService
    {
        Task<IEnumerable<ContactDto>> GetAllAsync();
        Task<ContactDto?> GetByIdAsync(int id);
        Task<ContactDto> CreateAsync(CreateContactDto createContactDto);
        Task<ContactDto> UpdateAsync(int id, UpdateContactDto updateContactDto);
        Task DeleteAsync(int id);
        Task<ContactDto> MarkAsReadAsync(int id);
    }
} 