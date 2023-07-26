import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export const createSession = async (email, password) => {
  return await api.post('/sessions', { email, password });
};

const getRepositoryName = (url) => {
  const regex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)/;

  const match = url.match(regex);

  if (match[2]) {
    const values = match[2].split('/');
    return `${values[1]}/${values[2]}`;
  }
};

export const createRepository = async (userId, repositoryUrl) => {
  const repositoryName = getRepositoryName(repositoryUrl);
  const url = `/users/${userId}/repositories/`;

  return await api.post(url, { name: repositoryName, url: repositoryUrl });
};

export const getRepositories = async (userId, query) => {
  let url = `/users/${userId}/repositories/`;

  if (query) {
    url += `?q=${query}`;
  }

  return await api.get(url);
};

export const deleteRepository = async (userId, repositoryId) => {
  const url = `/users/${userId}/repositories/${repositoryId}`;
  return await api.delete(url);
};
