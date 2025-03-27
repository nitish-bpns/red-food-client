import api from "./api"

export const getImageFromMenuId = async(menuId) =>{
    const response = await api.get("/menus/menu/" + `${menuId}`,{
        withCredentials:true
    });

    return response.data.data.image
}