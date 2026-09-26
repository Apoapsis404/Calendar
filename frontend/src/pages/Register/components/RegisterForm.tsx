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
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
