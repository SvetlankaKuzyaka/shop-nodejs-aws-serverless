import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = (event) => {    
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    event.Records.forEach(record => { 
        const records = [];

        const s3Stream = s3.getObject({
            Bucket: 'shop-react-redux-cloudfront-assets',
            Key: record.s3.object.key
        }).createReadStream();

        s3Stream
            .pipe(csv({ separator: ';' }))
            .on('data', (data) => records.push(data))
            .on('end', () => console.log(records))
            .on('error', (err) => console.log(err))
    });
};

