using System.Security.Claims;
using System.Threading.Tasks;
using EPE.UI.ViewModels.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace EPE.UI.Controllers
{
    [Route("[controller]")]
    [Authorize(Policy = "Admin")]
    public class UsersController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        public UsersController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<IActionResult> CreateUser([FromBody] CreateUserViewModel vm)
        {
            var managerUser = new IdentityUser
            {
                UserName = vm.Username,
            };

            await _userManager.CreateAsync(managerUser, vm.Password);

            var managerClaim = new Claim("Role", "Manager");

            await _userManager.AddClaimAsync(managerUser, managerClaim);

            return Ok();
        }
    }
}