var app = new Vue({
    el: "#app",
    data: {
        showList: true,
        showProduct: false,
        showStock: false,
        loading: false,
        objectIndex: 0,
        
        products: [],
        productModel: {
            id: 0,
            name: "",
            description: "",
            value: 0,
            stock: [],
            image: ""
        },
        file: null,

        selectedStock: null,
        
        stock: [],
        stockModel: {
            productId: 0,
            description: "",
            qty: ""
        },
    },
    mounted(){
        this.getProducts();
    },
    methods: {
        getProducts(){
            this.loading = true;
            axios.get('/Products')
                .then(res => {
                    this.products = res.data;
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });
            this.toggleList();
        },
        getProduct(id, index){
            this.loading = true;
            this.objectIndex = index;
            
            axios.get('/Products/' + id)
                .then(res => {
                    this.productModel = {
                        id: res.data.id,
                        name: res.data.name,
                        description: res.data.description,
                        value: res.data.value,
                        image: res.data.image
                    };
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });
            this.toggleProduct();
        },
        newProduct() {
            this.productModel = {
              id: 0,
              name: "",
              description: "",
              value: 0,
              stock: []
            }

            this.toggleProduct();
        },
        getFile(event) {
            this.file = event.target.files[0];
        },
        createProduct(){
            var formData = new FormData();

            formData.append("image", this.file);
            formData.append("id", this.productModel.id);
            formData.append("name", this.productModel.name);
            formData.append("description", this.productModel.description);
            formData.append("value", this.productModel.value);

            this.loading = true;
            axios.post('/Products', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    console.log(res.data);
                    this.products.push(res.data);
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });
            
            this.toggleList();
        },
        updateProduct(){
            var formData = new FormData();

            if (this.file != null || this.file == "") {
                formData.append("imageFile", this.file);
            }

            formData.append("id", this.productModel.id);
            formData.append("name", this.productModel.name);
            formData.append("description", this.productModel.description);
            formData.append("value", this.productModel.value);
            formData.append("image", this.productModel.image);

            this.loading = true;
            axios.put('/Products', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(res => {
                    console.log(res.data);
                    this.products.splice(this.objectIndex, 1, res.data);
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });

            this.toggleList();
        },
        deleteProduct(id, image){
            this.loading = true;
            axios.delete('/products/' + id + '/' + image)
                .then(res => {
                    console.log(res.data);
                    this.products.splice(this.objectIndex, 1);
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });

            this.toggleList();
        },

        /* STOCK METHODS */

        getStock(id) {
            this.loading = true;

            axios.get('/stocks/' + id)
                .then(res => {
                    this.stock = res.data;
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });

            this.toggleStock();
        },
        addStock() {
            this.stock.push({
                productId: this.productModel.id,
                description: this.stockModel.description,
                qty: this.stockModel.qty
            });

            console.log(this.stock);
    
            this.stockModel = {
                productId: 0,
                description: "",
                qty: ""
            };
        },
        updateStock() {
            this.loading = true;
            axios.put('/stocks', {
                stock: this.stock.map(x => {
                    return {
                        id: x.id,
                        description: x.description,
                        qty: x.qty,
                        productId: this.productModel.id
                    };
                })
            })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });
            
            this.toggleProduct();
        },
        deleteStock(id, index) {
            this.loading = true;
            axios.delete('/stocks/' + id)
                .then(res => {
                    console.log(res);
                    this.stock.splice(index, 1);
                })
                .catch(err => {
                    console.log(err);
                })
                .then(() => {
                    this.loading = false;
                });
        },

        toggleList(){
            this.showStock = false;
            this.showProduct = false;
            this.showList = true;
        },

        toggleProduct(){
            this.showStock = false;
            this.showList = false;
            this.showProduct = true;
        },

        toggleStock(){
            this.showProduct = false;
            this.showList = false;
            this.showStock = true;
        },
    },
    computed: {
    }
})