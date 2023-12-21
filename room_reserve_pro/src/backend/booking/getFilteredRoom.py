import boto3
from datetime import datetime, timezone
import json

dynamodb = boto3.resource('dynamodb')
room_table = dynamodb.Table('Room')
booking_table = dynamodb.Table('bookings')
room_type_table = dynamodb.Table('RoomType')
calendar_table = dynamodb.Table('Calendar')

def lambda_handler(event, context):
    # Extract the parameters from the request
    selected_location = event.get("location")
    selected_capacity = event.get("capacity")
    selected_start_time = event.get("startTime")
    selected_end_time = event.get("endTime")
    selected_date = event.get("selectedDate")
    
    
    


    # Convert the start and end time strings to datetime objects in UTC
    start_datetime = datetime.strptime(selected_start_time, '%I:%M %p').replace(tzinfo=timezone.utc)
    end_datetime = datetime.strptime(selected_end_time, '%I:%M %p').replace(tzinfo=timezone.utc)

    # Combine date and time for start and end times
    selected_date = datetime.fromisoformat(selected_date.replace('Z', '+00:00'))
    start_datetime = selected_date.replace(hour=start_datetime.hour, minute=start_datetime.minute)
    end_datetime = selected_date.replace(hour=end_datetime.hour, minute=end_datetime.minute)

    # Get all room ids for the specified location and capacity
    matching_rooms = get_matching_rooms(selected_location, selected_capacity)
    matching_room_ids = [room['room_id'] for room in matching_rooms]

    # Query bookings for overlapping periods
    all_bookings = booking_table.scan().get('Items', [])
    overlapping_bookings = []
    
    
    formatted_selected_start_date = start_datetime.strftime('%d%m%y')
    formatted_selected_start_time = start_datetime.strftime('%I:%M %p').lstrip('0')
    
    formatted_selected_end_date = end_datetime.strftime('%d%m%y')
    formatted_selected_end_time = end_datetime.strftime('%I:%M %p').lstrip('0')
    ### fetch all calendar entries for 
    matched_booking = fetchAllCalendarRecords(formatted_selected_start_date,formatted_selected_start_time,formatted_selected_end_date,formatted_selected_end_time,all_bookings)
    # for booking in all_bookings:
    #     status = booking.get('status')
    #     start_date_time = datetime.strptime(booking.get('start_date_time'), '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
    #     end_date_time = datetime.strptime(booking.get('end_date_time'), '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
    #     room_id = booking.get('room_id')

    #     if room_id in matching_room_ids and status == 'CANCELLED' \
    #             or (status == 'BOOKED' and start_datetime <= end_date_time and end_datetime >= start_date_time):
    #         overlapping_bookings.append(booking)

    # # Get room ids that are not booked during the specified period
    # import pprint; pprint.pprint(overlapping_bookings)
    if matched_booking:
        available_room_ids = list(set(matching_room_ids) - set([booking['room_id'] for booking in matched_booking]))
        available_rooms = [room for room in matching_rooms if room['room_id'] in available_room_ids]
    else:
        available_rooms = [room for room in matching_rooms]
    import pprint; pprint.pprint("available_rooms")
    import pprint; pprint.pprint(available_rooms)
    response = {
        'statusCode': 200,
        'headers': {
                'Access-Control-Allow-Origin': '*',
            },
        'body': available_rooms,
    }

    return response
def fetchAllCalendarRecords(formatted_selected_start_date,formatted_selected_start_time,formatted_selected_end_date,formatted_selected_end_time,all_bookings):
    
    import pprint; pprint.pprint(formatted_selected_start_date)
    import pprint; pprint.pprint(formatted_selected_start_time)
    import pprint; pprint.pprint(formatted_selected_end_time)
    return_data = {}
    matched_booking = []
    for booking in all_bookings:
        status = booking.get('status')
        # start_date_time = datetime.strptime(booking.get('start_date_time'), '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
        # end_date_time = datetime.strptime(booking.get('end_date_time'), '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
        start_date_time_str = booking.get('start_date_time')
        end_date_time_str = booking.get('end_date_time')
        
        start_date_time = datetime.strptime(start_date_time_str, '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
        end_date_time = datetime.strptime(end_date_time_str, '%Y-%m-%dT%H:%M:%S').replace(tzinfo=timezone.utc)
        
        formatted_start_date = start_date_time.strftime('%y%m%d')
        formatted_end_date = end_date_time.strftime('%y%m%d')
        
        formatted_start_time = start_date_time.strftime('%I:%M %p').lstrip('0')
        formatted_end_time = end_date_time.strftime('%I:%M %p').lstrip('0')
        
        import pprint; pprint.pprint("booking times")
        import pprint; pprint.pprint(formatted_start_date)
        import pprint; pprint.pprint(formatted_start_time)
        import pprint; pprint.pprint(formatted_end_time)
        
        if formatted_selected_start_date== formatted_start_date:
            if (formatted_start_time<=formatted_selected_start_time>=formatted_end_time) or(formatted_start_time<=formatted_selected_end_time>=formatted_end_time):
                import pprint; pprint.pprint("found an duplicate")
                rqrd_room_id= booking['room_id']
                import pprint; pprint.pprint(rqrd_room_id)
                response = room_table.scan(FilterExpression="room_id = :name",ExpressionAttributeValues={":name": rqrd_room_id})
                if response:
                    # return_data[response.get("Items")[0].get("room_id")] = response.get("Items")[0].get("room_name")
                    # return_data.append(response.get("Items")[0].get("room_name"))
                    matched_booking.append(booking)
                    return matched_booking
                    # return return_data
                    
                
                
    
        
        


        
        
    
    
    
def get_matching_rooms(location, capacity):
    # Get the room type id for the room type with name 'Future'
    room_type_response = room_type_table.scan(
        FilterExpression='#name = :name',
        ExpressionAttributeNames={'#name': 'name'},
        ExpressionAttributeValues={':name': 'Future'}
    )

    if not room_type_response['Items']:
        # If the room type with name 'Future' doesn't exist, return an empty list
        return []

    room_type_id = room_type_response['Items'][0]['room_type_id']

    # Query rooms with the specified room type id, location, and capacity
    rooms = room_table.scan(
        FilterExpression='#room_type_id = :room_type_id AND #location = :location AND #capacity = :capacity',
        ExpressionAttributeNames={
            '#room_type_id': 'room_type_id',
            '#location': 'location',
            '#capacity': 'capacity',
        },
        ExpressionAttributeValues={
            ':room_type_id': room_type_id,
            ':location': location,
            ':capacity': capacity,
        },
    )
    import pprint; pprint.pprint(rooms)

    return rooms.get('Items', [])
