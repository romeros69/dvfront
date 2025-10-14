import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerForm from './PlayerForm';

describe('PlayerForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with Add New Player title when no player prop', () => {
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Add New Player')).toBeInTheDocument();
  });

  test('renders form with Edit Player title when player prop is provided', () => {
    const player = {
      id: 1,
      name: 'LeBron',
      surname: 'James',
      age: 39,
      height: 2060,
      weight: 113000,
      citizenship: 'USA',
      role: 'SF',
      teamId: 101
    };
    render(<PlayerForm player={player} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByText('Edit Player')).toBeInTheDocument();
  });

  test('populates form fields with player data', () => {
    const player = {
      id: 1,
      name: 'LeBron',
      surname: 'James',
      age: 39,
      height: 2060,
      weight: 113000,
      citizenship: 'USA',
      role: 'SF',
      teamId: 101
    };
    render(<PlayerForm player={player} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByDisplayValue('LeBron')).toBeInTheDocument();
    expect(screen.getByDisplayValue('James')).toBeInTheDocument();
    expect(screen.getByDisplayValue('39')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2060')).toBeInTheDocument();
    expect(screen.getByDisplayValue('113000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
    expect(screen.getByDisplayValue('SF')).toBeInTheDocument();
    expect(screen.getByDisplayValue('101')).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByText('Create Player');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required (max 50 characters)')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Surname is required (max 50 characters)')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('validates age range', async () => {
    const user = userEvent.setup();
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/^Name/i);
    const surnameInput = screen.getByLabelText(/Surname/i);
    const ageInput = screen.getByLabelText(/Age/i);
    const heightInput = screen.getByLabelText(/Height/i);
    const weightInput = screen.getByLabelText(/Weight/i);
    const citizenshipInput = screen.getByLabelText(/Citizenship/i);
    const teamIdInput = screen.getByLabelText(/Team ID/i);
    
    await user.type(nameInput, 'Test');
    await user.type(surnameInput, 'Player');
    await user.type(ageInput, '10');
    await user.type(heightInput, '2000');
    await user.type(weightInput, '85000');
    await user.type(citizenshipInput, 'USA');
    await user.type(teamIdInput, '1');
    
    const submitButton = screen.getByText('Create Player');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Age must be between 15 and 50/i)).toBeInTheDocument();
    });
  });

  test('validates height minimum', async () => {
    const user = userEvent.setup();
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/^Name/i);
    const surnameInput = screen.getByLabelText(/Surname/i);
    const ageInput = screen.getByLabelText(/Age/i);
    const heightInput = screen.getByLabelText(/Height/i);
    const weightInput = screen.getByLabelText(/Weight/i);
    const citizenshipInput = screen.getByLabelText(/Citizenship/i);
    const teamIdInput = screen.getByLabelText(/Team ID/i);
    
    await user.type(nameInput, 'Test');
    await user.type(surnameInput, 'Player');
    await user.type(ageInput, '25');
    await user.type(heightInput, '1000');
    await user.type(weightInput, '85000');
    await user.type(citizenshipInput, 'USA');
    await user.type(teamIdInput, '1');
    
    const submitButton = screen.getByText('Create Player');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Height must be at least 1500/i)).toBeInTheDocument();
    });
  });

  test('validates weight minimum', async () => {
    const user = userEvent.setup();
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByLabelText(/^Name/i);
    const surnameInput = screen.getByLabelText(/Surname/i);
    const ageInput = screen.getByLabelText(/Age/i);
    const heightInput = screen.getByLabelText(/Height/i);
    const weightInput = screen.getByLabelText(/Weight/i);
    const citizenshipInput = screen.getByLabelText(/Citizenship/i);
    const teamIdInput = screen.getByLabelText(/Team ID/i);
    
    await user.type(nameInput, 'Test');
    await user.type(surnameInput, 'Player');
    await user.type(ageInput, '25');
    await user.type(heightInput, '2000');
    await user.type(weightInput, '30000');
    await user.type(citizenshipInput, 'USA');
    await user.type(teamIdInput, '1');
    
    const submitButton = screen.getByText('Create Player');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Weight must be at least 50000/i)).toBeInTheDocument();
    });
  });

  test('renders all role options', () => {
    render(<PlayerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const roleSelect = screen.getByLabelText(/Position/i);
    expect(roleSelect).toBeInTheDocument();
    
    const options = roleSelect.querySelectorAll('option');
    expect(options).toHaveLength(5);
    expect(options[0]).toHaveTextContent('PG');
    expect(options[1]).toHaveTextContent('SG');
    expect(options[2]).toHaveTextContent('SF');
    expect(options[3]).toHaveTextContent('PF');
    expect(options[4]).toHaveTextContent('C');
  });
});

