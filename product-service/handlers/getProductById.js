import { getById } from '../ddbClient/index.js';
import _ from 'lodash';

export const getProductsById = async (event) => {
    try {
        const { productId } = event.pathParameters;
    
        const productById = await getById(
            process.env.PRODUCT_TABLE_NAME,
            { id: productId }
        );

        if (!productById) {
            return {
                statusCode: 404,
                body: JSON.stringify( { message: 'Product not found' })
            };
        }
    
        const stockByProductId = await getById(
            process.env.STOCKS_TABLE_NAME,
            { product_id: productId }
        );
    
        const product = _.chain(productById)
            .merge(stockByProductId)
            .omit("product_id")
            .value();
    
        return {
            statusCode: 200,
            body: JSON.stringify(product),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: err.message })
        };
    }
  };


  