import { useMutation, useQuery } from "@tanstack/react-query";
import { friendsService } from "../api/friends.api";
import { useQueryConfig } from "@/shared/hooks/useQueryConfig";


// export default function useGetFriendsMutation() {
//   const {
//     mutate: getFriends,
//     isPending: isLoading,
//     data,
//   } = useMutation({
//     mutationFn:  friendsService.getFriends,
//     onSuccess: () => {
      
//     },
//     onError: (error) => {
//       console.log(error);
//     },
//   });
//   return { data, getFriends, isLoading };
// }
export const useFriends = () => {
  return useQuery({
    queryKey: ["friends"],
    queryFn: friendsService.getFriends,
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000,
  });
};