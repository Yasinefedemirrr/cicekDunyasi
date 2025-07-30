using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ÇiçekDünyası.Application.DTOs;
using ÇiçekDünyası.Application.Interfaces;

namespace ÇiçekDünyası.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlowersController : ControllerBase
    {
        private readonly IFlowerService _flowerService;

        public FlowersController(IFlowerService flowerService)
        {
            _flowerService = flowerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FlowerDto>>> GetFlowers()
        {
            var flowers = await _flowerService.GetAvailableAsync();
            return Ok(flowers);
        }

        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<FlowerDto>>> GetAllFlowers()
        {
            var flowers = await _flowerService.GetAllAsync();
            return Ok(flowers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FlowerDto>> GetFlower(int id)
        {
            var flower = await _flowerService.GetByIdAsync(id);
            if (flower == null)
            {
                return NotFound();
            }
            return Ok(flower);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<FlowerDto>> CreateFlower([FromBody] CreateFlowerDto createFlowerDto)
        {
            try
            {
                if (createFlowerDto == null)
                {
                    return BadRequest(new { message = "Ürün verisi boş olamaz." });
                }

                if (string.IsNullOrWhiteSpace(createFlowerDto.Name))
                {
                    return BadRequest(new { message = "Ürün adı boş olamaz." });
                }

                if (createFlowerDto.Price <= 0)
                {
                    return BadRequest(new { message = "Fiyat 0'dan büyük olmalıdır." });
                }

                if (createFlowerDto.StockQuantity < 0)
                {
                    return BadRequest(new { message = "Stok miktarı negatif olamaz." });
                }

                var result = await _flowerService.CreateAsync(createFlowerDto);
                return CreatedAtAction(nameof(GetFlower), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<FlowerDto>> UpdateFlower(int id, [FromBody] UpdateFlowerDto updateFlowerDto)
        {
            try
            {
                var result = await _flowerService.UpdateAsync(id, updateFlowerDto);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteFlower(int id)
        {
            try
            {
                await _flowerService.DeleteAsync(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
} 