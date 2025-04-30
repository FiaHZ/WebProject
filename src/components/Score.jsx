import React from "react";
import PropTypes from "prop-types";
import he from "he";

const Score = ({ score, correctAnswers, totalQuestions, percentage }) => {
  const isValid =
    Number.isInteger(score) &&
    score >= 0 &&
    Number.isInteger(correctAnswers) &&
    correctAnswers >= 0 &&
    Number.isInteger(totalQuestions) &&
    totalQuestions >= 0 &&
    correctAnswers <= totalQuestions &&
    percentage >= 0 &&
    percentage <= 100;

  if (!isValid) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: Datos de puntuación inválidos.
      </div>
    );
  }

  const formattedPercentage = percentage.toFixed(1);

  return (
    <div
      className="card p-3 mb-3"
      role="region"
      aria-label="Resumen de puntuación"
    >
      <h4 className="card-title">Puntuación: {score}</h4>
      <p className="card-text">
        Respuestas correctas: {correctAnswers} de {totalQuestions}
      </p>
      <p className="card-text">Porcentaje de aciertos: {formattedPercentage}%</p>
    </div>
  );
};

Score.propTypes = {
  score: PropTypes.number.isRequired,
  correctAnswers: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
};

export default React.memo(Score);