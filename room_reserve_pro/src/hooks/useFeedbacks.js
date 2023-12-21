import { useQuery } from '@tanstack/react-query';
import { getFeedbacks } from '../Services/feedbackService';

const useFeedbacks = () => {
    const {data, isLoading} = useQuery({ queryKey: ['feedbacks'], queryFn: getFeedbacks });
    return {data, isLoading}
}

export default useFeedbacks