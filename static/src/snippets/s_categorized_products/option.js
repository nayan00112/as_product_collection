/** @odoo-module **/

import options from "@web_editor/js/editor/snippets.options";
import { rpc } from "@web/core/network/rpc";
import { ProductCollectionDialog } from '../../components/ProductCollectionDialog/ProductCollectionDialog'

options.registry.productsview = options.Class.extend({
    start: function () {
        this.dialog = this.bindService("dialog");
        this.rpc = rpc;
    },

    updateSnippet: function (uid, data) {

        let html = `
        <section class="s_categorized_product py-4">
            <p style='display:none;'>${uid}</p>
            <p style='display:none;'>${data.websiteID}</p>
            <div class='container'>
                <h3 class='display-6 text-center mb-4'>${data.name}</h3>
                <div class='row g-3 justify-content-center'>
        `;

        data.products.forEach(product => {
            if (product.website_id == false || product.website_id[0] == data.websiteID) {
                html += `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <div class="oe_product_cart oe_website_sale card shadow-sm h-100">
                        <div class="position-relative">
                            <img src='/web/image/product.template/${product.id}/image_256' class='card-img-top' alt='${product.name}'>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-truncate">${product.name}</h5>
                                <p class="card-text text-muted">Price: ${product.list_price}</p>
                                <div class="mt-auto">
                                    <form class="js_add_cart_variants" action="/shop/cart/update" method="POST">
                                        <input type="hidden" name="csrf_token" value="${odoo.csrf_token}"/>
                                        <input type="hidden" name="product_id" value="${product.product_variant_id[0]}"/>
                                        <input type="hidden" name="product_template_id" value="${product.id}"/>
                                        <button type="submit" class="btn btn-primary w-100 js_add_cart" title="Add to Cart">
                                            <i class="fa fa-shopping-cart"></i> Add to Cart
                                        </button>
                                    </form>
                                    <button type='button' class='btn btn-outline-secondary w-100 mt-2 add-to-wishlist' 
                                        data-product-id='${product.id}' data-website-id='${data.websiteID}'>
                                        <i class="fa fa-heart"></i> Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        `;
            }
        });
        this.$target.html(html);
    },

    onBuilt: async function () {
        const productcategory = rpc('/as_product_collection/all').then(r => {
            return r;
        });

        productcategory.then(r => {
            this.dialog.add(ProductCollectionDialog, {
                title: "Select Product Category",
                categories: r,
                onSelect: (uid, data) => this.updateSnippet(uid, data),
            });
        })
    },
})
