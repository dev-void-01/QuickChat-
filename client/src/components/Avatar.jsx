// Shows the profile picture, or a gradient circle with the user's initial.
const Avatar = ({ user, className = "w-9 h-9", textClass = "text-sm" }) => {
  if (user?.profilePic) {
    return <img src={user.profilePic} alt="" className={`${className} rounded-full object-cover shrink-0`} />;
  }
  const initial = (user?.fullName || "?").trim().charAt(0).toUpperCase();
  return (
    <div className={`${className} ${textClass} rounded-full shrink-0 grid place-items-center font-semibold bg-gradient-to-br from-purple-400 to-violet-700`}>
      {initial}
    </div>
  );
};

export default Avatar;
