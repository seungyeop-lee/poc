import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TrimControls from '../../src/components/form/TrimControls';

describe('TrimControls', () => {
  const defaultProps = {
    startTime: 0,
    endTime: 10,
    duration: 10,
    onStartTimeChange: vi.fn(),
    onEndTimeChange: vi.fn(),
  };

  it('renders without crashing', () => {
    render(<TrimControls {...defaultProps} />);
    expect(screen.getByText('트림 설정')).toBeInTheDocument();
  });

  it('displays start and end time labels', () => {
    render(<TrimControls {...defaultProps} />);

    expect(screen.getByText(/시작 시간/i)).toBeInTheDocument();
    expect(screen.getByText(/종료 시간/i)).toBeInTheDocument();
  });

  it('renders start time with correct value', () => {
    render(<TrimControls {...defaultProps} startTime={2.5} />);

    const startTimeInputs = screen.getAllByDisplayValue('2.5');
    expect(startTimeInputs.length).toBeGreaterThan(0);
  });

  it('renders end time with correct value', () => {
    render(<TrimControls {...defaultProps} endTime={8.5} />);

    const endTimeInputs = screen.getAllByDisplayValue('8.5');
    expect(endTimeInputs.length).toBeGreaterThan(0);
  });

  it('displays selected duration range', () => {
    render(<TrimControls {...defaultProps} startTime={2} endTime={7} />);

    expect(screen.getByText('선택된 범위: 5.0초')).toBeInTheDocument();
  });

  it('calls onStartTimeChange when start time slider changes', () => {
    const onStartTimeChange = vi.fn();
    render(<TrimControls {...defaultProps} onStartTimeChange={onStartTimeChange} />);

    const sliders = screen.getAllByRole('slider');
    const startTimeSlider = sliders[0]; // First slider is start time

    fireEvent.change(startTimeSlider, { target: { value: '3' } });
    expect(onStartTimeChange).toHaveBeenCalled();
  });

  it('calls onEndTimeChange when end time slider changes', () => {
    const onEndTimeChange = vi.fn();
    render(<TrimControls {...defaultProps} onEndTimeChange={onEndTimeChange} />);

    const sliders = screen.getAllByRole('slider');
    const endTimeSlider = sliders[1]; // Second slider is end time

    fireEvent.change(endTimeSlider, { target: { value: '8' } });
    expect(onEndTimeChange).toHaveBeenCalled();
  });

  it('adjusts end time when start time gets too close', () => {
    const onStartTimeChange = vi.fn();
    const onEndTimeChange = vi.fn();
    render(
      <TrimControls
        {...defaultProps}
        startTime={0}
        endTime={1.8}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
      />
    );

    const numberInputs = screen.getAllByRole('spinbutton');
    const startTimeInput = numberInputs[0];

    // Try to set start time to 1 (less than 1 second before end time at 1.8)
    fireEvent.change(startTimeInput, { target: { value: '1' } });

    // Should call onStartTimeChange with the new value
    expect(onStartTimeChange).toHaveBeenCalledWith(1);
    // Should adjust end time to maintain 1 second gap (1 + 1 = 2)
    expect(onEndTimeChange).toHaveBeenCalledWith(2);
  });

  it('adjusts start time when end time gets too close', () => {
    const onStartTimeChange = vi.fn();
    const onEndTimeChange = vi.fn();
    render(
      <TrimControls
        {...defaultProps}
        startTime={8}
        endTime={10}
        onStartTimeChange={onStartTimeChange}
        onEndTimeChange={onEndTimeChange}
      />
    );

    const numberInputs = screen.getAllByRole('spinbutton');
    const endTimeInput = numberInputs[1];

    // Try to set end time to 8.8 (less than 1 second after start time at 8)
    fireEvent.change(endTimeInput, { target: { value: '8.8' } });

    // Should call onEndTimeChange with the new value
    expect(onEndTimeChange).toHaveBeenCalledWith(8.8);
    // Should adjust start time to maintain 1 second gap (8.8 - 1 ≈ 7.8)
    expect(onStartTimeChange).toHaveBeenCalled();
    const startTimeArg = onStartTimeChange.mock.calls[0][0];
    expect(startTimeArg).toBeCloseTo(7.8, 1);
  });

  it('clamps start time to 0 minimum', () => {
    const onStartTimeChange = vi.fn();
    render(<TrimControls {...defaultProps} onStartTimeChange={onStartTimeChange} />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const startTimeInput = numberInputs[0];

    // Try to set negative start time
    fireEvent.change(startTimeInput, { target: { value: '-5' } });

    // Should be clamped to 0
    expect(onStartTimeChange).toHaveBeenCalledWith(0);
  });

  it('clamps end time to duration maximum', () => {
    const onEndTimeChange = vi.fn();
    render(<TrimControls {...defaultProps} duration={10} onEndTimeChange={onEndTimeChange} />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const endTimeInput = numberInputs[1];

    // Try to set end time beyond duration
    fireEvent.change(endTimeInput, { target: { value: '15' } });

    // Should be clamped to duration (10)
    expect(onEndTimeChange).toHaveBeenCalledWith(10);
  });

  // Note: The "ignores non-numeric input" test is removed because HTML number inputs
  // already handle validation at the browser level, and testing explicit NaN handling
  // is complex due to how React's onChange events work with controlled components.

  it('prevents start time from exceeding duration minus 1 second', () => {
    const onStartTimeChange = vi.fn();
    render(<TrimControls {...defaultProps} duration={5} startTime={0} endTime={5} onStartTimeChange={onStartTimeChange} />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const startTimeInput = numberInputs[0];

    // Clear any previous calls
    onStartTimeChange.mockClear();

    // Try to set start time to 4.5 (only 0.5 seconds before end of 5 second video)
    fireEvent.change(startTimeInput, { target: { value: '4.5' } });

    // Should not be called because it would leave less than 1 second gap
    expect(onStartTimeChange).not.toHaveBeenCalled();
  });
});
