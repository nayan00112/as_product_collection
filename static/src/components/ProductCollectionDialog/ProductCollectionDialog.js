/** @odoo-module **/

import { Component, xml } from '@odoo/owl'
import { Dialog } from "@web/core/dialog/dialog";
import { useService } from "@web/core/utils/hooks";

export class ProductCollectionDialog extends Component {
    static components = { Dialog };
    static template ='as_product_collection.product_collection_dialog_template';
    setup() {
        this.orm = useService("orm");
        this.website = useService('website');
    }

    static props = {
        title: String,
        categories: Array,
    };

    // call when any collection is selected on dialog box.
    async selectproductcollection(element) {
        const uid = Number(document.getElementsByClassName('form-select')[0].value);
        const data = await element.orm.read('as.product.collection', [uid], ['name', 'product_collection_ids'])
        const productIds = data[0].product_collection_ids;
        const products = await element.orm.searchRead(
            "product.template",
            [["id", "in", productIds]],
            ["name", "list_price", 'website_id', 'product_variant_id']
        );

        const final_product_collection = {
            'name': data[0].name,
            'products': products,
            'websiteID': element.website.currentWebsite.id,
        }

        element.props.onSelect(uid, final_product_collection);
        element.props.close();
    }
}
