import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import pfp from './assets/pfp.jpeg';
import ldilogow from './assets/lexdoitlogowhite.png';

function First() {
    const location = useLocation();

    return (
        <>
            <div className="first">
            <a href="https://lexmeet.com/" target="_blank" rel="noopener noreferrer" className='lexdoit'>
            <h1 className="head">
                <img className="ldilogow" src={ldilogow} alt="" />
                <span className="lex">Lex</span>
                <span className="doit">DoIt!</span>
            </h1>
            </a>
                <div className="inFirst">
                    <nav>
                        <ul>
                            <li>
                                <Link
                                
                                    to="/dashboard"
                                    className={location.pathname === '/dashboard' ? 'selected' : ''}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/notes"
                                    className={location.pathname === '/notes' ? 'selected' : ''}
                                >
                                    Notes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/trash"
                                    className={location.pathname === '/trash' ? 'selected' : ''}
                                >
                                    Trash
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className='eloissa'>
                        <img className="pfp" src={pfp} alt="Profile" />
                        <p id="eloissaf">Eloissa Francisco</p>
                        <p id="eloissa">@mselletoe</p>
                    </div>
                    
                </div>
            </div>
        </>
    );
}

export default First;
