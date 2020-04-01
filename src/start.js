import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;

console.log(location.pathname);

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <img className="nav-logo" src="corona-love.png"></img>;
}

ReactDOM.render(elem, document.querySelector("main"));
