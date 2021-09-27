import React, { useState } from "react";
import "./App.css";
import Weather from "./Components/Weather";

function App() {
  const [weatherData, setWeatherData] = useState<any>({
    name: "Madrid",
    prop: "lon=-3.7037902&lat=40.4167754",
  });
  return (
    <div className="App">
      <Weather value={weatherData} />
    </div>
  );
}

export default App;
