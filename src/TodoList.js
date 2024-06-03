import React, {useState, useEffect} from 'react'

function TodoList(){
  const [tasks, setTasks] = useState(null)
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
      <ul>
        {tasks === null ? (
          <li>No tasks yet</li>
        ):(
          tasks.map((task, index) => (
            <li 
              key={index}
              style={{textDecoration: task.completed ? 'line-through' : 'none', }}>
              {editIndex === index ? (
                <>
                  <input type='text' value={editValue} onChange={handleEditChange}/>
                  <button onClick={() => handleSaveEdit(index)}> Save </button>
                </>
              ):(
                <>
                  <span onClick={() => toggleTaskCompletion(index)}> {task.text} </span>
                  <button onClick={() => handleEditTask(index)}> Edit </button>
                  <button onClick={() => handleRemoveTask(index)}> Remove </button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export default TodoList;