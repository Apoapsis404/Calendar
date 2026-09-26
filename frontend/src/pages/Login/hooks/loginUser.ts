import { useCallback, useEffect, useState } from "react";
import {
  login,
  type LoginUser,
  type LoginUserData,
} from "../../../api/services/auth";

interface LoginUserResult {
  loginUser: LoginUser | null;
  loading: boolean;
  error: Error | null;
}

export const useLoginUser = (
  loginUserData: LoginUserData | null,
): LoginUserResult => {
  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const loginRequest = useCallback(async () => {
    if (!loginUserData) {
      setLoginUser(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await login(loginUserData);
      setLoginUser(response);
      localStorage.setItem("loginUser", JSON.stringify(response));
      localStorage.setItem("userId", response.user_id);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
      setLoginUser(null);
    } finally {
      setLoading(false);
    }
  }, [loginUserData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loginRequest();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loginRequest]);

  return {
    loginUser,
    loading,
    error,
  };
};
