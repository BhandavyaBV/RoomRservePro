import axios from 'axios';
export const getChartData = async () => {
    try {
        const response = await axios.get('https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/dashboard');
        if(response.data?.ok){
            return response.data.body;
        }
        throw new Error(response.data?.message || "Something went wrong");
    }catch(err){
        console.error(err);
        return {
            ok: false,
            message: err.message || "Something went wrong"
        }
    }
}