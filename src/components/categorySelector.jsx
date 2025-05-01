import React, { useState, useEffect } from "react";
import { fetchCategories } from "../services/TriviaApi";
import { useNavigate } from "react-router-dom";

const CategorySelector = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      const cachedCategories = localStorage.getItem("triviaCategories");

      if (cachedCategories) {
        setCategories(JSON.parse(cachedCategories));
        return;
      }

      try {
        const data = await fetchCategories();
        if (!data.length) throw new Error("No se encontraron categorías.");
        localStorage.setItem("triviaCategories", JSON.stringify(data));
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
        setError("No se pudieron cargar las categorías. Intenta de nuevo más tarde.");
      }
    };

    loadCategories();
  }, []);
  const handleReload = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">
        {error}
        <button onClick={handleReload} className="btn btn-warning mt-2">Volver al Inicio</button>
      </div>
    );
  }

  const handleStartGame = () => {
    if (!selectedCategory) {
      setError("Por favor, selecciona una categoría.");
      return;
    }
    console.log("Iniciando juego con categoría:", selectedCategory, "y dificultad:", selectedDifficulty);
    navigate("/game", { state: { category: selectedCategory, difficulty: selectedDifficulty } });
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!categories.length) return <div>Cargando categorías...</div>;

  return (
    <div className="container mt-4">
      <h3>Elige una categoría y dificultad</h3>

      <select onChange={(e) => setSelectedCategory(e.target.value)} className="form-select mb-3">
        <option value="">Selecciona una categoría</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedDifficulty(e.target.value)} className="form-select mb-3">
        <option value="easy">Fácil</option>
        <option value="medium">Medio</option>
        <option value="hard">Difícil</option>
      </select>

      <button onClick={handleStartGame} className="btn btn-primary">Iniciar Trivia</button>
    </div>
    
  );
  
};

export default CategorySelector;
