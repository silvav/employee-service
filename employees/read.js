const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {

    var docClient = new AWS.DynamoDB.DocumentClient({ 'region': 'us-east-1' });
    var table = "Employee";

    var params = {
        TableName: table,
        Limit: 100
    };

    var employees = [];
    let result = await docClient.scan(params, (err, data) => {
        if (err) {
            console.error('Read failed');
        } else {
            data.Items.forEach((it) => {
                employees.push(it);
            });
        }
    }).promise();

    let response = {
        statusCode: 200,
        body: JSON.stringify(employees),
    };
    return response;
};