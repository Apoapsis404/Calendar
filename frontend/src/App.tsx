import "./css/App.css";
import { getHealth } from "./services/api";

function App() {
  async function onHealthClick() {
    const health = await getHealth();
    console.log(health);
  }

  return (
    <div>
      <button onClick={onHealthClick}>health</button>
    </div>
  );
}

export default App;
