import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Score from "../components/Score";
import SocialShare from "../components/SocialShare";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score = 0, correctAnswers = 0, totalQuestions = 0 } =
    location.state || {};

  const isValid =
    Number.isInteger(score) &&
    score >= 0 &&
    Number.isInteger(correctAnswers) &&
    correctAnswers >= 0 &&
    Number.isInteger(totalQuestions) &&
    totalQuestions >= 0 &&
    correctAnswers <= totalQuestions;

  if (!isValid) {
    return (
      <div className="container mt-5" role="main" aria-labelledby="results-error-title">
        <div className="text-center">
          <h2 id="results-error-title">Error</h2>
          <div className="alert alert-danger" role="alert">
            Los datos de la partida son inválidos. Por favor, inicia una nueva partida.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/home")}
            aria-label="Volver al inicio"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const formattedPercentage = parseFloat(percentage.toFixed(1));
  const cardClass =
    formattedPercentage >= 80
      ? "border-success"
      : formattedPercentage >= 50
      ? "border-warning"
      : "border-danger";

  return (
    <div className="container mt-5" role="main" aria-labelledby="results-title">
      <div className="text-center">
        <h2 id="results-title" className="mb-4">
          Resultados Finales
        </h2>
        <div className={`card p-4 mt-3 ${cardClass}`}>
          <Score
            score={score}
            correctAnswers={correctAnswers}
            totalQuestions={totalQuestions}
            percentage={formattedPercentage}
          />
          <SocialShare score={score} percentage={formattedPercentage} />
          <div className="mt-4">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/home")}
              aria-label="Jugar de nuevo"
            >
              Jugar de Nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Results.propTypes = {};

export default React.memo(Results);