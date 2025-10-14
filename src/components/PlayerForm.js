import React, { useState, useEffect } from 'react';
import './PlayerForm.css';

const ROLES = ['PG', 'SG', 'SF', 'PF', 'C'];

const PlayerForm = ({ player, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    age: '',
    height: '',
    weight: '',
    citizenship: '',
    role: 'PG',
    teamId: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        surname: player.surname || '',
        age: player.age || '',
        height: player.height || '',
        weight: player.weight || '',
        citizenship: player.citizenship || '',
        role: player.role || 'PG',
        teamId: player.teamId || ''
      });
    }
  }, [player]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length > 50) {
      newErrors.name = 'Name is required (max 50 characters)';
    }

    if (!formData.surname.trim() || formData.surname.length > 50) {
      newErrors.surname = 'Surname is required (max 50 characters)';
    }

    const age = parseInt(formData.age);
    if (!formData.age || age < 15 || age > 50) {
      newErrors.age = 'Age must be between 15 and 50';
    }

    const height = parseInt(formData.height);
    if (!formData.height || height < 1500) {
      newErrors.height = 'Height must be at least 1500 mm (1.5 m)';
    }

    const weight = parseInt(formData.weight);
    if (!formData.weight || weight < 50000) {
      newErrors.weight = 'Weight must be at least 50000 g (50 kg)';
    }

    if (!formData.citizenship.trim() || formData.citizenship.length < 2) {
      newErrors.citizenship = 'Citizenship is required (min 2 characters)';
    }

    const teamId = parseInt(formData.teamId);
    if (!formData.teamId || teamId < 1) {
      newErrors.teamId = 'Team ID must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseInt(formData.weight),
        teamId: parseInt(formData.teamId)
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="form-container">
      <h2>{player ? 'Edit Player' : 'Add New Player'}</h2>
      <form onSubmit={handleSubmit} className="player-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="surname">Surname *</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className={errors.surname ? 'error' : ''}
            />
            {errors.surname && <span className="error-message">{errors.surname}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="15"
              max="50"
              className={errors.age ? 'error' : ''}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="citizenship">Citizenship *</label>
            <input
              type="text"
              id="citizenship"
              name="citizenship"
              value={formData.citizenship}
              onChange={handleChange}
              className={errors.citizenship ? 'error' : ''}
            />
            {errors.citizenship && <span className="error-message">{errors.citizenship}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Height (mm) *</label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              min="1500"
              placeholder="e.g., 2060 (2.06 m)"
              className={errors.height ? 'error' : ''}
            />
            {errors.height && <span className="error-message">{errors.height}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="weight">Weight (g) *</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="50000"
              placeholder="e.g., 113000 (113 kg)"
              className={errors.weight ? 'error' : ''}
            />
            {errors.weight && <span className="error-message">{errors.weight}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="role">Position *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              {ROLES.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="teamId">Team ID *</label>
            <input
              type="number"
              id="teamId"
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              min="1"
              className={errors.teamId ? 'error' : ''}
            />
            {errors.teamId && <span className="error-message">{errors.teamId}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {player ? 'Update Player' : 'Create Player'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlayerForm;

