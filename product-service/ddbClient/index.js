import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();

export const scan = async (tableName) => {
    const scanResults = await dynamo
      .scan({
        TableName: tableName,
      })
      .promise();
    return scanResults.Items;
  };

  export const getById = async (tableName, keyConfig) => {
    const getResults = await dynamo
      .get({
        TableName: tableName,
        Key: keyConfig,
      })
      .promise();
    return getResults.Item;
  };

  export const put = async (tableName, item) => {
    const putResults = await dynamo
      .put({
        TableName: tableName,
        Item: item,
      })
      .promise();
    return putResults.Item;
  };