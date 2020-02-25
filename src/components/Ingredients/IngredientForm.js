import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo(props => {
  const [stateTitle, setStateTitle] = useState("");
  const [stateAmount, setStateAmount] = useState("");  
  const submitHandler = event => {
    event.preventDefault();
    props.add({title:stateTitle,amount:stateAmount});
    
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={stateTitle}
              onChange={event => {
                setStateTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={stateAmount}
              onChange={event => {
                setStateAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
