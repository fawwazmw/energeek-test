import { render, screen } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import BaseButton from '../BaseButton.vue';

describe('BaseButton', () => {
  it('renders with default slot content', () => {
    render(BaseButton, { slots: { default: 'Click me' } });
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    const { getByRole } = render(BaseButton, { slots: { default: 'Test' } });
    expect(getByRole('button').className).toContain('bg-indigo-600');
  });

  it('applies danger variant when specified', () => {
    const { getByRole } = render(BaseButton, {
      props: { variant: 'danger' },
      slots: { default: 'Test' },
    });
    expect(getByRole('button').className).toContain('bg-red-600');
    expect(getByRole('button').className).not.toContain('bg-indigo-600');
  });

  it('applies w-full class when block prop is true', () => {
    const { getByRole } = render(BaseButton, {
      props: { block: true },
      slots: { default: 'Test' },
    });
    expect(getByRole('button').className).toContain('w-full');
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(BaseButton, {
      props: { disabled: true },
      slots: { default: 'Test' },
    });
    expect(getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner and is disabled when loading prop is true', () => {
    const { getByRole, container } = render(BaseButton, {
      props: { loading: true },
      slots: { default: 'Test' },
    });
    expect(getByRole('button')).toBeDisabled();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
