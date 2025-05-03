import { useMutation } from "@tanstack/react-query";
import { friendsService } from "../services/friends.services";


export default function useGetFriendsMutation() {
  const {
    mutate: getFriends,
    isPending: isLoading,
    data,
  } = useMutation({
    mutationFn:  friendsService.getFriends,
    onSuccess: (data) => {
      console.log("Logout success");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { data, getFriends, isLoading };
}
