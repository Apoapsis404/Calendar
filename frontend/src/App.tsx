import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <header style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </header>
      <Outlet />
    </div>
  );
}

export default App;
