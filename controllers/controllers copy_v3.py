# -*- coding: utf-8 -*-
from odoo import http


class AsProductCollection(http.Controller):
    @http.route('/as_product_collection/as_product_collection', auth='public', type='json')
    def index(self, **kw):
        # ProductCollections = http.request.env['as_product_collection.as_product_collection']
        ProductCollections = http.request.env['as.product.collection'].sudo().search([])
        print()
        print(ProductCollections)
        product_categories = []
        
        for i in ProductCollections:
            product_categories.append(i.name)
        print()
        print()
        print()
        print(product_categories)
        return product_categories


