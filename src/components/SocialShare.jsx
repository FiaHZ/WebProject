import React from "react";
import PropTypes from "prop-types"; 

const SocialShare = ({ score, percentage }) => {
  const isValid =
    Number.isInteger(score) &&
    score >= 0 &&
    percentage >= 0 &&
    percentage <= 100;

  if (!isValid) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: Datos de puntuación inválidos para compartir.
      </div>
    );
  }

  const appUrl = import.meta.env.VITE_APP_URL || "https://tu-app-de-trivia.com";
  const shareText = `¡Obtuve ${score} puntos y un ${(percentage || 0).toFixed(
    1
  )}% de aciertos en el juego de trivias! Juega ahora en: ${appUrl}`;
  const encodedText = encodeURIComponent(shareText);

  return (
    <div
      className="mt-3"
      role="region"
      aria-label="Opciones para compartir resultados"
    >
      <h5 className="mb-3">Comparte tus resultados</h5>
      <div className="d-flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedText}`}
          className="btn btn-info" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir puntuación en Twitter"
        >
          Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            appUrl
          )}&quote=${encodedText}`} 
          className="btn btn-primary" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir puntuación en Facebook"
        >
          Facebook
        </a>
        <a
          href={`https://api.whatsapp.com/send?text=${encodedText}`}
          className="btn btn-success" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir puntuación en WhatsApp"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
};

SocialShare.propTypes = {
  score: PropTypes.number.isRequired,
  percentage: PropTypes.number.isRequired,
};

export default React.memo(SocialShare);