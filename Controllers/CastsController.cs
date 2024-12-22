using HW1.BL;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CastsController : ControllerBase
    {
        // GET: api/<CastsController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                List<Cast> casts = Cast.ReadCast(); // Call the static method from the BL
                return (casts == null || !casts.Any()) ? NotFound("No casts found.") : Ok(casts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET api/<CastsController>/5
        //[HttpGet("{id}")]
        //public Cast Get(string id)
        //{
        //    return Cast.ReadOneCast(id);
        //}

        // POST api/<CastsController>
        [HttpPost]
        public bool Post([FromBody] Cast m)
        {
            try
            {
                return m.InsertCast();
            }
            catch (Exception)
            {
                return false;
            }
        }

    }
}
