import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const removeIngredientHandler = id => {
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== id)
    );
    console.log(ingredients);
  };
  const addIngredientHandler = ingredient => {
    setIngredients(prevIngredients => [
      ...prevIngredients,
      {
        id: Math.random().toString(),
        ...ingredient
      }
    ]);
    console.log(ingredients);
  };
  return (
    <div className="App">
      <IngredientForm add={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
