import React, { useState, useEffect } from 'react';
import todoman from './assets/todoman.png';

function ConfirmationMessage({ message, onConfirm, onCancel }) {
    return (
        <div className="overlay">
            <div className="conmessage">
                <p>{message}</p>
                <button className="submitButton" onClick={onConfirm}>Confirm</button>
                <button className="cancelButton" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

function Trash() {
    const [deletedTasks, setDeletedTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false); 
    const [actionType, setActionType] = useState(''); 

    useEffect(() => {
        const tasksFromStorage = JSON.parse(localStorage.getItem('deletedTasks')) || [];
        setDeletedTasks(tasksFromStorage);
    }, []);

    const handleSelectTask = (index) => {
        setSelectedTasks(prevSelectedTasks => {
            const isSelected = prevSelectedTasks.includes(index);
            if (isSelected) {
                return prevSelectedTasks.filter(taskIndex => taskIndex !== index);
            } else {
                return [...prevSelectedTasks, index];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedTasks.length === deletedTasks.length) {
            setSelectedTasks([]); 
        } else {
            setSelectedTasks(deletedTasks.map((_, index) => index));
        }
    };

    const showConfirmation = (type) => {
        setActionType(type);
        setShowConfirm(true);
    };

    const deleteSelectedTasks = () => {
        const updatedTasks = deletedTasks.filter((_, index) => !selectedTasks.includes(index));
        localStorage.setItem('deletedTasks', JSON.stringify(updatedTasks));
        setDeletedTasks(updatedTasks);
        setSelectedTasks([]); 
    };

    const deleteAllTasks = () => {
        localStorage.removeItem('deletedTasks');
        setDeletedTasks([]);
        setSelectedTasks([]);
    };

    const handleConfirm = () => {
        if (actionType === 'deleteAll') {
            deleteAllTasks();
        } else if (actionType === 'deleteSelected') {
            deleteSelectedTasks();
        }
        setShowConfirm(false); 
    };

    const handleCancel = () => {
        setShowConfirm(false); 
    };

    return (
        <div className="outer-container">
            <div className="trashmainpage">
                {deletedTasks.length > 0 && <p id="trash">Trash</p>}

                {showConfirm && (
                    <ConfirmationMessage
                        message={`Are you sure you want to ${actionType === 'deleteAll' ? 'empty the trash' : 'permanently delete selected tasks'}?`}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}

                {deletedTasks.length === 0 ? (
                    <div className="nodlttask">
                        <img className="todoman" src={todoman} alt="" />
                        <p>Nothing to see here.</p>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => showConfirmation('deleteAll')} className="emptytrash">
                            Empty Trash
                        </button>
                        <button 
                            onClick={() => showConfirmation('deleteSelected')} 
                            className={`deleteforever ${selectedTasks.length === 0 ? 'disabled' : ''}`}
                            disabled={selectedTasks.length === 0}
                        >
                            Delete Forever
                        </button>

                        <table className="deletedlist">
                            <thead>
                                <tr>
                                    <th className="select-column">
                                        <input
                                            className="selecthead"
                                            type="checkbox"
                                            checked={selectedTasks.length === deletedTasks.length}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="namehead">Name</th>
                                    <th className="statushead">Status</th>
                                    <th className="duehead">Due</th>
                                    <th className="priohead">Priority</th>
                                </tr>
                            </thead>

                            <tbody>
                                {deletedTasks.map((task, index) => (
                                    <tr key={index}>
                                        <td className="select-column">
                                            <input
                                                className="selecthead"
                                                type="checkbox"
                                                checked={selectedTasks.includes(index)}
                                                onChange={() => handleSelectTask(index)}
                                            />
                                        </td>
                                        <td>{task.name || 'Untitled'}</td>
                                        <td className={`deleted-status-text deleted-status-${task.status?.replace(" ", "-").toLowerCase()}`}>
                                            {task.status || 'No Status'}
                                        </td>
                                        <td>{task.due || 'No Due'}</td>
                                        <td className={`deleted-priority-text deleted-priority-${task.priority?.toLowerCase() || 'placeholder'}`}>
                                            {task.priority || 'No Priority'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Trash;
