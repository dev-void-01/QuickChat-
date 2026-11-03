import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { LogoIcon } from "../components/Icons.jsx";

const inputCls =
  "p-2.5 border border-gray-500 rounded-md bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [bioStep, setBioStep] = useState(false);
  const [busy, setBusy] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // sign-up is two steps: details first, then bio
    if (currState === "Sign up" && !bioStep) {
      setBioStep(true);
      return;
    }

    setBusy(true);
    await login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
    setBusy(false);
  };

  const switchState = (state) => {
    setCurrState(state);
    setBioStep(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col px-4 backdrop-blur-2xl">
      {/* left: brand */}
      <div className="flex flex-col items-center gap-3">
        <LogoIcon className="w-24 h-24 sm:w-32 sm:h-32" />
        <h1 className="text-3xl sm:text-4xl font-semibold">Quick Chat</h1>
        <p className="text-gray-400 text-sm">Message friends in real time</p>
      </div>

      {/* right: form */}
      <form
        onSubmit={onSubmit}
        className="border border-gray-500 bg-white/8 bg-white/[0.04] p-6 flex flex-col gap-5 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {bioStep && (
            <button
              type="button"
              onClick={() => setBioStep(false)}
              className="text-sm text-gray-400 hover:text-white"
              aria-label="Back"
            >
              ← Back
            </button>
          )}
        </h2>

        {currState === "Sign up" && !bioStep && (
          <input
            className={inputCls}
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}

        {!bioStep && (
          <>
            <input
              className={inputCls}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className={inputCls}
              type="password"
              placeholder="Password (min 6 characters)"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}

        {currState === "Sign up" && bioStep && (
          <textarea
            className={inputCls}
            rows={4}
            placeholder="Write a short bio…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        )}

        <button
          type="submit"
          disabled={busy || (currState === "Sign up" && !agreed)}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {busy
            ? "Please wait…"
            : currState === "Sign up"
            ? bioStep
              ? "Create account"
              : "Continue"
            : "Log in"}
        </button>

        {currState === "Sign up" && (
          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I agree to the terms of use and privacy policy
          </label>
        )}

        <p className="text-sm text-gray-400">
          {currState === "Sign up" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => switchState("Login")} className="font-medium text-violet-400 cursor-pointer">
                Log in
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span onClick={() => switchState("Sign up")} className="font-medium text-violet-400 cursor-pointer">
                Create an account
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
