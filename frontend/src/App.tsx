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
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <button onClick={() => setIsModalOpen(true)}>Logout</button>
      </header>
      <Outlet />
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
