import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')

    # Scan the table for unique locations
    response = table.scan(
        ProjectionExpression='#loc',
        ExpressionAttributeNames={
            '#loc': 'location',
        }
    )

    # Extract locations from response
    locations = [item['location'] for item in response['Items']]

    # Remove duplicates
    locations = list(set(locations))

    return {
        'statusCode': 200,
        'body': locations
    }