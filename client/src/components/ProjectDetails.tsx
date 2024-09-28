import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchTasks, addTask, updateTask, deleteTask } from '../features/tasks/tasksSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateTaskId, setUpdateTaskId] = useState<number | null>(null);


  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(Number(projectId)));
    }
  }, [dispatch, projectId]);

  
  const handleAddTask = () => {
    if (title.trim() && description.trim() && projectId) {
      dispatch(addTask({ title, description, projectId: Number(projectId) }));
      setTitle('');
      setDescription('');
    }
  };

  const handleDeleteTask = (taskId: number) => {
    dispatch(deleteTask(taskId));
  };


  const handleUpdateTask = () => {
    if (updateTitle.trim() && updateDescription.trim() && updateTaskId !== null) {
      dispatch(updateTask({ id: updateTaskId, title: updateTitle, description: updateDescription, completed: false }));
      setUpdateTitle('');
      setUpdateDescription('');
      setUpdateTaskId(null);
    }
  };

  
  const prepareUpdateTask = (task: any) => {
    setUpdateTaskId(task.id);
    setUpdateTitle(task.title);
    setUpdateDescription(task.description);
  };

  return (
    <div>
      <h1>Детали проекта: {location.state?.title || 'Проект'}</h1>
      {loading && <p>Загрузка задач...</p>}
      {error && <p>Ошибка при загрузке задач: {error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
                {task.title} 
                <button onClick={() => handleDeleteTask(task.id)}>Удалить</button>
                <button onClick={() => prepareUpdateTask(task)}>Редактировать</button> 
                <br></br>
                Описание: {task.description}
            </li>
        ))}
      </ul>

      <div>
        <h2>Добавить новую задачу</h2>
        <input
          type="text"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Описание задачи"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddTask}>Добавить задачу</button>
      </div>
      {updateTaskId && (
        <div>
          <h2>Обновить задачу</h2>
          <input
            type="text"
            placeholder="Новое название задачи"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Новое описание задачи"
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
          />
          <button onClick={handleUpdateTask}>Обновить задачу</button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
