import { useCallback, useEffect, useState } from "react";
import {
  register,
  type RegisterUserData,
  type RegisterUserResponse,
} from "../../../api/services/auth";

interface RegisterUserResult {
  registerUser: RegisterUserResponse | null;
  loading: boolean;
  error: Error | null;
}

export const useRegisterUser = (
  registerUserData: RegisterUserData | null,
): RegisterUserResult => {
  const [registerUser, setRegisterUser] = useState<RegisterUserResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const registerUserRequest = useCallback(async () => {
    if (!registerUserData) {
      setRegisterUser(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await register(registerUserData);
      setRegisterUser(response);
    } catch (err) {
      setError(err as Error);
      setRegisterUser(null);
    } finally {
      setLoading(false);
    }
  }, [registerUserData]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      registerUserRequest();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [registerUserRequest]);

  return {
    registerUser,
    loading,
    error,
  };
};
