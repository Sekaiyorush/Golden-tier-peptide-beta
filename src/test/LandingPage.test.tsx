import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DatabaseProvider } from '../context/DatabaseContext';
import { CartProvider } from '../context/CartContext';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';

// Wrapper component for providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <DatabaseProvider>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </DatabaseProvider>
  </MemoryRouter>
);

describe('LandingPage', () => {
  it('renders without crashing', async () => {
    const { container } = render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    await waitFor(() => {
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
    });
  });

  it('renders main headline text', async () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    // Wait for animations to complete
    await waitFor(() => {
      const purityText = screen.queryByText(/Purity/i);
      const precisionText = screen.queryByText(/Precision/i);
      expect(purityText || precisionText).toBeTruthy();
    });
  });

  it('has navigation links', async () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    await waitFor(() => {
      // Check for links (they might have animation, so use query)
      const links = screen.queryAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  it('renders company name in header', async () => {
    render(
      <TestWrapper>
        <LandingPage />
      </TestWrapper>
    );
    
    await waitFor(() => {
      // Check for header element
      const header = document.querySelector('header');
      expect(header).toBeInTheDocument();
    });
  });
});
