import { addRoom, deleteRoom, getRooms, updateRoom } from '../Services/roomservice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useRooms = (addMutationCallback, updateMutationCallback, deleteMutationCallback) => {
    const queryClient = useQueryClient();
    const {data, isLoading} = useQuery({ queryKey: ['rooms'], queryFn: getRooms });
    const addRoomMutation = useMutation({
        mutationFn: async  (room) => {
            return await addRoom(room)
        },
        onSettled: async () => {
            const resp = await queryClient.invalidateQueries({ queryKey: ['rooms'] })
            if(addMutationCallback) addMutationCallback();
            return resp;
        },
    })
    const updateRoomMutation = useMutation({
        mutationFn: async  (room) => {
            return await updateRoom(room)
        },
        onSettled: async () => {
            const resp =  await queryClient.invalidateQueries({ queryKey: ['rooms'] })
            if(updateMutationCallback) updateMutationCallback();
            return resp;
        },
    })
    const deleteRoomMutation = useMutation({
        mutationFn: async  (room) => {
            return await deleteRoom(room)
        },
        onSettled: async () => {
            const resp =  await queryClient.invalidateQueries({ queryKey: ['rooms'] })
            if(deleteMutationCallback) deleteMutationCallback();
            return resp;
        },
    
    })
    return {data, isLoading, addRoomMutation, updateRoomMutation, deleteRoomMutation};
}

export default useRooms