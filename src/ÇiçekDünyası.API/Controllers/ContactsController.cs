using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ÇiçekDünyası.Application.DTOs;
using ÇiçekDünyası.Application.Interfaces;

namespace ÇiçekDünyası.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ContactDto>>> GetAllContacts()
        {
            var contacts = await _contactService.GetAllAsync();
            return Ok(contacts);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactDto>> GetContact(int id)
        {
            var contact = await _contactService.GetByIdAsync(id);
            if (contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<ContactDto>> CreateContact([FromBody] CreateContactDto createContactDto)
        {
            try
            {
                var result = await _contactService.CreateAsync(createContactDto);
                return CreatedAtAction(nameof(GetContact), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactDto>> UpdateContact(int id, [FromBody] UpdateContactDto updateContactDto)
        {
            try
            {
                var result = await _contactService.UpdateAsync(id, updateContactDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteContact(int id)
        {
            try
            {
                await _contactService.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ContactDto>> MarkAsRead(int id)
        {
            try
            {
                var result = await _contactService.MarkAsReadAsync(id);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 