import { RegisterForm } from "./components/RegisterForm";

export const Register = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border)] bg-white/90 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Create account
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text-h)]">
            Register
          </h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
