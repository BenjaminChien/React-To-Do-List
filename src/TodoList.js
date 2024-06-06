import React, {useState, useEffect} from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function TodoList(){
  const [tasks, setTasks] = useState([])
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  //save to localStorage
  useEffect(()=>{
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if(storedTasks){
      setTasks(storedTasks);
    }
  },[])

  useEffect(()=>{
    if(tasks != null){
      localStorage.setItem('tasks',JSON.stringify(tasks));
    }
  }, [tasks])

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  }

  const handleAddTask = (e) => {
    e.preventDefault();
    if(inputValue.trim()){
      setTasks([...tasks, {text: inputValue, completed: false}])
      setInputValue('');
    }
  }

  const handleEditTask = (index) =>{
    setEditIndex(index);
    setEditValue(tasks[index].text)
  }

  const handleSaveEdit = (index) => {
    const newTasks = [...tasks];
    newTasks[index].text = editValue;
    setTasks(newTasks);
    setEditIndex(null);
    setEditValue('');
  }

  const toggleTaskCompletion = (index) =>{
    const newTask = [...tasks];
    newTask[index].completed = !newTask[index].completed;
    setTasks(newTask);
  }

  const handleRemoveTask = (index) =>{
    const newTasks = tasks.filter((_,i)=>i !== index);
    setTasks(newTasks);
  }

  const handleDragEnd = (result) =>{
    if(!result.destination) return;
    const newTasks = [...tasks];
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    setTasks(newTasks);
  }

  return(
    <div>
      <h4>Tasks</h4>
      <form onSubmit={handleAddTask}>
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          placeholder='Add a new Task'
        />
        <button type='submit'>Add Task</button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="drop-Id">
          {(provided) =>(
            <ul ref={provided.innerRef} {...provided.droppableProps} >
              {tasks.length === 0 ? (
                <li>No tasks yet</li>
              ):(
                tasks.map((task, index) => (
                  <Draggable key={index} draggableId={`task-${index}`} index={index}>
                    {(provided) => (
                      <li 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          marginBottom:'8px',
                          padding:'8px',
                          backgroundColor: '#f4f4f4',
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}
                      >
                        {editIndex === index ? (
                          <>
                            <input type='text' value={editValue} onChange={handleEditChange}/>
                            <button onClick={() => handleSaveEdit(index)}> Save </button>
                          </>
                        ):(
                          <>
                            <span> {task.text} </span>
                            <input onClick={() => toggleTaskCompletion(index)} type='checkbox'/>
                            <button onClick={() => handleEditTask(index)}> Edit </button>
                            <button onClick={() => handleRemoveTask(index)}> Remove </button>
                          </>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))
              )}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default TodoList;