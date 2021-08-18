import React from "react";
import Keyword from "./keyword";

const KeywordList = (props) => {
    return props.keyWord.map((val, idx) => {

        return (
           <Keyword val={val} idx={idx}
                                   add={props.add}
                                   delete={props.delete}
                                   keyWord={props.keyWord}
                                   handleChange={props.handleChange}
           />
        );
    });
};
export default KeywordList;



