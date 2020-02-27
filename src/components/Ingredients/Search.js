import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

import "./Search.css";

const Search = React.memo(props => {
  const { onLoad } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();
  const { isLoading, data, error, sendIt, clear } = useHttp();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        //value when timeout originally ran === current
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendIt(
          "https://react-hooks-http-requests.firebaseio.com/ingredients.json" +
            query,
          "GET"
        );
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef,sendIt]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loaded = [];
      for (const key in data) {
        loaded.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoad(loaded);
    }
  }, [data, isLoading, error, onLoad]);
  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>...</span>}
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
