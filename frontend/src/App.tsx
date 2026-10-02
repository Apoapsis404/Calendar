import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Modal } from "./components/Modal";
import { logoutUser } from "./pages/Login/hooks/logoutUser";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-text)">
      <header className="flex items-center gap-3 border-b border-(--color-border) bg-(--color-bg) px-6 py-4 shadow-[0_10px_15px_-3px_var(--shadow)]">
        <Link
          className="font-medium text-(--color-text-h) transition hover:text-(--color-accent)"
          to="/"
        >
          Home
        </Link>
        <Link
          className="font-medium text-(--color-text-h) transition hover:text-(--color-accent)"
          to="/register"
        >
          Register
        </Link>
        <Link
          className="font-medium text-(--color-text-h) transition hover:text-(--color-accent)"
          to="/login"
        >
          Login
        </Link>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="ml-auto rounded-md border border-(--color-accent-border) bg-(--color-accent-bg) px-3 py-2 text-sm font-medium text-(--color-text-h) transition hover:bg-(--color-accent) hover:text-white"
        >
          Logout
        </button>
      </header>

      <main
        className="mx-auto py-6"
        style={{
          width: "calc(100% - (var(--page-side-margin) * 2))",
          maxWidth: "1280px",
        }}
      >
        <Outlet />
      </main>

      <Modal
        isOpen={isModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
