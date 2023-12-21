import axios from 'axios';
export const getFeedbacks = async () => {
  try {
    const response = await axios.get(`https://b5cezhn2aa.execute-api.us-east-1.amazonaws.com/Test/feedbacks`);
    if(response.data?.body.ok) {
      return response.data?.body.feedback;
    }
    throw new Error(response.data?.body.message || 'Something went wrong');
  } catch (error) {
    return {
        ok: false,
        message: error || 'Something went wrong',
    };
  }
}