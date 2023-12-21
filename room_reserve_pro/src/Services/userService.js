import axios from 'axios';

export const getUsers = async () => {
    try {
        const response = await axios.get('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/users');
        if(response.data?.body.ok){
            return response.data.body.users;
        }
        else{
            throw new Error(response.data.message)
        }
    }catch(err){
        console.error(err)
        return {
            ok: false,
            message: err.message || "Something went wrong"
        }
    }
}

export const updateUserStatus = async (email, isBanned) => {
    try {
        const response = await axios.post("https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/users/ban", {
                email,
                isBanned
        });
        if(response.data?.body.ok){
            return response.data.body;
        }
        throw new Error(response.data.message)
    }catch(err){
        console.error(err);
        return {
            ok: false,
            message: err.message || "Something went wrong"
        }
    }
}