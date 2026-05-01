import { useQuery } from "@tanstack/react-query";
import { httpClient } from "../lib/axios";
import { API_ROUTS } from "./api";
import { extractList } from "./response";

const getRecipeDetails =()=>{
    return httpClient.get(API_ROUTS.GET_RECIPES)
    
}

const getRecipeById = (id) => {
    return httpClient.get(API_ROUTS.GET_RECIPE(id))
}

const getRecipesByUserId = (userId) => {
    return httpClient.get(API_ROUTS.GET_RECIPES, { params: { userId } })
}

export const useRecipeDetails=()=>{
    return useQuery({
        queryKey:["recipeDetails"],
        queryFn:getRecipeDetails,
        select:(data)=>extractList(data.data, "recipes")
    })
}

export const useRecipeProfile=(id)=>{
    return useQuery({
        queryKey:["recipeProfile", id],
        queryFn:()=>getRecipeById(id),
        enabled:Boolean(id),
        select:(data)=>data.data
    })
}

export const useRecipesByUserId=(userId)=>{
    return useQuery({
        queryKey:["recipesByUser", userId],
        queryFn:()=>getRecipesByUserId(userId),
        enabled:Boolean(userId),
        select:(data)=>extractList(data.data, "recipes")
    })
}
