import React from "react";
import CategorySelector from "../components/categorySelector";

const Home = () => {
  return (
    <div className="container mt-5" role="main" aria-labelledby="home-title">
      <div className="text-center mb-4">
        <h1 id="home-title" className="display-4">
          Juego de Trivia
        </h1>
        <p className="lead" aria-describedby="home-description">
          Pon a prueba tus conocimientos
        </p>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <CategorySelector />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);