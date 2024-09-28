import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchProjects, createProject, updateProject, deleteProject } from '../features/projects/projectSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  const token = useSelector((state: RootState) => state.auth.token);
  
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchProjects(token));
    }
  }, [dispatch, token]);

  const handleAddProject = () => {
    if (newProjectTitle.trim() && token) { 
      dispatch(createProject({ title: newProjectTitle, token })); 
      setNewProjectTitle('');
    }
  };

  const handleProjectClick = (projectId: number, projectTitle: string) => {
    navigate(`/projects/${projectId}`, { state: { title: projectTitle } });
  };

  const handleEditProject = (project: { id: number; title: string; description?: string }) => {
    setEditingProjectId(project.id);
    setEditingTitle(project.title);
    setEditingDescription(project.description || '');
  };

  const handleUpdateProject = () => {
    if (editingProjectId && editingTitle.trim() && token) {
      dispatch(updateProject({ id: editingProjectId, title: editingTitle, description: editingDescription, token }));
      setEditingProjectId(null);
      setEditingTitle('');
      setEditingDescription('');
    }
  };

  const handleDeleteProject = (projectId: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      <h1>Мои Проекты</h1>
      <button onClick={handleLogout}>Выйти</button>
      {loading && <p>Загрузка проектов...</p>}
      {error && <p>Ошибка при загрузке проектов: {error}</p>}
      
      <div>
        <input
          type="text"
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          placeholder="Название нового проекта"
        />
        <button onClick={handleAddProject}>Добавить проект</button>
      </div>
      
      <ul>
      {Array.isArray(projects) ? (
          projects.map((project) => (
            <li key={project.id}>
              <span onClick={() => handleProjectClick(project.id, project.title)}>{project.title} <br /> 
              Описание: {project.description}
              </span>
              <button onClick={() => handleDeleteProject(project.id)}>Удалить</button>
              <button onClick={() => handleEditProject(project)}>Редактировать</button>
            </li>
          ))
        ) : (
          <p>Проекты не загружены.</p>
        )}
      </ul>

      {editingProjectId && (
        <div>
          <h2>Редактировать проект</h2>
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            placeholder="Новое название проекта"
          />
          <input
            type="text"
            value={editingDescription}
            onChange={(e) => setEditingDescription(e.target.value)}
            placeholder="Новое описание проекта"
          />
          <button onClick={handleUpdateProject}>Сохранить изменения</button>
          <button onClick={() => setEditingProjectId(null)}>Отмена</button>
        </div>
      )}
    </div>
  );
};

export default Projects;
