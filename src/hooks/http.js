import { useReducer, useCallback } from "react";
const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};
const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case "ERROR":
      return { loading: false, error: action.error };
    case "CLEAR":
      return initialState;
    default:
      console.log("[httpReducer] Should not reach this error ");
      console.log(action);
      return new Error();
  }
};

const useFetch = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const clear = useCallback(() => {
    dispatchHttp({ type: "CLEAR" });
  }, []);
  const sendIt = useCallback((url, method, body, reqExtra, identifier) => {
    dispatchHttp({ type: "SEND", identifier: identifier });
    fetch(url, {
      method: method,
      body: body,
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        dispatchHttp({
          type: "RESPONSE",
          responseData: responseData,
          extra: reqExtra
        });
      })
      .catch(error => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  }, []);
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendIt: sendIt,
    extra: httpState.extra,
    identifier: httpState.identifier,
    clear: clear
  };
};
export default useFetch;
