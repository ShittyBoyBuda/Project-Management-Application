import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      <h1>Главная страница</h1>
      <p>Выберите, что хотите сделать:</p>
      <button onClick={handleLoginClick}>Вход</button>
      <button onClick={handleRegisterClick}>Регистрация</button>
    </div>
  );
};

export default Home;
