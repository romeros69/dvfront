global.fetch = jest.fn();

import {
  getAllPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  __setApiBaseUrlForTests
} from './playersApi';

describe('Players API', () => {
  beforeAll(() => {
    __setApiBaseUrlForTests('http://localhost:8080');
  });

  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAllPlayers', () => {
    test('fetches all players without pagination', async () => {
      const mockPlayers = [{ id: 1, name: 'LeBron', surname: 'James' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayers,
      });

      const result = await getAllPlayers();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players');
      expect(result).toEqual(mockPlayers);
    });

    test('fetches players with pagination parameters', async () => {
      const mockPlayers = [{ id: 1, name: 'LeBron', surname: 'James' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayers,
      });

      const result = await getAllPlayers(2, 10);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players?page_number=2&page_size=10');
      expect(result).toEqual(mockPlayers);
    });

    test('limits page size to maximum of 100', async () => {
      const mockPlayers = [{ id: 1, name: 'LeBron', surname: 'James' }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayers,
      });

      await getAllPlayers(1, 150);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players?page_number=1&page_size=100');
    });

    test('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getAllPlayers()).rejects.toThrow('Failed to fetch players');
    });
  });

  describe('getPlayerById', () => {
    test('fetches player by id successfully', async () => {
      const mockPlayer = { id: 1, name: 'LeBron', surname: 'James' };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlayer,
      });

      const result = await getPlayerById(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players/1');
      expect(result).toEqual(mockPlayer);
    });

    test('throws error when player not found', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(getPlayerById(999)).rejects.toThrow('Failed to fetch player');
    });
  });

  describe('createPlayer', () => {
    test('creates player successfully', async () => {
      const newPlayer = {
        name: 'Stephen',
        surname: 'Curry',
        age: 36,
        height: 1910,
        weight: 86000,
        citizenship: 'USA',
        role: 'PG',
        teamId: 102
      };
      const createdPlayer = { id: 2, ...newPlayer };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => createdPlayer,
      });

      const result = await createPlayer(newPlayer);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      });
      expect(result).toEqual(createdPlayer);
    });

    test('throws error when creation fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(createPlayer({})).rejects.toThrow('Failed to create player');
    });
  });

  describe('updatePlayer', () => {
    test('updates player successfully', async () => {
      const updateData = { age: 37 };
      const updatedPlayer = { id: 1, name: 'LeBron', surname: 'James', age: 37 };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedPlayer,
      });

      const result = await updatePlayer(1, updateData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(updatedPlayer);
    });

    test('throws error when update fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(updatePlayer(1, {})).rejects.toThrow('Failed to update player');
    });
  });

  describe('deletePlayer', () => {
    test('deletes player successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const result = await deletePlayer(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:8080/players/1', {
        method: 'DELETE',
      });
      expect(result).toBe(true);
    });

    test('throws error when deletion fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(deletePlayer(1)).rejects.toThrow('Failed to delete player');
    });
  });
});

