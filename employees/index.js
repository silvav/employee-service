const AWS = require('aws-sdk');

exports.handler = async (event) => {

    var docClient = new AWS.DynamoDB.DocumentClient({'region':'us-east-1'});
    var table = "Employee";
    var year = 2015; 
    var title = "The Big New Movie";

    var params = {
        TableName:table,
        Item:{
            "year": year,
            "title": title,
            "info":{
                "plot": "Nothing happens at all.",
                "rating": 0
            }
        }
    };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
        if (err) {
            callback("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
    });

    let out = {
        'path': event['pathParameters'],
        'name': event["queryStringParameters"]['name'],
        'ua': event['requestContext']['identity']['userAgent'],
        'ip': event['requestContext']['identity']['sourceIP']
    };

    const response = {
        statusCode: 200,
        body: JSON.stringify(event),
    };
    //body: JSON.stringify('Hello from Lambda!'),
    return response;
};

