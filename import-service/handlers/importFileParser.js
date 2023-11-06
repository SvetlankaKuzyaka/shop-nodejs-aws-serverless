import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = (event) => {    
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const sqs = new AWS.SQS();

    for (const record of event.Records) {
      const s3Stream = s3.getObject({
        Bucket: 'shop-react-redux-cloudfront-assets',
        Key: record.s3.object.key
      }).createReadStream();

      s3Stream
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => {
            sqs.sendMessage({
                QueueUrl: process.env.SQS_URL,
                MessageBody: JSON.stringify(data),
              }, (err) => {
                  if (err) {
                    console.log(err);
                  }
              });
        })
        .on('end', () => console.log('File has been parsed'))
        .on('error', (err) => console.log(err))
    }
};

