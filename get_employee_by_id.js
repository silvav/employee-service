const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    
    let id = event.pathParameters['id'];
    const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    let validationError = [];
    if (!id.match(v4)) {
        validationError.push("invalid input, path <id> expects type string and uuid format");
    }

    if (validationError.length > 0) {
        const response = {
            statusCode: 400,
            body: JSON.stringify(
                {
                    "message": "invalid input",
                    "errors": validationError
                }
            ),
        };
        return response;
    }

    var docClient = new AWS.DynamoDB.DocumentClient({ 'region': 'us-east-1' });
    let table = "Employee";

    let employee = {};
    let params = {
        TableName : table,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames:{
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": id
        }
    };
    
    let result = await docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            console.log(JSON.stringify(data.Items));
            return data.Items;
        }
    }).promise();

    console.log(JSON.stringify(result));

    if (result.Count === 0) {
        let response = {
            statusCode: 404
        };
        return response;
    }
    
    let response = {
        statusCode: 200,
        body: JSON.stringify(result.Items),
    };
    return response;
};