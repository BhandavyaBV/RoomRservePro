import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Attr

def lambda_handler(event, context):
    # Get the userId from the event object
    userId = "someEmail@email.com"#event['userId']

    # Create a DynamoDB resource object
    dynamodb = boto3.resource('dynamodb')

    # Specify the bookings table
    bookings_table = dynamodb.Table('bookings')

    # Specify the rooms table
    rooms_table = dynamodb.Table('Room')

    # Fetch all bookings for the user
    try:
        response = bookings_table.scan(
            FilterExpression=Attr('user_id').eq(userId)
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return {
            'statusCode': 500,
            'body': e.response['Error']['Message']
        }
    else:
        bookings = response['Items']

        # Fetch room names for each booking
        for booking in bookings:
            try:
                room_response = rooms_table.get_item(
                    Key={
                        'room_id': str(booking['room_id'])
                    }
                )
            except ClientError as e:
                print(e.response['Error']['Message'])
            else:
                booking['roomName'] = room_response['Item']['room_name']
                booking['location'] = room_response['Item']['location']
        import pprint; pprint.pprint(bookings)
        return {
            'statusCode': 200,
            'body': bookings,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True,
            }
        }