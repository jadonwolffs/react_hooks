import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  useEffect(()=>{
    fetch("https://react-hooks-http-requests.firebaseio.com/ingredients.json").then(response=>response.json()).then(
    responseData=>{
      const loaded =[];
      for (const key in responseData) {
          loaded.push({
            id:key,
            title:responseData[key].title,
            amount:responseData[key].amount
          })
          setIngredients(loaded);
          
      }
    }
  )
  },[]);
  
  const removeIngredientHandler = id => {
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== id)
    );
    console.log(ingredients);
  };
  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-http-requests.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        setIngredients(prevIngredients => [
          ...prevIngredients,
          {
            id: responseData.name,
            ...ingredient
          }
        ]);
      });

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
