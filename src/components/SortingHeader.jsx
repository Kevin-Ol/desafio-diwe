import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useContacts } from "../context/ContactsContext";
import ChevronDown from "../assets/chevron-down.svg";
import ChevronUp from "../assets/chevron-up.svg";

function SortingHeader({ header }) {
  const { sortContacts } = useContacts();

  const [order, setOrder] = useState("desc");

  const handleSort = () =>
    setOrder((oldOrder) => (oldOrder === "asc" ? "desc" : "asc"));

  useEffect(() => {
    sortContacts(header.name, order);
  }, [order]);

  return (
    <th role="gridcell" name={header.name} onClick={handleSort}>
      {header.field}
      {order === "desc" ? (
        <img src={ChevronDown} alt="Ícone representando ordem descrescente" />
      ) : (
        <img src={ChevronUp} alt="Ícone representando ordem crescente" />
      )}
    </th>
  );
}

export default SortingHeader;

SortingHeader.propTypes = {
  header: PropTypes.shape({
    name: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
};
