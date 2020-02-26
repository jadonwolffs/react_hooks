import React, { useReducer, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientReducer = (current, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...current, action.ingredient];
    case "REMOVE":
      return current.filter(ing => ing.id !== action.id);
    default:
      return new Error();
  }
};
const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      return new Error();
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null
  });

  const filterHandler = useCallback(filtered => {
    dispatch({ type: "SET", ingredients: filtered });
  }, []);
  const removeIngredientHandler = useCallback(id => {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-http-requests.firebaseio.com/ingredients/${id}.jon`,
      {
        method: "DELETE"
      }
    )
      .then(response => {
        dispatchHttp({ type: "REPSONSE" });
        dispatch({ type: "REMOVE", id: id });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  }, []);
  const addIngredientHandler = useCallback(ingredient => {
    dispatchHttp({ type: "SEND" });
    fetch("https://react-hooks-http-requests.firebaseio.com/ingredients.jon", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        dispatchHttp({ type: "REPSONSE" });
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...ingredient }
        });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  }, []);
  const clearError = () => {
    dispatchHttp({ type: "CLEAR" });
  };
  const ingredientList = useMemo(()=>{
    return (
      <IngredientList
      ingredients={ingredients}
      onRemoveItem={removeIngredientHandler}
    />
    )
  },[ingredients,removeIngredientHandler]);
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        add={addIngredientHandler}
        loading={httpState.isLoading}
      />

      <section>
        <Search onLoad={filterHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
