import React from 'react'
import {ProgressSpinner} from "primereact/progressspinner";

function Loading() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <ProgressSpinner className="p-d-block p-mx-auto" style={{width: '50px', height: '50px'}}
                             strokeWidth="8" fill="#EEEEEE" animationDuration=".8s"/>
        </div>
    )
}

export default Loading;