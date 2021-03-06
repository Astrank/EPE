using System.Collections.Generic;
using System.Threading.Tasks;
using EPE.Domain.Infrastructure;

namespace EPE.Application.ProductsAdmin
{
    [Service]
    public class DeleteProduct
    {
        private readonly IProductManager _productManager;

        public DeleteProduct(IProductManager productManager)
        {
            _productManager = productManager;
        }

        public Task<List<string>> Do(int id)
        {
            return _productManager.DeleteProduct(id);
        }
    }
}