import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);

  console.log("🔗 Backend URL:", backendUrl);
  console.log("🔑 Token:", token);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        console.log("✅ Doctors data fetched:", data.doctors);
        setDoctors(data.doctors);
      } else {
        console.warn("⚠️ Failed to fetch doctors data:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching doctors:", error.response?.data?.message || error.message);
      toast.error("Failed to fetch doctors data.");
    }
  };

  const loadUserProfileData = async () => {
    if (!token) {
      console.warn("⚠️ No token found, skipping user profile fetch.");
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        console.log("✅ User profile fetched:", data.user);
        setUserData(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user)); // Save user data to localStorage
      } else {
        console.warn("⚠️ Failed to load user profile:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Error loading user profile:", error.response?.data?.message || error.message);
      toast.error("Failed to load user profile.");
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null); // Ensure userData is cleared when token is removed
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        doctors,
        getDoctorsData,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
