import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ArrowLeft from "../assets/arrow-left.svg";
import "../styles/Header.scss";

function Header({ link }) {
  return (
    <header>
      <Link to={link}>
        <img src={ArrowLeft} alt="Ícone representando seta para voltar" />
        Voltar
      </Link>
    </header>
  );
}

export default Header;

Header.propTypes = {
  link: PropTypes.string.isRequired,
};
