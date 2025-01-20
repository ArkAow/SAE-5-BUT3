import React from "react";
import AppRoutes from "./Routes/AppRoutes"; // Importer vos routes
import { UserProvider } from "./contexts/UserContext"; // Importer le UserProvider

function App() {
  return (
    <div className="App" style={{ WebkitAppRegion: "no-drag" }}>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </div>
  );
}

export default App;
