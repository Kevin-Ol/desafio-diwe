import {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ContactsContext = createContext({});

export function ContactsProvider({ children }) {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("contacts");
        setContacts(data);
      } catch (error) {
        const { status } = error.response;
        if (status === 401) {
          global.alert("Usuário não autenticado");
        } else {
          global.alert("Erro no sistema, tente novamente mais tarde");
        }
        navigate("/");
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  const deleteContact = useCallback((id) => {
    setContacts((oldContacts) =>
      oldContacts.filter((contact) => contact.id !== id)
    );
  }, []);

  const value = useMemo(
    () => ({
      contacts,
      loading,
      deleteContact,
    }),
    [contacts, loading, deleteContact]
  );

  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  );
}

export const useContacts = () => useContext(ContactsContext);

ContactsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};
