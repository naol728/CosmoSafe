import { getUserDisaster } from '@/services/earthService'
import { useQuery } from '@tanstack/react-query'

export default function useUserDisaster() {
    const { data, isLoading, isError } = useQuery({
        queryFn: getUserDisaster,
        queryKey: ["userdisaster"]
    })
    return {
        userdisaster: data,
        udloading: isLoading,
        uderror: isError
    }
}
