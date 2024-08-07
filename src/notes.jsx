import React from 'react';
import undercons from './assets/undercons.png';

function Notes() {
    return (
        <>
            <div class="outer-container">
                <div className="notes">
            <div className="nonotes">
                <img className="undercons" src={undercons} alt="" />
                <h2>Uh-oh!</h2>
                <p>This page is under construction.</p>
            </div>
        </div>
            </div>
        
        
        </>
        
    );
}

export default Notes;
