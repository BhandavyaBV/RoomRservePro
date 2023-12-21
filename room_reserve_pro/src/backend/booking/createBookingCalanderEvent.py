import json
import boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    # Create a new row in the Calendar table
    calendar_table = dynamodb.Table('Calendar')
    try:
        calendar_table.put_item(
           Item={
                'calendarID':event['uuid'],
                'startTime': event['startTime'],
                'endTime': event['endTime'],
                'isAvailable': "False",
                'date':event['date']
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        return {
            'statusCode': 200,
            'body': 'Row successfully created in Calendar table',
            'headers': {
                'Access-Control-Allow-Origin': '*'
            }
        }