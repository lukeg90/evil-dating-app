import React from "react";

export default function List({ elements, removeElement }) {
    const listItems = elements.map((element, index) => (
        <div className="editorListElement" key={index}>
            <span className="editorListText">{element}</span>
            <span className="editorRemoveListElement" onClick={removeElement}>
                x
            </span>
        </div>
    ));
    return <React.Fragment>{listItems}</React.Fragment>;
}
