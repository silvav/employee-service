const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

exports.handler = async (event) => {

    var docClient = new AWS.DynamoDB.DocumentClient({'region':'us-east-1'});
    var table = "Employee";

    let employee = JSON.parse(event.body);

    let validationError = [];

    // @TODO validate employee
    if (typeof employee !== 'object') {
        validationError.push("object invalid, expected object <Employee>");
    }

    if (!employee.hasOwnProperty('id')) {
        employee.id = uuidv4();
    }

    const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!employee.id.match(v4)) {
        validationError.push("invalid input, propety <id> expects type string and uuid format");
    }

    if (!employee.hasOwnProperty('jobTitle')) {
        validationError.push("object invalid, propety <jobTitle> is required");
    }

    if (!employee.hasOwnProperty('name')) {
        validationError.push("object invalid, property <name> is required");
    }
    if (!employee.hasOwnProperty('email')) {
        validationError.push("object invalid, property <email> is required");
    }

    if (validationError.length > 0) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({"errors": validationError}),
        };
        return response;
    }

    // end validation
    var params = {
        TableName:table,
        Item: employee
    };

    let result = await docClient.put(params, function(err, data) {
        if (err) {
            callback("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data));
        }
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify(employee),
    };

    return response;
};
