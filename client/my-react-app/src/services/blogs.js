import {useQuery} from "@tanstack/react-query"
import { httpClient } from "../lib/axios"
import { API_ROUTS } from "./api"
import { extractList } from "./response"

const getBlogsList=()=>{
    return httpClient.get(API_ROUTS.GET_BLOGS)
}

const getBlogById=(id)=>{
    return httpClient.get(API_ROUTS.GET_BLOG(id))
}

export const useBlogList=()=>{
    return useQuery({
        queryKey:["BlogsList"],
        queryFn:getBlogsList,
        select:(data)=>extractList(data.data, "blogs")
    })
}

export const useBlogProfile=(id)=>{
    return useQuery({
        queryKey:["BlogProfile", id],
        queryFn:()=>getBlogById(id),
        enabled:Boolean(id),
        select:(data)=>data.data
    })
}
