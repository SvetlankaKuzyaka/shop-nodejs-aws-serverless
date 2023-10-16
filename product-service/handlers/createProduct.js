import { put } from '../ddbClient/index.js';
import { randomUUID } from 'crypto';

export const createProduct = async (event) => {
    try {
        const { title, description, price, count } = JSON.parse(event.body);
        const uuid = randomUUID();

        const productPayload = { id: uuid, title, description, price };
        const stockPayload = { product_id: uuid, count };

        await put(process.env.PRODUCT_TABLE_NAME, productPayload);

        await put(process.env.STOCKS_TABLE_NAME, stockPayload);

        return { statusCode: 204 };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: err.message })
        };
    }
};


  