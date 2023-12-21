import boto3
from datetime import datetime
from boto3.dynamodb.conditions import Key
import uuid
import json


dynamodb = boto3.resource('dynamodb')
booking_table = dynamodb.Table('bookings')

def lambda_handler(event, context):
    print(event)
    # Extract the body from the request data
    body_str = event.get("body", "")
    
    # Convert the JSON string to a dictionary
    event = json.loads(body_str)    
    # Extract input details from the event
    room_id = event['room_id']
    user_id = event['user_id']
    start_date_time = event['start_date_time']
    end_date_time = event['end_date_time']

    # Format the datetime strings to datetime objects
    start_datetime = datetime.strptime(start_date_time, '%Y-%m-%dT%H:%M:%S')
    end_datetime = datetime.strptime(end_date_time, '%Y-%m-%dT%H:%M:%S')

    # Write booking details to the Bookings table with the new booking ID
    booking_item = {
        'bookingId': str(uuid.uuid4()),
        'room_id': room_id,
        'user_id': user_id,
        'start_date_time': start_datetime.isoformat(),
        'end_date_time': end_datetime.isoformat(),
        'status': 'BOOKED'
    }

    response = booking_table.put_item(Item=booking_item)

    return {
        'statusCode': 200,
        'body': response
    }
