import React from 'react';

function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>{task.text}</li>
      ))}
    </ul>
  );
}

export default TaskList;
