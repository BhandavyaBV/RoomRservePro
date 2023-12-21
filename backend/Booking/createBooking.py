import boto3
from datetime import datetime

def lambda_handler(event, context):
    import pprint; pprint.pprint(event)
    # Initialize the DynamoDB client
    dynamodb = boto3.resource('dynamodb')

    # Get the table
    table = dynamodb.Table('bookings')
    calendar_table = dynamodb.Table('Calendar')

    # Extract the parameters from the event
    calenderId = event['calenderId']
    roomId = event['roomId']
    userId = event['userId']
    bookingId = event['bookingId']
    status = event['status']

    # Scan the 'bookings' table for the room ID
    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('room_id').eq(roomId)
    )
    room_entries = response['Items']

    # If the room is already booked, return
    # if any(entry['status'] == 'BOOKED' for entry in room_entries):
    #     return {
    #         'statusCode': 400,
    #         'body': 'Room is already booked',
    #         'headers': {
    #             'Access-Control-Allow-Origin': '*',
    #             'Access-Control-Allow-Credentials': True,
    #         },
    #     }

    # calendar_entry = calendar_table.query(
    #     KeyConditionExpression=boto3.dynamodb.conditions.Key('calendarID').eq(calenderId)
    # )
    calendar_entry = calendar_table.scan(
    FilterExpression=boto3.dynamodb.conditions.Attr('calendarID').eq(calenderId))

    calendar_entry = calendar_entry.get('Items', [])[0]

    start_time = calendar_entry.get('startTime')
    end_time = calendar_entry.get('endTime')
    date = calendar_entry.get('date')

    # Convert date and time strings to a datetime object
    date_time_str = f'20{date} {start_time}'
    date_time_obj = datetime.strptime(date_time_str, '%Y%m%d %I:%M %p')
    formatted_startdatetime = date_time_obj.strftime('%Y-%m-%dT%H:%M:%S')

    date_time_str = f'20{date} {end_time}'
    date_time_obj = datetime.strptime(date_time_str, '%Y%m%d %I:%M %p')
    formatted_enddatetime = date_time_obj.strftime('%Y-%m-%dT%H:%M:%S')

    print(formatted_startdatetime)
    print(formatted_enddatetime)

    # Create a new row in the table
    response = table.put_item(
        Item={
            'calenderId': calenderId,
            'room_id': roomId,
            'user_id': userId,
            'bookingId': bookingId,
            'status': status,
            'start_date_time': formatted_startdatetime,
            'end_date_time': formatted_enddatetime,
        }
    )

    return {
        'statusCode': 200,
        'body': 'Booking created successfully',
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
    }