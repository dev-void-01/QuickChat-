import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext.jsx";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) setMessages(data.messages);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) setMessages((prev) => [...prev, data.newMessage]);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    if (user) setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
  };

  // live incoming messages
  useEffect(() => {
    if (!socket) return;
    const onNewMessage = (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };
    socket.on("newMessage", onNewMessage);
    return () => socket.off("newMessage", onNewMessage);
  }, [socket, selectedUser]);

  // load the user list once logged in; clear on logout
  useEffect(() => {
    if (authUser) getUsers();
    else {
      setUsers([]);
      setMessages([]);
      setSelectedUser(null);
      setUnseenMessages({});
    }
    // eslint-disable-next-line
  }, [authUser?._id]);

  // load the conversation when a user is picked
  useEffect(() => {
    if (selectedUser) getMessages(selectedUser._id);
    // eslint-disable-next-line
  }, [selectedUser?._id]);

  return (
    <ChatContext.Provider
      value={{ messages, users, selectedUser, unseenMessages, getUsers, sendMessage, selectUser }}
    >
      {children}
    </ChatContext.Provider>
  );
};
