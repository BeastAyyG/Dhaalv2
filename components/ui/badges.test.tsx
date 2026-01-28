import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SeverityBadge, StatusBadge } from './badges';

describe('SeverityBadge', () => {
    it('renders low severity correctly', () => {
        // Severity 1 = Low
        render(<SeverityBadge severity={1} />);
        const badge = screen.getByText('Low');
        expect(badge).toBeInTheDocument();
    });

    it('renders critical severity correctly', () => {
        // Severity 9 = Critical
        render(<SeverityBadge severity={9} />);
        const badge = screen.getByText('Critical');
        expect(badge).toBeInTheDocument();
        // Assuming the class for critical is present (checking red/error color usually via class)
    });
});

describe('StatusBadge', () => {
    it('renders OPEN status', () => {
        render(<StatusBadge status="OPEN" />);
        expect(screen.getByText('Open')).toBeInTheDocument();
    });

    it('renders RESOLVED status', () => {
        render(<StatusBadge status="RESOLVED" />);
        expect(screen.getByText('Resolved')).toBeInTheDocument();
    });
});
