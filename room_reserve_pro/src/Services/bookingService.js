import axios from "axios";

export const getBookings = async () => {
    try {
        const response = await axios.get(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/bookings"
        );
        if (response.data?.body.ok) {
            return response.data.body.bookings;
        }
        throw new Error(response.data?.body.message || "Something went wrong");
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            messsage: err || "Something went wrong",
        };
    }
};

export const cancelBooking = async (booking_id) => {
    try {
        const response = await axios.post(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/bookings/cancel",
            {
                booking_id,
            }
        );
        if (response.data?.body.ok) {
            return {
                ok: true,
            };
        }
        throw new Error(response.data?.body.message || "Something went wrong");
    } catch (err) {
        return {
            ok: false,
        };
    }
};
