import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar"   
import AppRoutes from "./routes/AppRoutes";


/*
  App Component
  -------------
  Root component of the application.

  Responsibilities:
  - Loads routing system
  - Acts as entry point for entire frontend

  All pages and navigation are handled inside AppRoutes
*/

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />;
    </BrowserRouter>
  );    
}

export default App;