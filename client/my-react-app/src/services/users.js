import {useQuery} from "@tanstack/react-query"
import {httpClient} from "../lib/axios"
import {API_ROUTS} from "./api"
import { extractList } from "./response"

const getUsersList=()=>{
    return httpClient.get(API_ROUTS.GET_USERS)
}

export const useUsersList=()=>{
    return useQuery({
    queryKey: ["usersList"],
    queryFn:getUsersList,
    select:(data)=>extractList(data.data, "users")      
    })
}
