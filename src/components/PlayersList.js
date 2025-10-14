import React from 'react';
import './PlayersList.css';

const ROLE_NAMES = {
  PG: 'Point Guard',
  SG: 'Shooting Guard',
  SF: 'Small Forward',
  PF: 'Power Forward',
  C: 'Center'
};

const PlayersList = ({ 
  players, 
  onEdit, 
  onDelete, 
  loading, 
  pageNumber = 1, 
  pageSize = 20, 
  onPageChange, 
  onPageSizeChange 
}) => {
  const formatHeight = (mm) => {
    const meters = (mm / 1000).toFixed(2);
    return `${meters} m`;
  };

  const formatWeight = (grams) => {
    const kg = (grams / 1000).toFixed(1);
    return `${kg} kg`;
  };

  const handlePrevPage = () => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (players.length === pageSize) {
      onPageChange(pageNumber + 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    onPageSizeChange(newSize);
    onPageChange(1);
  };

  if (loading) {
    return <div className="loading">Loading players...</div>;
  }

  if (players.length === 0) {
    return <div className="empty-state">No players found. Add your first player!</div>;
  }

  return (
    <div className="players-table-container">
      <div className="pagination-controls">
        <div className="pagination-info">
          <label>
            Items per page:
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <span className="page-info">
            Page {pageNumber} ({players.length} item{players.length !== 1 ? 's' : ''})
          </span>
        </div>
        <div className="pagination-buttons">
          <button 
            className="btn btn-pagination" 
            onClick={handlePrevPage}
            disabled={pageNumber === 1}
          >
            ← Previous
          </button>
          <button 
            className="btn btn-pagination" 
            onClick={handleNextPage}
            disabled={players.length < pageSize}
          >
            Next →
          </button>
        </div>
      </div>

      <table className="players-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Age</th>
            <th>Height</th>
            <th>Weight</th>
            <th>Citizenship</th>
            <th>Position</th>
            <th>Team ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.surname}</td>
              <td>{player.age}</td>
              <td>{formatHeight(player.height)}</td>
              <td>{formatWeight(player.weight)}</td>
              <td>{player.citizenship}</td>
              <td>
                <span className="role-badge" title={ROLE_NAMES[player.role]}>
                  {player.role}
                </span>
              </td>
              <td>{player.teamId}</td>
              <td className="actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(player)}
                  aria-label={`Edit ${player.name} ${player.surname}`}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(player.id)}
                  aria-label={`Delete ${player.name} ${player.surname}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersList;

