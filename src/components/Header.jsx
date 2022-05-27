import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Header({ link }) {
  return (
    <header>
      <Link to={link}>Voltar</Link>
    </header>
  );
}

export default Header;

Header.propTypes = {
  link: PropTypes.string.isRequired,
};
