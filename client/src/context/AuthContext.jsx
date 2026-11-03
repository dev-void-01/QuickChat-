import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [checking, setChecking] = useState(true);

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, { query: { userId: userData._id } });
    setSocket(newSocket);
    newSocket.on("getOnlineUsers", (ids) => setOnlineUsers(ids));
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      // token invalid or server down
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(null);
      } else {
        toast.error("Can't reach the server. Is it running?");
      }
    } finally {
      setChecking(false);
    }
  };

  // state: "login" | "signup"
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        return true;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["token"];
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    socket?.disconnect();
    setSocket(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
        return true;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
    return false;
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
      checkAuth();
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{ axios, authUser, onlineUsers, socket, token, checking, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
