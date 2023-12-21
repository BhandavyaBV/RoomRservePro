const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    // Fetch all rows from the "bookings" table
    const bookingsParams = {
      TableName: "bookings",
    };

    const bookingsResult = await dynamoDB.scan(bookingsParams).promise();
    const bookings = bookingsResult.Items;

    const roomParams = {
      TableName: "Room",
      ProjectionExpression: "#loc",
      ExpressionAttributeNames: {
        "#loc": "location",
      },
    };

    const roomResult = await dynamoDB.scan(roomParams).promise();

    const pieX = [
      "less than 30 minutes",
      "30 minutes to 2 hours",
      "2-3 hours",
      "more than 3 hours",
    ];
    const pieY = [0, 0, 0, 0];

    // Iterate through bookings
    for (const booking of bookings) {
      // Calculate the difference between end_date_time and start_date_time in minutes
      const startTime = new Date(booking.start_date_time);
      const endTime = new Date(booking.end_date_time);
      const timeDifference = (endTime - startTime) / (1000 * 60); // Convert milliseconds to minutes

      // Increment the corresponding index in the output array based on the time difference
      if (timeDifference < 30) {
        pieY[0]++;
      } else if (timeDifference >= 30 && timeDifference < 120) {
        pieY[1]++;
      } else if (timeDifference >= 120 && timeDifference < 180) {
        pieY[2]++;
      } else {
        pieY[3]++;
      }
    }

    const barX = Array.from(
      new Set(roomResult.Items.map((room) => room.location))
    );
    const barY = Array(barX.length).fill(0);

    // Iterate through bookings
    for (const booking of bookings) {
      // Find the location based on room_id
      const room = roomResult.Items.find(
        (room) => room.room_id === booking.room_id
      );

      // Increment the corresponding index in barY based on the location
      if (room) {
        const locationIndex = barX.indexOf(room.location);
        if (locationIndex !== -1) {
          barY[locationIndex]++;
        }
      }
    }

    return {
      statusCode: 200,
      ok: true,

      body: {
        pieX,
        pieY,
        barX,
        barY,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error retrieving data from DynamoDB", error);

    return {
      statusCode: 500,
      ok: false,
      body: {
        message: "An error occurred.",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
