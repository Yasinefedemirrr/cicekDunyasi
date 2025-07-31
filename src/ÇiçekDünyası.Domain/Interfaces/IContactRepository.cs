using ÇiçekDünyası.Domain.Entities;

namespace ÇiçekDünyası.Domain.Interfaces
{
    public interface IContactRepository
    {
        Task<IEnumerable<Contact>> GetAllAsync();
        Task<Contact?> GetByIdAsync(int id);
        Task<Contact> CreateAsync(Contact contact);
        Task<Contact> UpdateAsync(Contact contact);
        Task DeleteAsync(int id);
    }
} 