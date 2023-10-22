import { scan } from '../ddbClient/index.js';
import _ from 'lodash';

export const getProductsList = async () => {
    try {
        const [productsTable, stocksTable] = await Promise.all([
            scan(process.env.PRODUCT_TABLE_NAME),
            scan(process.env.STOCKS_TABLE_NAME),
        ]);
    
        const products = _.map(productsTable, (product) =>
            _.chain(product)
            .merge(_.find(stocksTable, { product_id: product.id }))
            .omit("product_id")
            .value()
        );
      
        return {
          statusCode: 200,
          body: JSON.stringify(products),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: err.message })
        };
    }
};


