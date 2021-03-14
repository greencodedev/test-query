import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import queryString from 'query-string';

import './App.css';
import { mockData } from './mock/mockData';

function App() {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState([]);

  const history = useHistory();
  console.log("history => ", history);

  function compareQuery(arr, queries) {
    var flag = true;
    if (queries.length == 1 && queries[0] == "") return flag;
    queries.map(query => {
      flag = flag && arr.includes(query);
    })
    return flag;
  }

  function searchData(query) {
    var temp = [];
    const queries = query.q ? query.q.split(",") : [""];
    const comps = query.co ? query.co.split(",") : [""];
    const positions = query.pos ? query.pos.split(",") : [""];

    mockData.map(item => {
      if (compareQuery(item.title, queries) && compareQuery(item.companies, comps) && compareQuery(item.positions, positions))
        temp.push(item);
    })
    return temp;
  }

  function makeQueryArr(query) {
    var queryArr = [];
    Object.values(query).map(item => {
      if (item !== "")
        queryArr = queryArr.concat(item.split(","));
    });
    return queryArr;
  }

  useEffect(() => {
    const query = queryString.parse(window.location.search);
    setFilters(makeQueryArr(query));
    const result = searchData(query);
    setResults(result);
  }, []);

  const reset = () => {
    window.location.href = "/";
  }
  return (
    <div className="App">
      <h1>Questions</h1>
      <div className="filters-area">
        {
          filters.length !== 0 && 
          <div className="filter-items">
            {
              filters.map((item, index) => {
                return (
                  <div className="filter-item" key={index}> 
                    <span className="query">{item}</span>
                  </div>
                );
              })
            }
            <button onClick={reset} className="reset-btn">Reset</button>
          </div>
        }
      </div>
      <div className="result-area">
        {
          results.length !== 0 &&
          <div className="result-items">
            {
              results.map((item, index) => {
                return (
                  <div className="result-item" key={index}>
                    <span className="title">{item.title}</span>
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    </div>
  );
}

export default App;
