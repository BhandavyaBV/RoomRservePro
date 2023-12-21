import boto3
import json

dynamodb = boto3.resource('dynamodb')
booking_table = dynamodb.Table('bookings')

def lambda_handler(event, context):
    # Extract input details from the event
    print(event)
    # Extract the body from the request data
    body_str = event.get("body", "")
    
    # Convert the JSON string to a dictionary
    event = json.loads(body_str)    
    # Extract input details from the event
    booking_id = event['booking_id']

    # Update the booking status to CANCELED
    response = booking_table.update_item(
        Key={'bookingId': booking_id},
        UpdateExpression='SET #status = :status',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={':status': 'CANCELED'},
        ReturnValues='ALL_NEW'
    )

    canceled_booking = response.get('Attributes', None)

    if canceled_booking:
        return {
            'statusCode': 200,
            'body': {'message': 'Booking canceled successfully', 'canceled_booking': canceled_booking}
        }
    else:
        return {
            'statusCode': 404,
            'body': {'message': 'Booking not found'}
        }