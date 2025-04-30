import React from "react";
import PropTypes from "prop-types";
import he from "he";



const Question = ({ question, questionNumber, totalQuestions }) => {
  const isValid =
    typeof question === "string" &&
    Number.isInteger(questionNumber) &&
    questionNumber > 0 &&
    Number.isInteger(totalQuestions) &&
    totalQuestions >= questionNumber;

  if (!isValid) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: Datos de pregunta inválidos.
      </div>
    );
  }

  const decodedQuestion = he.decode(question);

  return (
    <div
      className="card p-4 mb-4"
      role="region"
      aria-label={`Pregunta ${questionNumber} de ${totalQuestions}`}
    >
      <h3 className="card-title">
        Pregunta {questionNumber} de {totalQuestions}
      </h3>
      <p className="card-text">{decodedQuestion}</p>
    </div>
  );
};

Question.propTypes = {
  question: PropTypes.string.isRequired,
  questionNumber: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
};

export default React.memo(Question);