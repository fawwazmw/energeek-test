import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
    it('renders with default slot content', () => {
        render(BaseButton, {
            slots: {
                default: 'Click me'
            }
        });
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('applies primary variant by default', () => {
        const { getByRole } = render(BaseButton, {
            slots: { default: 'Test' }
        });
        expect(getByRole('button')).toHaveClass('btn-primary');
    });

    it('applies specified variant', () => {
        const { getByRole } = render(BaseButton, {
            props: { variant: 'danger' },
            slots: { default: 'Test' }
        });
        expect(getByRole('button')).toHaveClass('btn-danger');
        expect(getByRole('button')).not.toHaveClass('btn-primary');
    });

    it('applies block class when block prop is true', () => {
        const { getByRole } = render(BaseButton, {
            props: { block: true },
            slots: { default: 'Test' }
        });
        expect(getByRole('button')).toHaveClass('btn-block');
    });

    it('is disabled when disabled prop is true', () => {
        const { getByRole } = render(BaseButton, {
            props: { disabled: true },
            slots: { default: 'Test' }
        });
        expect(getByRole('button')).toBeDisabled();
    });

    it('shows loading spinner when loading prop is true', () => {
        const { getByRole } = render(BaseButton, {
            props: { loading: true },
            slots: { default: 'Test' }
        });
        expect(getByRole('button')).toBeDisabled();
        expect(screen.getByRole('button')).toHaveTextContent(''); // Slot content should be hidden
        expect(screen.getByRole('button').querySelector('.spinner')).toBeInTheDocument();
    });
});
