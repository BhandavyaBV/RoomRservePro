import axios from "axios";
export const getRooms = async () => {
    try {
        const response = await axios.get(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/rooms"
        );
        if (response.data?.body.ok) {
            return response.data.body.rooms;
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

export const addRoom = async (room) => {
    try {
        const response = await axios.post(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/rooms/add",
            {
                room_name: room.room_name,
                location: room.location,
                capacity: room.capacity,
                room_type: room.room_type,
            }
        );
        if (response.data?.body.ok) {
            return {
                ok: true,
            };
        }
        throw new Error(response.data?.body.message || "Something went wrong");
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            message: err || "Something went wrong",
        };
    }
};

export const updateRoom = async (room) => {
    try {
        const response = await axios.post(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/rooms/update",
            {
                room_id: room.room_id,
                room_name: room.room_name,
                location: room.location,
                capacity: room.capacity,
                room_type: room.room_type,
            }
        );
        if (response.data?.body.ok) {
            return {
                ok: true,
            };
        }
        throw new Error(response.data?.body.message || "Something went wrong");
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            message: err || "Something went wrong",
        };
    }
};

export const deleteRoom = async (room) => {
    try {
        const response = await axios.post(
            "https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/rooms/delete",
            {
                room_id: room.room_id,
            }
        );
        if (response.data?.body.ok) {
            return {
                ok: true,
            };
        }
        throw new Error(response.data?.body.message || "Something went wrong");
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            message: err || "Something went wrong",
        };
    }
}