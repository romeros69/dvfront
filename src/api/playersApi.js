let API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const __setApiBaseUrlForTests = (url) => {
  API_BASE_URL = url;
};

export const getAllPlayers = async (pageNumber = null, pageSize = null) => {
  let url = `${API_BASE_URL}/players`;
  const params = new URLSearchParams();
  
  if (pageNumber !== null && pageNumber > 0) {
    params.append('page_number', pageNumber);
  }
  if (pageSize !== null && pageSize > 0) {
    params.append('page_size', Math.min(pageSize, 100));
  }
  
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch players');
  }
  return response.json();
};

export const getPlayerById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player');
  }
  return response.json();
};

export const createPlayer = async (playerData) => {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData),
  });
  if (!response.ok) {
    throw new Error('Failed to create player');
  }
  return response.json();
};

export const updatePlayer = async (id, playerData) => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData),
  });
  if (!response.ok) {
    throw new Error('Failed to update player');
  }
  return response.json();
};

export const deletePlayer = async (id) => {
  const response = await fetch(`${API_BASE_URL}/players/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete player');
  }
  return response.status === 204;
};

