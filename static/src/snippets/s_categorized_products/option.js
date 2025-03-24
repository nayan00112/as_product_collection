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
