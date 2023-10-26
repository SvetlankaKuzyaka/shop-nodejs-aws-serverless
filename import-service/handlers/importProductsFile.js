import AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
    try {
        const s3 = new AWS.S3({ region: 'eu-west-1' });

        const signedUrl = await s3.getSignedUrlPromise('putObject', {
            Bucket: 'shop-react-redux-cloudfront-assets',
            Key: `uploaded/${event.queryStringParameters.name}`,
            Expires: 60,
            ContentType: 'text/csv',
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ signedUrl })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify( { message: err.message })
        };
    }
};