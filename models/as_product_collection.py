# -*- coding: utf-8 -*-

from odoo import models, fields

class ProductCollection(models.Model):
    _name = 'as.product.collection'
    _description = 'this is main model'
    
    name = fields.Char(required=True)
    product_collection_ids = fields.Many2many('product.template', string='Product Collection')
    