import AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { put } from '../ddbClient/index.js';

export const catalogBatchProcess = async (event) => {
    const sns = new AWS.SNS();

    try {
        for (const record of event.Records) {
            const { title, description, price, count } = JSON.parse(record.body);
            const uuid = randomUUID();
            
            const productPayload = { id: uuid, title, description, price: Number(price) };
            const stockPayload = { product_id: uuid, count: Number(count) };

            await put(process.env.PRODUCT_TABLE_NAME, productPayload);

            await put(process.env.STOCKS_TABLE_NAME, stockPayload);
        }
        await sns
                .publish({
                    Subject: 'AWS notification',
                    Message: 'Products have been created successfully',
                    TopicArn: process.env.SNS_ARN
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                })
                .promise();
    } catch (err) {
        console.log(err);
    }
};