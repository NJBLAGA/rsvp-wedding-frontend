import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 class="text-3xl font-bold underline text-teal-500">
        {" "}
        Hello world! -- Nathan James Blaga{" "}
      </h1>
    </>
  );
}

export default App;
