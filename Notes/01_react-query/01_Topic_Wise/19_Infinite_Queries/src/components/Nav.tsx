import React from "react";
import { Link } from "react-router-dom";

const Nav = (): React.JSX.Element => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/super-heroes">Traditional Super Heroes</Link>
          </li>
          <li>
            <Link to="/rq-super-heroes">RQ Super Heroes</Link>
          </li>
          <li>
            <Link to="/rq-parallel">Parallel Queries</Link>
          </li>
          <li>
            <Link to="/rq-dynamic-parallel">Dynamic Parallel Queries</Link>
          </li>
          <li>
            <Link to="/rq-dependent">Dependent Queries</Link>
          </li>
          <li>
            <Link to="/rq-paginated">Paginated Queries</Link>
          </li>
          <li>
            <Link to="/rq-infinite">Infinite Queries</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Nav;
