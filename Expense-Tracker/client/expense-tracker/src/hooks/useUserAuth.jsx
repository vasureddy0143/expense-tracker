import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
    const {user,updateUser,clearUser} =  useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) return;


        let isMounted = true;

        const fetchUserInfo = async() => {
            try {
                const response =  await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

                if(isMounted && response.data){
                    updateUser(response.data);
                }
            } catch(error){
                console.log(error);
                console.error("Failed to fetch use info", error);
                console.log(error.message);
                if(isMounted){
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();
        return () =>{
            isMounted = false;
        };
    }, [updateUser,clearUser,navigate]);
};

export default useUserAuth;