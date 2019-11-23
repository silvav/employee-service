const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {

    // Configuring the database for storing the resource
    var docClient = new AWS.DynamoDB.DocumentClient({ 'region': 'us-east-1' });
    var table = "Employee";

    // Query scan settings are applied
    var params = {
        TableName: table,
        Limit: 100
    };

    // The table is scanned for existing values
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

    /**
     * Successful response is created and returned
     * It's payload contains the documents scanned in the previous step.
     */
    let response = {
        statusCode: 200,
        body: JSON.stringify(employees),
    };
    return response;
};
