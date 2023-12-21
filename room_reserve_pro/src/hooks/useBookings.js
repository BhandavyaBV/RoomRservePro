import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelBooking, getBookings } from "../Services/bookingService";

const useBookings = (mutationCallback) => {
    const queryClient = useQueryClient();
    const {data, isLoading} = useQuery({ queryKey: ['bookings'], queryFn: getBookings });
    const cancelBookingMutation = useMutation({
        mutationFn: async  (booking_id) => {
            return await cancelBooking(booking_id)
        },
        onSettled: async () => {
            const resp =  await queryClient.invalidateQueries({ queryKey: ['bookings'] });
            if(mutationCallback) mutationCallback();
            return resp;
        },
    })
    return {data, isLoading, cancelBookingMutation}
}

export default useBookings