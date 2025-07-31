import React from "react";

const DataRetrievalError = () => {
  return (
    <>
      <i className="material-symbols-outlined thin md-l">sync_problem</i>
      <p>Datenabruf fehlgeschlagen</p>
      <p>Versuchen Sie es später erneut</p>
    </>
  );
};

export default DataRetrievalError;
