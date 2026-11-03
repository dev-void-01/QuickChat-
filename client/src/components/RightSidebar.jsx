import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import Avatar from "./Avatar.jsx";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const media = useMemo(() => messages.filter((m) => m.image).map((m) => m.image), [messages]);

  if (!selectedUser) return null;

  return (
    <aside className="bg-[#8185B2]/10 text-white w-full relative overflow-y-auto scroll-thin max-xl:hidden">
      <div className="pt-12 flex flex-col items-center gap-2 text-xs font-light mx-auto">
        <Avatar user={selectedUser} className="w-20 h-20" textClass="text-3xl" />
        <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10 mx-auto text-center text-gray-300">{selectedUser.bio || "No bio yet."}</p>
      </div>

      <hr className="border-[#ffffff50] my-4 mx-5" />

      <div className="px-5 text-xs">
        <p className="mb-2">Media</p>
        {media.length === 0 ? (
          <p className="text-gray-400">Shared photos will show up here.</p>
        ) : (
          <div className="max-h-[220px] overflow-y-auto scroll-thin grid grid-cols-2 gap-3">
            {media.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="rounded cursor-pointer">
                <img src={url} alt="" className="h-full rounded-md" />
              </a>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-16 rounded-full cursor-pointer"
      >
        Log out
      </button>
    </aside>
  );
};

export default RightSidebar;
