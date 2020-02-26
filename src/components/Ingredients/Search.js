import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo(props => {
  const { onLoad } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        //value when timeout originally ran === current
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://react-hooks-http-requests.firebaseio.com/ingredients.json" +
            query
        )
          .then(response => response.json())
          .then(responseData => {
            const loaded = [];
            for (const key in responseData) {
              loaded.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              });
            }
            onLoad(loaded);
          });
      }
    }, 500);
    return ()=>{
      clearTimeout(timer);
    }
  }, [enteredFilter, onLoad, inputRef]);
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
