export const fetchQuestions = async (category, difficulty, retryCount = 0) => {
  const catNumber = parseInt(category);
  if (catNumber < 9 || catNumber > 32) {
    throw new Error("Categoría inválida. Debe ser un ID de categoría válido (9-32).");
  }
  if (!["easy", "medium", "hard"].includes(difficulty)) {
    throw new Error('Dificultad inválida. Debe ser "easy", "medium" o "hard".');
  }

  try {
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
    );



    const data = await response.json();
    console.log("Preguntas obtenidas en TriviaApi:", data.results);


      if (!Array.isArray(data.results) || data.results.length === 0) {
        console.warn("No se encontraron preguntas para esta combinación.");
        return []; // simplemente devolvemos un array vacío
      }
      
      console.log("Preguntas DAATA en TriviaApi:", data);
      if (
        !data.results.every(
          (q) => q.question && q.correct_answer && Array.isArray(q.incorrect_answers)
        )
      ) {
        throw new Error("Algunas preguntas no tienen la estructura esperada.");
      }
      

    return data.results;
  } catch (error) {
    console.error("Error en fetchQuestions:", error);
    throw error; // Lanza el error para que sea manejado en Game.jsx
  }
};

/**
 * Obtiene las categorías disponibles de Open Trivia Database.
 * @returns {Promise<Array<Object>>} - Arreglo de categorías o vacío si falla.
 */
export const fetchCategories = async () => {
  try {
    const response = await fetch("https://opentdb.com/api_category.php");
    if (!response.ok) {
      throw new Error(
        `Error al obtener categorías: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const categories = data?.trivia_categories;

    if (!Array.isArray(categories)) {
      throw new Error("La API no devolvió categorías válidas.");
    }

    return categories;
  } catch (error) {
    console.error("Error en fetchCategories:", error);
    return [];
  }
};