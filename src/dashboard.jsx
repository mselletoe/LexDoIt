import React, { useState, useRef, useEffect } from 'react';
import todobook from './assets/todobook.png';
import notaskimg from './assets/todoplate.png';
import todoicon from './assets/todoicon.png';
import githublogo from './assets/githublogo.png';
import RealTimeClock from './dateandtime.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faCalendarDays, faTrashCan, faTimes, faCheck, faFire } from '@fortawesome/free-solid-svg-icons';


function ValidationMessage({ message, onClose }) {
  return (
    <div className="overlay">
      <div className="valmessage">
        <p>{message}</p>
        <button className="okbutton" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

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

function AddTaskModal({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Pending');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = () => {
    if (name.trim() === '') {
      setShowValidation(true);
    } else {
      onSubmit({ name, status, due, priority });
      setShowValidation(false);
    }
  };

  return (
    <>
    <div className="overlay">
      <div className="overlaycontent">
        <button className="close-button" onClick={onCancel}><FontAwesomeIcon icon={faTimes} className="close-button-icon"/></button>
        <label className='nameLabel'>
          <input type="text" value={name} placeholder="Untitled" onChange={(e) => setName(e.target.value)} />
        </label>
        <label className='statusLabel'>
          Status
          <select className='selectstatus' value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>
        <label className='priorityLabel'>
          Priority
          <select className='selectprio' value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>
        <label className='dueLabel'>
          Due
          <input type="datetime-local" value={due} onChange={(e) => setDue(e.target.value)} />
        </label>
        <button className="add-button" onClick={handleSubmit}>Add</button>
      </div>
    </div>
    {showValidation && (
      <ValidationMessage
        message="Give your task a title first, then you're good to go! You can just edit the others later."
        onClose={() => setShowValidation(false)}
      />
    )} </>
  );
}

function Dashboard() {
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
  const [editingNameIndex, setEditingNameIndex] = useState(null);
  const [deletedTasks, setDeletedTasks] = useState(() => JSON.parse(localStorage.getItem('deletedTasks')) || []);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [newDue, setNewDue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  const dropdownRefs = useRef({ status: null, priority: null, due: null });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !Object.values(dropdownRefs.current).some(ref => ref && ref.contains(event.target))
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);


  useEffect(() => {
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const AddTask = () => {
    setShowAddTaskModal(true);
  };

  const handleAddTaskSubmit = (task) => {
    setTasks([...tasks, task]);
    setShowAddTaskModal(false);
  };

  const handleNameChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index].name = event.target.value;
    setTasks(newTasks);
  };

  const handleStatusChange = (index, newStatus) => {
    const newTasks = [...tasks];
    newTasks[index].status = newStatus;
    setTasks(newTasks);
    setActiveDropdown(null);
  };

  const handleDueChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index].due = event.target.value;
    setTasks(newTasks);
  };

  const handlePriorityChange = (index, newPriority) => {
    const newTasks = [...tasks];
    newTasks[index].priority = newPriority;
    setTasks(newTasks);
    setActiveDropdown(null);
  };
  const toggleTaskSelection = (index) => {
    setSelectedTasks(prevSelectedTasks =>
      prevSelectedTasks.includes(index)
        ? prevSelectedTasks.filter(i => i !== index)
        : [...prevSelectedTasks, index]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(tasks.length === selectedTasks.length ? [] : tasks.map((_, i) => i));
  };


  const handleStatusUpdate = (newStatus) => {
    if (selectedTasks.length > 0) {
      const newTasks = [...tasks];
      selectedTasks.forEach(index => {
        newTasks[index].status = newStatus;
      });
      setTasks(newTasks);
      setActiveDropdown(null);
    }
  };

  const handleDueUpdate = () => {
    if (selectedTasks.length > 0) {
      const newTasks = [...tasks];
      selectedTasks.forEach(index => {
        newTasks[index].due = newDue;
      });
      setTasks(newTasks);
      setActiveDropdown(null);
    }
  };

  const handleDueInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleDueUpdate();
    }
  };

  const handlePriorityUpdate = (newPriority) => {
    if (selectedTasks.length > 0) {
      const newTasks = [...tasks];
      selectedTasks.forEach(index => {
        newTasks[index].priority = newPriority;
      });
      setTasks(newTasks);
      setActiveDropdown(null);
    }
  };

  const handleDelete = () => {
    setActiveDropdown(null);
    if (selectedTasks.length > 0) {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteTask = (index) => {
    setActiveDropdown(null); 
    setTaskToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteTasks = () => {
    const tasksToDelete = tasks.filter((_, index) => selectedTasks.includes(index));
    setDeletedTasks([...deletedTasks, ...tasksToDelete]); 
    localStorage.setItem('deletedTasks', JSON.stringify([...deletedTasks, ...tasksToDelete])); 
    setTasks(tasks.filter((_, index) => !selectedTasks.includes(index)));
    setSelectedTasks([]);
    setShowDeleteModal(false);
  };

  const confirmDeleteTask = () => {
    const taskToDeleteItem = tasks[taskToDelete];
    setDeletedTasks([...deletedTasks, taskToDeleteItem]);
    localStorage.setItem('deletedTasks', JSON.stringify([...deletedTasks, taskToDeleteItem])); 
    setTasks(tasks.filter((_, i) => i !== taskToDelete));
    setSelectedTasks(selectedTasks.filter(i => i !== taskToDelete));
    setTaskToDelete(null);
    setShowDeleteModal(false);
  };
  

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setName((prevName) => prevName + '!');
      setIsEditing(false);
      event.target.blur(); 
    }
  };

  const handleUserNameChange = (event) => {
    setName(event.target.value);
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(task => task.status === "Done").length;
  const inProgressTasks = tasks.filter(task => task.status === "In Progress").length;
  const pendingTasks = tasks.filter(task => task.status === "Pending").length;

  const donePercentage = (doneTasks / totalTasks) * 100 || 0;
  const inProgressPercentage = (inProgressTasks / totalTasks) * 100 || 0;
  const pendingPercentage = (pendingTasks / totalTasks) * 100 || 0;

  return (
    <>
    <div class="outer-container">
      <div className="mainpage">
        <a href="https://www.youtube.com/watch?v=GLpdY-57Dro" target="_blank" rel="noopener noreferrer">
          <img className="githublogo" src={githublogo} alt="GitHub Logo" />
        </a>
        <p id="dashboard">Dashboard</p>
        <div className='header'></div>
        <div className="plate">

          <div className="hello">Hello,</div>

          <div className="nameentry">
            <label className="nameLabel">
              <input
                className='inputusername'
                type="text"
                value={name}
                onKeyPress={handleKeyPress}
                onBlur={() => setIsEditing(false)}
                placeholder="Enter name"
                onChange={handleUserNameChange}
                autoFocus={isEditing}
              />
            </label>
          </div>

          <div className="platedispimage"><img src={todobook} alt="" /></div>

          <div className="clock">
            <RealTimeClock />
          </div>

          <div className='ProgressTracker'>
            <h2>Your Progress</h2>
            <div className="progress-bar-wrapper">
              <span className="progress-percentage" data-progress={`${donePercentage.toFixed()}%`}>
                {donePercentage.toFixed()}%
              </span>
              <div className="progress-bar done">
                <span style={{ width: `${donePercentage}%` }}></span>
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <span className="progress-percentage" data-progress={`${inProgressPercentage.toFixed()}%`}>
                {inProgressPercentage.toFixed()}%
              </span>
              <div className="progress-bar in-progress">
                <span style={{ width: `${inProgressPercentage}%` }}></span>
              </div>
            </div>
            <div className="progress-bar-wrapper">
              <span className="progress-percentage" data-progress={`${pendingPercentage.toFixed()}%`}>
                {pendingPercentage.toFixed()}%
              </span>
              <div className="progress-bar pending">
                <span style={{ width: `${pendingPercentage}%` }}></span>
              </div>
            </div>
          </div>

        </div>

        
        <div className="tablecontainer">
          <div className="navforall">
            <img className="todoicon" src={todoicon} alt="" />
            <p id="todolist">To Do</p>
    
            <button id="addtask" onClick={AddTask}><FontAwesomeIcon icon={faPlus} className="faPlus" />Add Task</button>
    
            <button
              id="status"
              onClick={() => setActiveDropdown(activeDropdown === 'status' ? null : 'status')}
              disabled={selectedTasks.length === 0}
            >
              <FontAwesomeIcon icon={faSpinner} className="faSpinner" />Status
            </button>
            {activeDropdown === 'status' && (
              <div className="dropdown-menuSALL" ref={el => (dropdownRefs.current.status = el)}>
                <button className="status-button3" onClick={() => handleStatusUpdate('Pending')}>Pending</button>
                <button className="status-button2" onClick={() => handleStatusUpdate('In Progress')}>In Progress</button>
                <button className="status-button1" onClick={() => handleStatusUpdate('Done')}>Done</button>
              </div>
            )}
    
            <button
              id="delete"
              onClick={handleDelete}
              disabled={selectedTasks.length === 0}
            >
              <FontAwesomeIcon icon={faTrashCan} className="faTrashCan" />Delete
            </button>

            <button
              id="due"
              onClick={() => setActiveDropdown(activeDropdown === 'due' ? null : 'due')}
              disabled={selectedTasks.length === 0}
            >
              <FontAwesomeIcon icon={faCalendarDays} className="faCalendarDays" />Due
            </button>
            {activeDropdown === 'due' && (
              <div className="menuALLTIME" ref={el => (dropdownRefs.current.due = el)}>
                <input
                  className='dueALL'
                  type="datetime-local"
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  onKeyDown={handleDueInputKeyDown}
                />
              </div>
            )}
  
            <button
              id="priority"
              onClick={() => setActiveDropdown(activeDropdown === 'priority' ? null : 'priority')}
              disabled={selectedTasks.length === 0}
            >
              <FontAwesomeIcon icon={faFire} className="faFire" />Priority
            </button>
            {activeDropdown === 'priority' && (
              <div className="dropdown-menuPALL" ref={el => (dropdownRefs.current.priority = el)}>
                <button className="priority-button1" onClick={() => handlePriorityUpdate('High')}>High</button>
                <button className="priority-button2" onClick={() => handlePriorityUpdate('Medium')}>Medium</button>
                <button className="priority-button3" onClick={() => handlePriorityUpdate('Low')}>Low</button>
              </div>
            )}

          </div>

          {tasks.length === 0 ? (
            <div className="notaskdisp">
              <img className="notaskimg" src={notaskimg} alt="No tasks available" />
              <p id="notasktxt1">Seems like you’ve got nothing to do here!</p>
              <p id="notasktxt2">Enjoy the rest of the day.</p>
            </div>
          ) : (
            <table className="todolist">
              <thead>
                <tr>
                  <th className="slctnboxforall">
                  <input type="checkbox" onChange={handleSelectAll} checked={tasks.length > 0 && selectedTasks.length === tasks.length} />
                    <label htmlFor="customCheckbox"></label>
                  </th>
                  <th className="namehead">Name</th>
                  <th className="statushead">Status</th>
                  <th className="duehead">Due</th>
                  <th className="priohead">Priority</th>
                  <th className="dlthead"></th>
                </tr>
              </thead>

              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td>
                    <input
                          type="checkbox"
                          checked={selectedTasks.includes(index)}
                          onChange={() => toggleTaskSelection(index)}
                        />
                    </td>

                    <td>
                      <input
                        className="inputName"
                        type="text"
                        placeholder="Untitled"
                        value={task.name}
                        onChange={(e) => handleNameChange(index, e)}
                      />
                    </td>

                    <td className="status-cell">
                      {activeDropdown === `status-${index}` ? (
                        <div className="dropdown-menu" ref={el => (dropdownRefs.current.status = el)}>
                          <button className="status-button3" onClick={() => handleStatusChange(index, 'Pending')}>Pending</button>
                          <button className="status-button2" onClick={() => handleStatusChange(index, 'In Progress')}>In Progress</button>
                          <button className="status-button1" onClick={() => handleStatusChange(index, 'Done')}>Done</button>
                        </div>
                      ) : (
                        <span 
                          className={`status-text status-${task.status.replace(" ", "-").toLowerCase()}`} 
                          onClick={() => setActiveDropdown(`status-${index}`)}
                        >
                          {task.status}
                        </span>
                      )}
                    </td>

                    <td
                      className='dueOnTableContainer'
                      onMouseEnter={() => setHoverIndex(index)}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      {task.due || hoverIndex === index ? (
                        <input
                          className='dueOnTable'
                          type="datetime-local"
                          value={task.due}
                          onChange={(e) => handleDueChange(index, e)}
                          onBlur={() => setHoverIndex(null)}
                        />
                      ) : (
                        <span onClick={() => setHoverIndex(index)}>
                          {task.due ? task.due : ''}
                        </span>
                      )}
                    </td>
  
                    <td className="priority-cell">
                      {activeDropdown === `priority-${index}` ? (
                        <div className="dropdown-menu" ref={el => (dropdownRefs.current.priority = el)}>
                          <button className="priority-button1" onClick={() => handlePriorityChange(index, 'High')}>High</button>
                          <button className="priority-button2" onClick={() => handlePriorityChange(index, 'Medium')}>Medium</button>
                          <button className="priority-button3" onClick={() => handlePriorityChange(index, 'Low')}>Low</button>
                        </div>
                      ) : (
                        <span 
                          className={`priority-text priority-${task.priority?.toLowerCase() || 'placeholder'}`} 
                          onClick={() => setActiveDropdown(`priority-${index}`)}
                        >
                          {task.priority || 'Select Priority'}
                        </span>
                      )}
                    </td>

                    <td className='dltbutton'>
                      <button className='xbutton' onClick={() => handleDeleteTask(index)}>
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {showDeleteModal && (
            <ConfirmationMessage
              message={taskToDelete === null ? "Are you sure you want to delete selected tasks?" : "Are you sure you want to delete this task?"}
              onConfirm={taskToDelete === null ? confirmDeleteTasks : confirmDeleteTask}
              onCancel={cancelDelete}
            />
          )}

          {showAddTaskModal && (
            <AddTaskModal
              onSubmit={handleAddTaskSubmit}
              onCancel={() => setShowAddTaskModal(false)}
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;