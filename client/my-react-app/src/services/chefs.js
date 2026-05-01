import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { httpClient } from "../lib/axios"
import { API_ROUTS } from "./api"
import { extractList } from "./response"

const getChefsList = () => {
  return httpClient.get(API_ROUTS.GET_CHEFS)
}

const getChefById = (id) => {
  return httpClient.get(API_ROUTS.GET_CHEF(id))
}

const rateChef = ({ id, rating }) => {
  return httpClient.post(API_ROUTS.RATE_CHEF(id), { rating })
}

export const useChefsList = () => {
  return useQuery({
    queryKey: ["chefsList"],
    queryFn: getChefsList,
    select: (data) => extractList(data.data, "chefs")
  })
}

export const useChefProfile = (id) => {
  return useQuery({
    queryKey: ["chefProfile", id],
    queryFn: () => getChefById(id),
    enabled: Boolean(id),
    select: (data) => data.data?.chef
  })
}

export const useRateChef = (id) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rating) => rateChef({ id, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chefProfile", id] })
      queryClient.invalidateQueries({ queryKey: ["chefsList"] })
    },
  })
}
