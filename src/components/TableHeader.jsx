import PropTypes from "prop-types";
import SortingHeader from "./SortingHeader";

function TableHeader({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <SortingHeader key={header.name} header={header} />
        ))}
        <th name="actions">Ações</th>
      </tr>
    </thead>
  );
}

export default TableHeader;

TableHeader.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
    })
  ).isRequired,
};
