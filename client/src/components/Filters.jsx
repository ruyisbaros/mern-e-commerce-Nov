import React from "react";

const Filters = ({
  products,
  categories,
  setCallback,
  setCategory,
  setSort,
  setSearch,
  setPage,
}) => {
  return (
    <div className="filetrs-main">
      <div className="filter_content">
        <span>Filter:</span>
        <select name="category" id=""></select>
      </div>
    </div>
  );
};

export default Filters;
