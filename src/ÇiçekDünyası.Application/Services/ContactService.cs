using ÇiçekDünyası.Application.DTOs;
using ÇiçekDünyası.Application.Interfaces;
using ÇiçekDünyası.Domain.Interfaces;
using ÇiçekDünyası.Domain.Entities;

namespace ÇiçekDünyası.Application.Services
{
    public class ContactService : IContactService
    {
        private readonly IContactRepository _contactRepository;

        public ContactService(IContactRepository contactRepository)
        {
            _contactRepository = contactRepository;
        }

        public async Task<IEnumerable<ContactDto>> GetAllAsync()
        {
            var contacts = await _contactRepository.GetAllAsync();
            return contacts.Select(MapToDto);
        }

        public async Task<ContactDto?> GetByIdAsync(int id)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            return contact != null ? MapToDto(contact) : null;
        }

        public async Task<ContactDto> CreateAsync(CreateContactDto createContactDto)
        {
            var contact = new Contact
            {
                FullName = createContactDto.FullName,
                PhoneNumber = createContactDto.PhoneNumber,
                Email = createContactDto.Email,
                Notes = createContactDto.Notes,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            var result = await _contactRepository.CreateAsync(contact);
            return MapToDto(result);
        }

        public async Task<ContactDto> UpdateAsync(int id, UpdateContactDto updateContactDto)
        {
            var existingContact = await _contactRepository.GetByIdAsync(id);
            if (existingContact == null)
            {
                throw new InvalidOperationException("Contact not found");
            }

            existingContact.FullName = updateContactDto.FullName;
            existingContact.PhoneNumber = updateContactDto.PhoneNumber;
            existingContact.Email = updateContactDto.Email;
            existingContact.Notes = updateContactDto.Notes;
            existingContact.IsRead = updateContactDto.IsRead;

            var result = await _contactRepository.UpdateAsync(existingContact);
            return MapToDto(result);
        }

        public async Task DeleteAsync(int id)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            if (contact == null)
            {
                throw new InvalidOperationException("Contact not found");
            }

            await _contactRepository.DeleteAsync(id);
        }

        public async Task<ContactDto> MarkAsReadAsync(int id)
        {
            var contact = await _contactRepository.GetByIdAsync(id);
            if (contact == null)
            {
                throw new InvalidOperationException("Contact not found");
            }

            contact.IsRead = true;
            var result = await _contactRepository.UpdateAsync(contact);
            return MapToDto(result);
        }

        private static ContactDto MapToDto(Contact contact)
        {
            return new ContactDto
            {
                Id = contact.Id,
                FullName = contact.FullName,
                PhoneNumber = contact.PhoneNumber,
                Email = contact.Email,
                Notes = contact.Notes,
                CreatedAt = contact.CreatedAt,
                IsRead = contact.IsRead
            };
        }
    }
} 