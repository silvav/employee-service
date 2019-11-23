const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

exports.handler = async (event) => {
    // Transforming the resource received
    let employee = JSON.parse(event.body);
    let validationError = [];

    // Validation, verifying type of variable
    if (typeof employee !== 'object') {
        validationError.push("object invalid, expected object <Employee>");
    }

    /**
     * Sanity check, verifying presence of uuid
     * In case it was not specified, it will be generated now
     */
    if (!employee.hasOwnProperty('id')) {
        employee.id = uuidv4();
    }

    // Validation, verifying format of uuid
    const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (!employee.id.match(v4)) {
        validationError.push("invalid input, propety <id> expects type string and uuid format");
    }

    // Validation, job title
    if (!employee.hasOwnProperty('jobTitle')) {
        validationError.push("object invalid, propety <jobTitle> is required");
    }
    // Validation, name
    if (!employee.hasOwnProperty('name')) {
        validationError.push("object invalid, property <name> is required");
    }
    // Validation, email
    if (!employee.hasOwnProperty('email')) {
        validationError.push("object invalid, property <email> is required");
    }

    /**
     * In case errors were detected this function returns here
     * with status code 400 to indicate a "bad request" was sent.
     */
    if (validationError.length > 0) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({"errors": validationError}),
        };
        return response;
    }

    // Configuring the database for storing the resource
    var docClient = new AWS.DynamoDB.DocumentClient({'region':'us-east-1'});
    var table = "Employee";

    // A database search query is initialized
    let params = {
        TableName : table,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames:{
            "#id": "id"
        },
        ExpressionAttributeValues: {
            ":id": employee.id
        }
    };

    // The search query is executed
    let result = await docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            console.log(JSON.stringify(data.Items));
            return data.Items;
        }
    }).promise();

    /**
     * The pre-existence of the resource is checked
     * In case it already exists, a failure response is returned.
     */
    if (result.Count !== 0) {
        let response = {
            statusCode: 409,
            body: JSON.stringify("an existing employee already exists"),
        };
        return response;
    }

    // A database document is initialized
    params = {
        TableName:table,
        Item: employee
    };

    // The database document is saved
    result = await docClient.put(params, function(err, data) {
        if (err) {
            callback("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data));
        }
    }).promise();

    // Successful response is created and returned
    const response = {
        statusCode: 201,
        body: JSON.stringify(employee),
    };

    return response;
};
