import React from "react";
import PropTypes from "prop-types";

const Options = ({ options, handleAnswer, selectedAnswer }) => {
  // Validar opciones
  if (!Array.isArray(options) || options.length === 0) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: No se encontraron opciones válidas.
      </div>
    );
  }

  return (
    <div className="mb-3" role="group" aria-label="Opciones de respuesta">
      {options.map((option, index) => (
        <button
          key={index}
          className={`btn btn-outline-primary w-100 mb-2 ${
            selectedAnswer === option ? "active" : ""
          }`}
          onClick={() => handleAnswer(option)}
          disabled={selectedAnswer !== null}
          aria-pressed={selectedAnswer === option}
          aria-label={`Opción ${index + 1}: ${option}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

Options.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleAnswer: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.string,
};

Options.defaultProps = {
  selectedAnswer: null,
};

export default React.memo(Options);