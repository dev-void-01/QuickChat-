import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import { LogoIcon } from "../components/Icons.jsx";
import { readFileAsDataURL } from "../lib.js";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(authUser.profilePic || "");
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio || "");
  const [busy, setBusy] = useState(false);

  const onPick = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const body = { fullName: name, bio };
    if (file) body.profilePic = await readFileAsDataURL(file);
    const ok = await updateProfile(body);
    setBusy(false);
    if (ok) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={onSubmit} className="flex flex-col gap-5 p-10 flex-1 w-full">
          <h3 className="text-lg text-white">Profile details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input id="avatar" type="file" accept=".png,.jpg,.jpeg,.webp" hidden onChange={onPick} />
            <Avatar user={{ fullName: name, profilePic: preview }} className="w-12 h-12" textClass="text-lg" />
            <span className="text-sm underline underline-offset-4">Change profile photo</span>
          </label>

          <input
            className="p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
          <textarea
            className="p-2 border border-gray-500 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 border border-gray-500 rounded-full hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="p-10 max-sm:pb-0 max-sm:pt-8">
          <LogoIcon className="w-40 h-40 max-sm:w-24 max-sm:h-24" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
