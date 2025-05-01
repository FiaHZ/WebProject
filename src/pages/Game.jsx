import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/TriviaApi";
import { translateText } from "../services/TranslationApi";
import { Modal, Button } from "react-bootstrap";
import Question from "../components/Question";
import Options from "../components/Options";
import Score from "../components/Score";
import SocialShare from "../components/SocialShare";

const Game = () => {
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { category, difficulty } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Depuración: Mostrar los valores de category y difficulty al cargar el componente
  useEffect(() => {
    console.log("📌 Category recibida:", category);
    console.log("📌 Difficulty recibida:", difficulty);
  }, [category, difficulty]);


  useEffect(() => {
    loadAndTranslateQuestions();
  }, []); 

  const loadAndTranslateQuestions = async () => {
    let questions = [];

    setIsLoading(true);
    setLoadingMessage("Inicializando...");

    const storedQuestions = sessionStorage.getItem("questions");

    if (storedQuestions) {
      questions = JSON.parse(storedQuestions);
      console.log("✅ Preguntas encontradas en sessionStorage:", questions);
      setLoadingMessage("Recuperando preguntas guardadas...");
    } else {
      if (!category || !difficulty) {
        console.error("❌ category o difficulty no definidos.");
        setError("Configuración inválida: categoría o dificultad no definida.");
        setIsLoading(false);
        return;
      }

      setLoadingMessage("Descargando preguntas...");
      try {
        questions = await fetchQuestions(category, difficulty);
        console.log("✅ Preguntas descargadas desde API:", questions);
        sessionStorage.setItem("questions", JSON.stringify(questions));
      } catch (fetchError) {
        console.error("❌ Error al obtener preguntas:", fetchError);
        setError("Error al obtener preguntas.");
        setIsLoading(false);
        return;
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      console.warn("⚠️ No se encontraron preguntas para la categoría y dificultad elegidas.");
      setError("No se encontraron preguntas disponibles. Intenta con otra categoría o dificultad.");
      setIsLoading(false);
      return;
    }

    try {
      setLoadingMessage("Preparando traducción...");
      const textsToTranslate = questions
        .map((q) => [q.question, q.correct_answer, ...q.incorrect_answers])
        .flat();

      const uniqueTexts = [...new Set(textsToTranslate)];
      const joinedText = uniqueTexts.join(" | ");

      console.log("Texto a traducir:", joinedText);

      setLoadingMessage("Traduciendo preguntas y respuestas...");
      let translatedText = "";
      try {
        translatedText = await translateText(joinedText);
        setLoadingMessage("Procesando traducción...");
      } catch (translationError) {
        console.error("❌ Falló la traducción, seguimos en inglés:", translationError);
        setLoadingMessage("Error en traducción, usando textos en inglés...");
        translatedText = joinedText;
      }

      const translatedArray = translatedText.split(" | ").map((t) => t.trim());

      const translationMap = {};
      uniqueTexts.forEach((original, idx) => {
        translationMap[original] = translatedArray[idx] || original;
      });

      setLoadingMessage("Aplicando traducciones...");
      const translatedQuestions = questions.map((q) => ({
        ...q,
        question: translationMap[q.question],
        correct_answer: translationMap[q.correct_answer],
        incorrect_answers: q.incorrect_answers.map((ans) => translationMap[ans]),
        options: shuffleArray([...q.incorrect_answers.map((ans) => translationMap[ans]), translationMap[q.correct_answer]]),
      }));

      setQuestions(translatedQuestions);
      sessionStorage.setItem("questions", JSON.stringify(translatedQuestions));
      sessionStorage.setItem("translated", "true");
      setLoadingMessage("¡Listo!");
    } catch (err) {
      console.error("❌ Error al traducir preguntas:", err);
      setQuestions(questions);
      sessionStorage.setItem("questions", JSON.stringify(questions));
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setLoadingMessage("");
      }, 500);
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      const timeLimit =
        difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
      setTimeLeft(timeLimit);

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, questions]);

  const handleEndGame = () => {
    setGameFinished(true);
    // Limpiar sessionStorage al finalizar el juego para que la próxima partida cargue nuevas preguntas
    sessionStorage.removeItem("questions");
    sessionStorage.removeItem("translated");

  };

  const handleAnswerSelection = (selectedOption) => {
    setSelectedAnswer(selectedOption);

    if (selectedOption === questions[currentQuestion]?.correct_answer) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
      nextQuestion();
    } else {
      setShowModal(true);
    }
  };

  const nextQuestion = () => {
    setShowModal(false);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameFinished(true);
    }
  };

  if (gameFinished) {
    return (
      <div className="container mt-5 text-center">
        <h2>Resumen de la partida</h2>
        <p>Puntuación: {score}</p>
        <p>Preguntas respondidas: {currentQuestion}</p>
        <SocialShare
          score={score}
          percentage={parseFloat(
            ((correctAnswers / questions.length) * 100).toFixed(1)
          )}
        />
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status"></div>
        <p className="mt-3">{loadingMessage || "Cargando preguntas..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Volver al inicio
        </button>
      </div>
    );
  }
  const limpiar = () => {
    sessionStorage.removeItem("questions");
    sessionStorage.removeItem("translated");
    
    navigate("/");
  };

  if (questions.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-warning">No hay preguntas disponibles.</div>
        <button className="btn btn-primary" onClick={() => limpiar()}>
          Volver al inicio
        </button>
      </div>
    );
  }


  return (
    <div className="container mt-5">
      <p>Tiempo restante: {timeLeft} segundos</p>
      <Question
        question={
          questions[currentQuestion]?.question || "Pregunta no disponible"
        }
        questionNumber={currentQuestion + 1}
        totalQuestions={questions.length}
      />
      <Options
        options={questions[currentQuestion]?.options || []}
        handleAnswer={handleAnswerSelection}
        selectedAnswer={selectedAnswer}
      />
      <Score
        score={score}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        percentage={parseFloat(
          ((correctAnswers / questions.length) * 100).toFixed(1)
        )}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡Incorrecto!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          La respuesta correcta era:{" "}
          {questions[currentQuestion]?.correct_answer || "No disponible"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={nextQuestion}>
            Siguiente pregunta
          </Button>
        </Modal.Footer>
      </Modal>

      <button className="btn btn-primary mt-3" onClick={() => limpiar()}>
        Volver al inicio
      </button>
      <button className="btn btn-danger" onClick={handleEndGame}>
        Detener partida
      </button>
    </div>
  );
};

export default Game;