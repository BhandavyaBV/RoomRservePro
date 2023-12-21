import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('Room')

    # Scan the table for unique capacities
    response = table.scan(
        ProjectionExpression='#cap',
        ExpressionAttributeNames={
            '#cap': 'capacity',
        }
    )

    # Extract capacities from response and filter out empty or None values
    capacities = [item['capacity'] for item in response['Items'] if item.get('capacity') is not None and item.get('capacity') != '']

    # Remove duplicates
    capacities = list(set(capacities))

    return {
        'statusCode': 200,
        'body': capacities
    }
