# -*- coding: utf-8 -*-
from odoo import http


class AsProductCollection(http.Controller):

    @http.route('/as_product_collection/all', auth='public', type='json')
    def getallrows(self, **kw):
        ProductCollections = http.request.env['as.product.collection'].sudo().search([])
        product_categories = []
        for i in ProductCollections:
            products = []
            for j in i.product_collection_ids:
                products.append(j.name)
            product_categories.append({'name':i.name, 'id':i.id, 'products' : products})
            
        return product_categories
    
    # const products = await element.orm.searchRead(
    #      "product.template",
    #      [["id", "in", productIds]],
    #      ["name", "list_price", "image_1920"]
    #   );
    
    @http.route('/as_product_collection_by_id/<id>', auth='public', type='json')
    def getseelctedproductsrows(self,id, **kw):

        products_category = http.request.env['as.product.collection'].sudo().search([('id', '=', id)])
        print(products_category.product_collection_ids)
        products = []
        for i in products_category.product_collection_ids:
            products = http.request.env['product.template'].sudo().search([('id','=', i.id)])
        products_list = []
        for product in products:
            products_list.append({'id':product.id ,'name':product.name, 'list_price': product.list_price})
        print()
        print()
        print(products_list)
        print()
        
        return products_list
        
        