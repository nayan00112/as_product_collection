/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

const testing = publicWidget.Widget.extend({
    selector: '.s_categorized_product',
    start: function () {
        this.orm = this.bindService("orm");

        if (this.el.firstElementChild.tagName == 'P') {
            this.fetchData(this.el.firstElementChild.innerHTML, 
            this.el.firstElementChild.nextElementSibling.innerHTML);
        }  
        this.$el.on('click', '.customCartBtn', this._addProductToCart.bind(this));
    },
    _addProductToCart(event){
        event.preventDefault();
        const productProductId =  event.currentTarget.dataset.productProductId;
        
        const formData = new FormData();
        formData.append('product_id', productProductId);
        formData.append('add_qty', 1);
        formData.append('csrf_token', odoo.csrf_token);

        return fetch('/shop/cart/update', {
            method: 'POST',
            body: formData,
        })
        .then(response => {
            // Redirect to the returned URL or reload the page

            // if (response.redirected) {
            //     window.location.href = response.url;
            // } else {
            //     window.location.reload();
            // }
            window.location.reload();
        })
        .catch(error => {
            console.error('Failed to add product to cart:', error);
        });
    },

    async fetchData(uid, websiteID) {
        const productdata = await this.orm.read(
            'as.product.collection', 
            [Number(uid)], 
            ['name', 'product_collection_ids']
        )

        const productIds = productdata[0].product_collection_ids;
        const products = await this.orm.searchRead(
            "product.template",
            [["id", "in", productIds]],
            ["name", "list_price", "image_1920", 'website_id', "product_variant_id"]
        );
        
        const data = {
            'name': productdata[0].name,
            'products': products,
        }

        let html = `
        <section class="s_categorized_product py-4 js_sale">
        <div class="o_product_feature_panel d-none"></div>
            <p style='display:none;'>${uid}</p>
            <p style='display:none;'>${websiteID}</p>
            <div class="o_product_feature_panel d-none"></div>
            <div class='container'>
                <h3 class='display-6 text-center mb-4'>${data.name}</h3>
                <div class='row g-3 justify-content-center'>
        `;

        data.products.forEach(product => {
            if (product.website_id == false || product.website_id[0] == websiteID) {
                html += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="oe_product_cart card shadow-sm h-100 border-0 rounded overflow-hidden">
                        <div class="position-relative">
                            <div class="p-3" style="cursor: pointer;">
                                <img src='/web/image/product.template/${product.id}/image_256' class='card-img-top rounded' alt='${product.name}' onclick='window.location.href="/shop/${product.id}"'>
                                <div class="card-body d-flex flex-column text-center" onclick='window.location.href="/shop/${product.id}"'>
                                    <h5 class="card-title text-truncate fw-bold text-primary">${product.name}</h5>
                                    <p class="card-text text-muted fs-5">${product.list_price}</p>
                                </div>
                                <div class="mt-auto p-3 text-center">
                                    <button type="submit" class="btn btn-primary w-100 js_add_cart customCartBtn" data-product-template-id="${product.id}" data-product-product-id="${product.product_variant_id[0]}">
                                        <i class="fa fa-shopping-cart me-2"></i> Add to Cart
                                    </button>
                                    <div class="d-flex justify-content-between mt-2">   
                                        <button type="button" class="btn btn-outline-secondary o_add_compare d-none d-md-inline-block"
                                            data-product-product-id="${product.product_variant_id[0]}" data-action="o_comparelist"
                                            aria-label="Compare" title="Compare">
                                            <i class="fa fa-exchange"></i> Compare
                                        </button>
                                        <button type="button" class="btn btn-outline-danger o_add_wishlist" data-product-template-id="${product.id}" data-product-product-id="${product.product_variant_id[0]}" data-action="o_wishlist">
                                            <i class="fa fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;
            }
        });

        html += `
                </div>
            </div>
        </section>
        `
        this.el.outerHTML = html
    },
});

publicWidget.registry.product_category = testing;

export default testing;