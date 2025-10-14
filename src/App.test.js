import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as playersApi from './api/playersApi';

jest.mock('./api/playersApi');

const mockPlayers = [
  {
    id: 1,
    name: 'LeBron',
    surname: 'James',
    age: 39,
    height: 2060,
    weight: 113000,
    citizenship: 'USA',
    role: 'SF',
    teamId: 101
  },
  {
    id: 2,
    name: 'Stephen',
    surname: 'Curry',
    age: 36,
    height: 1910,
    weight: 86000,
    citizenship: 'USA',
    role: 'PG',
    teamId: 102
  }
];

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    window.confirm = jest.fn();
  });

  test('renders app header', async () => {
    playersApi.getAllPlayers.mockResolvedValue([]);
    render(<App />);
    
    expect(screen.getByText(/Basketball Players Management/i)).toBeInTheDocument();
  });

  test('loads and displays players on mount', async () => {
    playersApi.getAllPlayers.mockResolvedValue(mockPlayers);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('LeBron')).toBeInTheDocument();
      expect(screen.getByText('James')).toBeInTheDocument();
      expect(screen.getByText('Stephen')).toBeInTheDocument();
      expect(screen.getByText('Curry')).toBeInTheDocument();
    });

    // Verify pagination parameters are passed
    expect(playersApi.getAllPlayers).toHaveBeenCalledWith(1, 20);
  });

  test('shows error when API fails', async () => {
    playersApi.getAllPlayers.mockRejectedValue(new Error('API Error'));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load players/i)).toBeInTheDocument();
    });
  });

  test('opens form when Add New Player is clicked', async () => {
    const user = userEvent.setup();
    playersApi.getAllPlayers.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('+ Add New Player')).toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add New Player');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Player')).toBeInTheDocument();
    });
  });

  test('refreshes players list when refresh button is clicked', async () => {
    const user = userEvent.setup();
    playersApi.getAllPlayers.mockResolvedValue(mockPlayers);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('LeBron')).toBeInTheDocument();
    });

    const refreshButton = screen.getByText('↻ Refresh');
    await user.click(refreshButton);

    await waitFor(() => {
      expect(playersApi.getAllPlayers).toHaveBeenCalledTimes(2);
      expect(playersApi.getAllPlayers).toHaveBeenCalledWith(1, 20);
    });
  });
});

