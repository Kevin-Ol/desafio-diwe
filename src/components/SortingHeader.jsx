import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useContacts } from "../context/ContactsContext";

function SortingHeader({ header }) {
  const { sortContacts } = useContacts();

  const [order, setOrder] = useState("desc");

  const handleSort = () =>
    setOrder((oldOrder) => (oldOrder === "asc" ? "desc" : "asc"));

  useEffect(() => {
    sortContacts(header.name, order);
  }, [order]);

  return (
    <td role="gridcell" name={header.name} onClick={handleSort}>
      {header.field}
    </td>
  );
}

export default SortingHeader;

SortingHeader.propTypes = {
  header: PropTypes.shape({
    name: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
  }).isRequired,
};
