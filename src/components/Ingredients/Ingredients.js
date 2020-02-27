import React, { useReducer, useCallback, useMemo, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (current, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...current, action.ingredient];
    case "DELETE":
      return current.filter(ing => ing.id !== action.id);
    default:
      console.log("[Ingredients] Should not reach this error");
      console.log(action);

      return new Error();
  }
};

function Ingredients() {
  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendIt,
    extra,
    identifier,
    clear
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: extra });
    } else if (!isLoading && !error && identifier === "ADD_INGREDIENT") {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...extra } });
    }
  }, [data, extra, identifier, error, isLoading]);

  const filterHandler = useCallback(filtered => {
    dispatch({ type: "SET", ingredients: filtered });
  }, []);

  const removeIngredientHandler = useCallback(
    id => {
      sendIt(
        `https://react-hooks-http-requests.firebaseio.com/ingredients/${id}.json`,
        "DELETE",
        null,
        id,
        "REMOVE_INGREDIENT"
      );
    },
    [sendIt]
  );
  const addIngredientHandler = useCallback(
    ingredient => {
      sendIt(
        `https://react-hooks-http-requests.firebaseio.com/ingredients.json`,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        "ADD_INGREDIENT"
      );
    },
    [sendIt]
  );
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [ingredients, removeIngredientHandler]);
  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm add={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoad={filterHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
