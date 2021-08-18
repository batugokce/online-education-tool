import React from "react";

export function generateRandomNumber() {
    return Math.floor(Math.random() * 10000000 ) + 1000;
}

export function getEditorSimpleHeader() {
    return (
        <span className="ql-formats">
            <button className="ql-bold" aria-label="Bold"/>
            <button className="ql-italic" aria-label="Italic"/>
            <button className="ql-underline" aria-label="Underline"/>
        </span>
    );
}