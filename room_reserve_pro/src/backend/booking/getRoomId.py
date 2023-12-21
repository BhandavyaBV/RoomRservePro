import json
import boto3

def lambda_handler(event, context):
    # Replace these with your actual AWS region and DynamoDB table name
    
    table_name = 'Room'

    # Extracting the selectedRoom from the event
    selected_room = event.get("selectedRoom")#"Future room"

    # Validate if selectedRoom is present in the request
    if not selected_room:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Bad Request. 'selectedRoom' is required in the request."}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
            }
        }

    try:
        # Create a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')

        # Connect to the DynamoDB table
        table = dynamodb.Table(table_name)

        # Query DynamoDB to fetch a record based on roomName
        response = table.scan(
            FilterExpression="room_name = :name",
            ExpressionAttributeValues={":name": selected_room}
        )
        # Check if the record is found
        if response:
            import pprint; pprint.pprint(response.get("Items")[0])
            # If a record is found, return it
            return {
                "statusCode": 200,
                "body": json.dumps(response.get("Items")[0].get("room_id")),
                'headers': {
                'Access-Control-Allow-Origin': '*',
            }
            }
        else:
            # If no record is found
            return {
                "statusCode": 404,
                "body": json.dumps({"message": "Record not found for the given roomName."}),
                'headers': {
                'Access-Control-Allow-Origin': '*',
            }
            }

    except Exception as e:
        # Handle exceptions
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
            }
        }
