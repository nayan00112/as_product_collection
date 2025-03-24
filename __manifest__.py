# -*- coding: utf-8 -*-
{
    'name': "as_product_collection",

    'summary': "as_product_collection is module for product collection",

    'description': """
as_product_collection is module for product collection
    """,

    'author': "Atharva",
    'website': "https://www.atharvasystem.com/",
    'category': 'Uncategorized',
    'version': '0.1',

    'depends': ['base', 'website_sale', 'website_sale_wishlist'],

    'data': [
        'security/ir.model.access.csv',
        'views/as_product_collection_action.xml',
        'views/menu.xml',
        'views/snippets/s_categorized_products.xml',
        'views/snippets/option.xml',
    ],
    'demo': [
        'demo/demo.xml',
    ],
    
    'assets': {        
        'web.assets_frontend': [
            ('include', 'website_sale.assets_frontend'),
            ('include', 'website_sale_wishlist.assets_frontend'),
            ('include', 'website_sale_comparison.assets_frontend'),
            
            'as_product_collection/static/src/snippets/s_categorized_products/000.js'            
        ],
        
        'website.assets_wysiwyg': [
            'as_product_collection/static/src/components/ProductCollectionDialog/ProductCollectionDialogTemplate.xml',
            'as_product_collection/static/src/components/ProductCollectionDialog/ProductCollectionDialog.js',
            'as_product_collection/static/src/snippets/s_categorized_products/option.js',  
        ]  
    },
    
    'installable':True,
    'application':True,
}

