using HW1.BL;
using Microsoft.AspNetCore.Mvc;

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // POST: api/Users/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            if (user.UserName == null || user.Password == null)
            {
                return BadRequest(new { message = "Invalid input data" });
            }
            try
            {
               // User user = new User { UserName = loginRequest.UserName, Password = loginRequest.Password };

                int isSuccess = user.LoginUser();
                user.Id = isSuccess;
                return isSuccess == -1
                    ? Unauthorized(new { message = "Invalid email or password" })
                    : Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            try
            {
                bool isSuccess = user.InsertUser();
                return isSuccess
                    ? Ok(new { message = "Registration successful" })
                    : Unauthorized(new { message = "Registration failed. User may already exist." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }
    }
}
