const generatePolicy = (principalId, resource, effect) => {
    return {
      principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
    };
};



export const basicAuthorizer = (event, ctx, cb) => {
    const { headers, routeArn } = event;
    const authorizationHeader = headers?.authorization;

    if (!authorizationHeader) {
        cb('Unauthorized');
    }

    try {
        const encodedCreds = authorizationHeader.split(' ')[1];

        const buff = Buffer.from(encodedCreds, 'base64');
        const plainCreds = buff.toString('utf-8').split(':');

        const [username, password] = plainCreds;

        const storedUserPassword = process.env[username];

        const effect = (!storedUserPassword || storedUserPassword !== password) ? 'Deny' : 'Allow';
        const policy = generatePolicy(encodedCreds, routeArn, effect);

        cb(null, policy);
    } catch (err) {
        cb(`Unauthorized: ${err.message}`)
    }
};

