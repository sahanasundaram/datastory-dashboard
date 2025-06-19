import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  return {
    ...actual,
    useQuery: jest.fn(),
  };
});

import { useQuery } from '@apollo/client';
import Page from '../page'; // adjust path

describe('Page component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders heading and select inputs, and handles loading state', async () => {
    useQuery.mockImplementation((query) => {
      if (query.definitions[0].name.value === 'Countries') {
        return {
          data: {
            item: [
              { id: '1', name: 'Germany', iso2: [{ value: 'DE' }] },
              { id: '2', name: 'France', iso2: [{ value: 'FR' }] },
            ],
          },
          loading: false,
          error: undefined,
        };
      }

      if (query.definitions[0].name.value === 'CubeData') {
        return {
          data: {
            cube_cube_M6Lh5is0FtqUhZ: [
              { year: 2020, value: 80 },
              { year: 2021, value: 81 },
            ],
          },
          loading: false,
          error: undefined,
        };
      }

      return { data: undefined, loading: true, error: undefined };
    });

    render(<Page />);

    expect(screen.getByRole('heading', { name: /datastory dashboard/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'France' })).toBeInTheDocument();
    });
  });

  it('lets user change selected measure', async () => {
    useQuery.mockImplementation((query) => {
      if (query.definitions[0].name.value === 'Countries') {
        return {
          data: {
            item: [
              { id: '1', name: 'Germany', iso2: [{ value: 'DE' }] },
              { id: '2', name: 'France', iso2: [{ value: 'FR' }] },
            ],
          },
          loading: false,
          error: undefined,
        };
      }

      if (query.definitions[0].name.value === 'CubeData') {
        return {
          data: {
            cube_cube_M6Lh5is0FtqUhZ: [
              { year: 2020, value: 80 },
              { year: 2021, value: 81 },
            ],
          },
          loading: false,
          error: undefined,
        };
      }

      return { data: undefined, loading: true, error: undefined };
    });

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument();
    });

    const measureSelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(measureSelect, { target: { value: 'population' } });

    expect(measureSelect).toHaveValue('population');
  });
});
