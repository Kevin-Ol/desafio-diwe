import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AllContacts from "./pages/AllContacts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/contacts/list" element={<AllContacts />} />
    </Routes>
  );
}

export default App;
