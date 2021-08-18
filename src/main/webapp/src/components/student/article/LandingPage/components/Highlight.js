import React from 'react';
import './Highlight.css';

const Highlight =  ({ saveAndRestoreSelection, hidden, layout }) => (
  <div hidden={hidden}
    style={{
      position: layout.position,
      left: layout.left,
      top: layout.top - 150,
      width: `${layout.widthInPixel}px`,
      height: `${layout.heightInPixel}px`
    }}
  >
    <div className="buttons-group">
      <button
        onClick={saveAndRestoreSelection}
        className="buttons-group__comment-btn">
      
        comment
      </button>
      <div className="buttons-group__down-arrow-tip"></div>
    </div>
  </div>
);

export default Highlight;
