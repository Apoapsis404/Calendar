import { useState } from "react";
import type { LoginUserData } from "../../../api/services/auth";
import { useLoginUser } from "../hooks/loginUser";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginUserData, setLoginUserData] = useState<LoginUserData | null>(
    null,
  );
  const { loginUser, loading, error } = useLoginUser(loginUserData);
  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

  function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    const tmpLoginUser: LoginUserData = {
      username,
      password,
    };
    setLoginUserData(tmpLoginUser);
    console.log(loginUser);
    navigate("/calendar", {
      state: { from: "login", flash: "Calendar" },
    });
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text-h)]">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-3 py-2.5 text-[var(--color-text-h)] placeholder:text-slate-400 outline-none transition focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--color-accent-bg)]"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text-h)]">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-3 py-2.5 text-[var(--color-text-h)] placeholder:text-slate-400 outline-none transition focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--color-accent-bg)]"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        Login
      </button>
    </form>
  );
};
