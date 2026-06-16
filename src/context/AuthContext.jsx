import {createContext,useContext,useEffect,useState} from "react";
import {
    login as loginApi,
    register as registerApi,
    getProfile,
    updateProfile as updateProfileApi
} from "../api/authApi";

// Create global auth context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [accessToken,setAccessToken] = useState(
        localStorage.getItem("access_token")
    );
    const [refreshToken,setRefreshToken] = useState(
        localStorage.getItem("refresh_token")
    );
    const [isLoading,setIsLoading] = useState(true);
    // Checks existing login when app starts
    useEffect(()=>{
        const checkAuth = async()=>{
            if(accessToken){
                try{
                    const profile = await getProfile();
                    setUser(profile);
                }
                catch(error){
                    logout();
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    },[]);

    // Login user
    const login = async(email,password)=>{
        const data = await loginApi({
            email,
            password
        });
        localStorage.setItem(
            "access_token",
            data.access
        );
        localStorage.setItem(
            "refresh_token",
            data.refresh
        );
        setAccessToken(data.access);
        setRefreshToken(data.refresh);
        const profile = await getProfile();
        setUser(profile);
    };

    // Register user
    const register = async(data)=>{
        await registerApi(data);
        await login(
            data.email,
            data.password
        );

    };

    // Logout user
    const logout = ()=>{
        localStorage.removeItem(
            "access_token"
        );
        localStorage.removeItem(
            "refresh_token"
        );
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    // Update profile
    const updateProfile = async(data)=>{
        const updatedUser =
        await updateProfileApi(data);
        setUser(updatedUser);
    };
    return (

        <AuthContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                isAuthenticated:!!user,
                isLoading,
                login,
                register,
                logout,
                updateProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth
export const useAuth = ()=>{
    return useContext(AuthContext);
};