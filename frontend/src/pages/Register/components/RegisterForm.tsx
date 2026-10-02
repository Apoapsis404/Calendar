import { useState } from "react";
import type { RegisterUserData } from "../../../api/services/auth";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "../hooks/registerUser";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerUserData, setRegisterUserData] =
    useState<RegisterUserData | null>(null);
  const { registerUser, loading, error } = useRegisterUser(registerUserData);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {error.message}</div>;

  function handleRegister(e: React.SyntheticEvent) {
    e.preventDefault();
    const tmpRegisterUser: RegisterUserData = {
      username,
      email,
      password,
    };
    setRegisterUserData(tmpRegisterUser);
    console.log(registerUser);
    navigate("/login", {
      state: { from: "register", flash: "login" },
    });
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
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
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-text-h)]">
          Confirm password
        </label>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-border)] bg-slate-50 px-3 py-2.5 text-[var(--color-text-h)] placeholder:text-slate-400 outline-none transition focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[var(--color-accent-bg)]"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-[var(--color-accent)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
      >
        Register
      </button>
    </form>
  );
};
