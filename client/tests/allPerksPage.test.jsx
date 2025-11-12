import { fireEvent, screen, waitFor, cleanup } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import AllPerks from '../src/pages/AllPerks.jsx';
import { renderWithRouter } from './utils/renderWithRouter.js';

describe('AllPerks page (Directory)', () => {
  // Run once before all tests
  beforeAll(async () => {
    console.log('🧩 Setting up AllPerks tests...');
   
  });

  
  afterAll(async () => {
    console.log('🧹 Cleaning up AllPerks tests...');
    cleanup(); 
  });

  test('lists public perks and responds to name filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait until the perks list loads
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    const nameFilter = screen.getByPlaceholderText(/enter perk name/i);
    fireEvent.change(nameFilter, { target: { value: seededPerk.title } });

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 3000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent(/showing/i);
  });

  test('lists public perks and responds to merchant filtering', async () => {
    const seededPerk = global.__TEST_CONTEXT__.seededPerk;

    renderWithRouter(
      <Routes>
        <Route path="/explore" element={<AllPerks />} />
      </Routes>,
      { initialEntries: ['/explore'] }
    );

    // Wait for perks to load
    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 5000 }
    );

    // Try to find merchant dropdown in various ways
    let merchantFilter;
    try {
      merchantFilter = screen.getByRole('combobox', { name: /merchant/i });
    } catch {
      const allSelects = screen.queryAllByRole('combobox');
      merchantFilter = allSelects.length ? allSelects[0] : null;
    }

    if (!merchantFilter) {
      merchantFilter = screen.queryByPlaceholderText(/merchant/i);
    }

    expect(merchantFilter).toBeTruthy();

    fireEvent.change(merchantFilter, {
      target: { value: seededPerk.merchant },
    });

    await waitFor(
      () => expect(screen.getByText(seededPerk.title)).toBeInTheDocument(),
      { timeout: 3000 }
    );

    expect(screen.getByText(/showing/i)).toHaveTextContent(/showing/i);
  });
});
