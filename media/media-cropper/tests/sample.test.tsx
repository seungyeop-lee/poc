import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// Simple test component
function HelloWorld({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

describe('Sample Test', () => {
  it('renders a greeting', () => {
    render(<HelloWorld name="Vitest" />);
    expect(screen.getByText(/Hello, Vitest!/i)).toBeInTheDocument();
  });

  it('checks DOM manipulation', () => {
    const div = document.createElement('div');
    div.textContent = 'Test';
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});
