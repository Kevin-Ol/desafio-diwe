import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AllContacts from "./pages/AllContacts";
import NewContact from "./pages/NewContact";
import { ContactsProvider } from "./context/ContactsContext";
import "./styles/App.scss";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/contacts/list"
        element={
          <ContactsProvider>
            <AllContacts />
          </ContactsProvider>
        }
      />
      <Route path="/contacts/create" element={<NewContact />} />
    </Routes>
  );
}

export default App;
