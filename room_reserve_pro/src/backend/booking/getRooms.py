import json
import boto3
from botocore.exceptions import ClientError
import pprint

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')
    return_data = {}
    try:
        response = table.scan(
            FilterExpression="room_type_id=:type",
            ExpressionAttributeValues={":type": "2"}
        )
        pprint.pprint(response)
    except ClientError as e:
        print(e.response['Error']['Message'])
        response_data = {
            'statusCode': 200,
            'body': e.response['Error']['Message'],
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
        }
    else:
        all_items = response['Items']
        rooms_data = {}
        for items in all_items:
            rooms_data[items['room_id']] = {
                'name': items['room_name'],
                'location': items['location'],  # Assuming the table has 'location' field
                'capacity': items['capacity']  # Assuming the table has 'capacity' field
            }
        response_data = {
            'statusCode': 200,
            'body': rooms_data,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
        }
    return response_data