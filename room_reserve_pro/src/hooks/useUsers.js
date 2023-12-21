import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUserStatus } from "../Services/userService";

const useUsers = (mutationCallback) => {
    const queryClient = useQueryClient();
    const {data, isLoading} = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const updateUserStatusMutation = useMutation({
        mutationFn: async  (user) => {
            return await updateUserStatus(user.email, user.isBanned)
        },
        onSettled: async () => {
            const resp = await queryClient.invalidateQueries({ queryKey: ['users'] })
            if (mutationCallback) {
                mutationCallback()
            }
            return resp;
        },
    })
    return {data, isLoading, updateUserStatusMutation}

}

export default useUsers