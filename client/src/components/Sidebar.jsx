import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from "../context/ChatContext.jsx";
import Avatar from "./Avatar.jsx";
import { LogoIcon, MenuIcon, SearchIcon } from "./Icons.jsx";

const Sidebar = () => {
  const { users, selectedUser, selectUser, unseenMessages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filtered = query
    ? users.filter((u) => u.fullName.toLowerCase().includes(query.toLowerCase()))
    : users;

  return (
    <aside
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto scroll-thin text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-7 h-7" />
            <span className="text-lg font-semibold">Quick Chat</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1 rounded hover:bg-white/10"
              aria-label="Menu"
            >
              <MenuIcon />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 z-20 w-36 p-4 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
                <p
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="cursor-pointer text-sm"
                >
                  Edit profile
                </p>
                <hr className="my-2 border-t border-gray-500" />
                <p onClick={logout} className="cursor-pointer text-sm">
                  Log out
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <SearchIcon className="w-4 h-4 text-gray-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search user…"
          />
        </div>
      </div>

      <div className="flex flex-col">
        {filtered.map((user) => {
          const online = onlineUsers.includes(user._id);
          const unseen = unseenMessages[user._id];
          const active = selectedUser?._id === user._id;
          return (
            <div
              key={user._id}
              onClick={() => selectUser(user)}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
                active ? "bg-[#282142]/50" : "hover:bg-white/5"
              }`}
            >
              <Avatar user={user} className="w-[35px] h-[35px]" />
              <div className="flex flex-col leading-5 min-w-0">
                <p className="truncate">{user.fullName}</p>
                {online ? (
                  <span className="text-green-400 text-xs">Online</span>
                ) : (
                  <span className="text-neutral-400 text-xs">Offline</span>
                )}
              </div>
              {unseen > 0 && (
                <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/60">
                  {unseen}
                </p>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 px-4 py-6">
            {users.length === 0
              ? "No other users yet. Sign up a second account in another browser to start chatting."
              : "No users match your search."}
          </p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
