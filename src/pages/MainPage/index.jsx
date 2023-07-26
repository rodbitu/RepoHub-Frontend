import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import { AuthContext } from '../../contexts/auth';

import Nav from './components/Nav';
import Search from './components/Search';
import Repositories from './components/Repositories';

import {
  createRepository,
  getRepositories,
  deleteRepository,
} from '../../services/api';

const MainPage = () => {
  const { user, logout } = useContext(AuthContext);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const loadData = async (query = '') => {
    try {
      setLoading(true);
      const response = await getRepositories(user?.id, query);

      setRepositories(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoadingError(true);
    }
  };

  useEffect(() => {
    (async () => await loadData())();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleSearch = async (query) => {
    await loadData(query);
  };

  const handleDelete = async (repository) => {
    await deleteRepository(user?.id, repository._id);
    await loadData();
  };

  const handleNewRepo = async (url) => {
    try {
      await createRepository(user?.id, url);
      await loadData();
    } catch (err) {
      console.log(err);
      setLoadingError(true);
    }
  };

  if (loadingError) {
    return (
      <div className='loading'>
        Erro ao carregar os dados. <Link to='/login'>Voltar</Link>
      </div>
    );
  }

  if (loading) {
    return <div className='loading'>Carregando...</div>;
  }

  return (
    <div id='main'>
      <Nav onLogout={handleLogout} />
      <Search onSearch={handleSearch} />
      <Repositories
        repositories={repositories}
        onDeleteRepo={handleDelete}
        onNewRepo={handleNewRepo}
      />
    </div>
  );
};

export default MainPage;
