import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PlayersList from './components/PlayersList';
import PlayerForm from './components/PlayerForm';
import { getAllPlayers, createPlayer, updatePlayer, deletePlayer } from './api/playersApi';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadPlayers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPlayers(pageNumber, pageSize);
      setPlayers(data);
    } catch (err) {
      setError('Failed to load players. Make sure the API server is running.');
      console.error('Error loading players:', err);
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize]);

  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const handleCreatePlayer = async (playerData) => {
    try {
      setError(null);
      await createPlayer(playerData);
      await loadPlayers();
      setShowForm(false);
      alert('Player created successfully!');
    } catch (err) {
      setError('Failed to create player.');
      console.error('Error creating player:', err);
    }
  };

  const handleUpdatePlayer = async (playerData) => {
    try {
      setError(null);
      await updatePlayer(editingPlayer.id, playerData);
      await loadPlayers();
      setEditingPlayer(null);
      setShowForm(false);
      alert('Player updated successfully!');
    } catch (err) {
      setError('Failed to update player.');
      console.error('Error updating player:', err);
    }
  };

  const handleDeletePlayer = async (id) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        setError(null);
        await deletePlayer(id);
        await loadPlayers();
        alert('Player deleted successfully!');
      } catch (err) {
        setError('Failed to delete player.');
        console.error('Error deleting player:', err);
      }
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlayer(null);
  };

  const handleAddNew = () => {
    setEditingPlayer(null);
    setShowForm(true);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏀 Basketball Players Management</h1>
        <p>Manage your team roster</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {!showForm && (
          <div className="action-bar">
            <button onClick={handleAddNew} className="btn btn-add">
              + Add New Player
            </button>
            <button onClick={loadPlayers} className="btn btn-refresh">
              ↻ Refresh
            </button>
          </div>
        )}

        {showForm && (
          <PlayerForm
            player={editingPlayer}
            onSubmit={editingPlayer ? handleUpdatePlayer : handleCreatePlayer}
            onCancel={handleCancel}
          />
        )}

        {!showForm && (
          <PlayersList
            players={players}
            onEdit={handleEdit}
            onDelete={handleDeletePlayer}
            loading={loading}
            pageNumber={pageNumber}
            pageSize={pageSize}
            onPageChange={setPageNumber}
            onPageSizeChange={setPageSize}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Basketball Players API - DevOps Lab Work</p>
      </footer>
    </div>
  );
}

export default App;

