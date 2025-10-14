import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayersList from './PlayersList';

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

describe('PlayersList Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  const defaultProps = {
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    loading: false,
    pageNumber: 1,
    pageSize: 20,
    onPageChange: mockOnPageChange,
    onPageSizeChange: mockOnPageSizeChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    render(<PlayersList players={[]} {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading players...')).toBeInTheDocument();
  });

  test('renders empty state when no players', () => {
    render(<PlayersList players={[]} {...defaultProps} />);
    expect(screen.getByText(/No players found/i)).toBeInTheDocument();
  });

  test('renders players table with data', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    expect(screen.getByText('LeBron')).toBeInTheDocument();
    expect(screen.getByText('James')).toBeInTheDocument();
    expect(screen.getByText('Stephen')).toBeInTheDocument();
    expect(screen.getByText('Curry')).toBeInTheDocument();
    expect(screen.getAllByText('USA').length).toBe(2);
  });

  test('formats height correctly', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    expect(screen.getByText('2.06 m')).toBeInTheDocument();
    expect(screen.getByText('1.91 m')).toBeInTheDocument();
  });

  test('formats weight correctly', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    expect(screen.getByText('113.0 kg')).toBeInTheDocument();
    expect(screen.getByText('86.0 kg')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockPlayers[0]);
  });

  test('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    const deleteButtons = screen.getAllByText('Delete');
    await user.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('renders all table headers', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Surname')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('Weight')).toBeInTheDocument();
    expect(screen.getByText('Citizenship')).toBeInTheDocument();
    expect(screen.getByText('Position')).toBeInTheDocument();
    expect(screen.getByText('Team ID')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('renders pagination controls', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    expect(screen.getByText('Items per page:')).toBeInTheDocument();
    expect(screen.getByText(/Page 1/)).toBeInTheDocument();
    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  test('calls onPageChange when previous button is clicked', async () => {
    const user = userEvent.setup();
    render(<PlayersList players={mockPlayers} {...defaultProps} pageNumber={2} />);
    
    const prevButton = screen.getByText('← Previous');
    await user.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('calls onPageChange when next button is clicked', async () => {
    const user = userEvent.setup();
    const fullPagePlayers = Array(20).fill(null).map((_, i) => ({
      ...mockPlayers[0],
      id: i + 1
    }));
    render(<PlayersList players={fullPagePlayers} {...defaultProps} />);
    
    const nextButton = screen.getByText('Next →');
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageSizeChange when page size is changed', async () => {
    const user = userEvent.setup();
    render(<PlayersList players={mockPlayers} {...defaultProps} />);
    
    // Find select by its role and current value
    const pageSizeSelect = screen.getByRole('combobox');
    await user.selectOptions(pageSizeSelect, '50');
    
    expect(mockOnPageSizeChange).toHaveBeenCalledWith(50);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('disables previous button on first page', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} pageNumber={1} />);
    
    const prevButton = screen.getByText('← Previous');
    expect(prevButton).toBeDisabled();
  });

  test('disables next button when less than full page', () => {
    render(<PlayersList players={mockPlayers} {...defaultProps} pageSize={20} />);
    
    const nextButton = screen.getByText('Next →');
    expect(nextButton).toBeDisabled();
  });
});

