import { fetchMessagedUsers } from "@/service/messages"
import { useQuery } from "@tanstack/react-query"

export const useMessagedUsers = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messagedUsers"],
    queryFn: fetchMessagedUsers,
  })

  return { users, isLoading, isError, error, refetch }
}
