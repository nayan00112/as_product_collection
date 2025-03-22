/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

const testing = publicWidget.Widget.extend({
    selector: '.s_categorized_product',
    start: function () {
        this.orm = this.bindService("orm");

        if (this.el.firstElementChild.tagName == 'P') {
            this.fetchData(this.el.firstElementChild.innerHTML, this.el.firstElementChild.nextElementSibling.innerHTML);
        }
        
        this.$el.on('click', '.add-to-wishlist', this._onAddToWishlist.bind(this));
    },

    async addtowishlist(productID, websiteID){
        const wishlist_id = await this.orm.create("product.wishlist", [{
            active: true,
            product_id: productID,
            website_id: websiteID,
        }]);
        console.log('add to wishlist product id:', productID, ' website id:', websiteID, ' Wishlist id: ', wishlist_id);   
    },

    _onAddToWishlist: function (event) {
        event.preventDefault();
        const productID = event.currentTarget.dataset.productId;
        const websiteID = event.currentTarget.dataset.websiteId;
    
        this.addtowishlist(productID, websiteID);
    },

    async fetchData(uid, websiteID) {
        const productdata = await this.orm.read('as.product.collection', [Number(uid)], ['name', 'product_collection_ids'])
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
        <section class="s_categorized_product">
        <p style='display:none;'>${uid}</p>
        <p style='display:none;'>${websiteID}</p>
        <div style='padding:6px;' class='container'>
            <h3 class='display-6'>${data.name}</h3>
                <div style='display:flex; flex-wrap:wrap;'>
        `

        data.products.forEach(product => {
            if (product.website_id == false || product.website_id[0] == websiteID) {
                html += `
                    <div class="oe_product_cart oe_website_sale">
                        <div class="card" style='width:180px; margin:4px;'>
                            <div onclick='window.location.href="/shop/${product.id}"'>
                                <img src='/web/image/product.template/${product.id}/image_256' width='100%' />
                                <div class="card-body">
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text">Price: ${product.list_price}</p>
                                </div>
                            </div>     
                            <form class="js_add_cart_variants" action="/shop/cart/update" method="POST">
                                <input type="hidden" name="csrf_token" value="${odoo.csrf_token}"/>
                                <input type="hidden" name="product_id" value="${product.product_variant_id[0]}"/>
                                <input type="hidden" name="product_template_id" value="${product.id}"/>
                                <button type="submit" class="btn btn-primary js_add_cart" title="Add to Cart">
                                    <i class="fa fa-shopping-cart"></i>Add to Cart
                                </button>
                            </form>
                            <button type='button' class='add-to-wishlist' data-product-id='${product.id}' data-website-id='${websiteID}'>
                                Add to WishList
                            </button>
                        </div>
                    </div>
                `;
            }
        });

        html += `
                </div>
            </dv>
        </section>
      `
        this.el.outerHTML = html
    },
});

publicWidget.registry.product_category = testing;

export default testing;