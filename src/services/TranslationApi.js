// Función que usa tanto MyMemory como Lingva Translate como fallbacks
export const translateText = async (text) => {
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    console.warn("Texto inválido para traducción:", text);
    return text;
  }

  // Comprobar longitud del texto (MyMemory tiene límite de 5000 caracteres por día)
  if (text.length > 5000) {
    console.warn("Texto demasiado largo para traducción:", text);
    return text;
  }

  // Intentar primero con MyMemory API
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|es`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`Error en MyMemory API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Verificar si la traducción fue exitosa
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      console.log("Texto traducido con MyMemory:", data.responseData.translatedText);
      return data.responseData.translatedText;
    } else {
      throw new Error("MyMemory API no devolvió una traducción válida");
    }
  } catch (myMemoryError) {
    console.warn("Error con MyMemory API, intentando con Lingva:", myMemoryError);
    
    // Si MyMemory falla, intentar con Lingva Translate como fallback
    try {
      // Usando la instancia pública de Lingva
      const response = await fetch(
        `https://lingva.ml/api/v1/en/es/${encodeURIComponent(text.trim())}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Error en Lingva API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && data.translation) {
        console.log("Texto traducido con Lingva:", data.translation);
        return data.translation;
      } else {
        throw new Error("Lingva API no devolvió una traducción válida");
      }
    } catch (lingvaError) {
      console.error("Error en ambas APIs de traducción:", lingvaError);
      return text; // Devuelve texto original si fallan ambas APIs
    }
  }
};