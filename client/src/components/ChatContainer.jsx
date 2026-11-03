import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import Avatar from "./Avatar.jsx";
import { BackIcon, ImageIcon, InfoIcon, LogoIcon, SendIcon } from "./Icons.jsx";
import { formatMessageTime, readFileAsDataURL } from "../lib.js";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const { messages, selectedUser, selectUser, sendMessage } = useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendMessage({ text });
  };

  const onSendImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    await sendMessage({ image: await readFileAsDataURL(file) });
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-gray-400 bg-white/[0.02] max-md:hidden">
        <LogoIcon className="w-16 h-16" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
        <p className="text-sm">Pick someone from the list to start a conversation.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden relative backdrop-blur-lg flex flex-col">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <button onClick={() => selectUser(null)} className="md:hidden" aria-label="Back">
          <BackIcon />
        </button>
        <Avatar user={selectedUser} className="w-8 h-8" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </p>
        <InfoIcon className="w-5 h-5 text-gray-300 max-xl:hidden" />
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto scroll-thin p-3 pb-4">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">
            No messages yet. Say hi to {selectedUser.fullName.split(" ")[0]}!
          </p>
        )}
        {messages.map((msg) => {
          const mine = msg.senderId === authUser._id;
          return (
            <div key={msg._id} className={`flex items-end gap-2 justify-end ${!mine ? "flex-row-reverse" : ""}`}>
              {msg.image ? (
                <a href={msg.image} target="_blank" rel="noreferrer">
                  <img
                    src={msg.image}
                    alt=""
                    className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
                  />
                </a>
              ) : (
                <p
                  className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-words bg-violet-500/30 text-white ${
                    mine ? "rounded-br-none" : "rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </p>
              )}
              <div className="text-center text-xs">
                <Avatar user={mine ? authUser : selectedUser} className="w-7 h-7" textClass="text-xs" />
                <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* input */}
      <form onSubmit={onSend} className="flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 bg-white/10 px-3 rounded-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />
          <input id="image" type="file" accept="image/png, image/jpeg, image/webp" hidden onChange={onSendImage} />
          <label htmlFor="image" className="cursor-pointer text-gray-300 hover:text-white">
            <ImageIcon className="w-5 h-5" />
          </label>
        </div>
        <button
          type="submit"
          aria-label="Send"
          className="w-10 h-10 grid place-items-center rounded-full bg-gradient-to-br from-purple-400 to-violet-600"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;
