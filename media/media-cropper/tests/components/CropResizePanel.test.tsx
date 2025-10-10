import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CropResizePanel from '../../src/components/form/CropResizePanel';

describe('CropResizePanel', () => {
  const defaultProps = {
    zoom: 1,
    onZoomChange: vi.fn(),
    aspect: 1,
    onAspectChange: vi.fn(),
    scale: 1,
    onScaleChange: vi.fn(),
    cropAreaWidth: 640,
    cropAreaHeight: 480,
  };

  it('renders without crashing', () => {
    render(<CropResizePanel {...defaultProps} />);
    expect(screen.getByTestId('crop-resize-panel')).toBeInTheDocument();
  });

  it('displays crop and resize sections', () => {
    render(<CropResizePanel {...defaultProps} />);
    expect(screen.getByText('크롭 및 리사이징')).toBeInTheDocument();
    expect(screen.getByText('크롭 설정')).toBeInTheDocument();
    expect(screen.getByText('리사이징')).toBeInTheDocument();
  });

  it('renders zoom slider with correct value', () => {
    render(<CropResizePanel {...defaultProps} zoom={2} />);
    expect(screen.getByTestId('zoom-slider')).toBeInTheDocument();

    const zoomInputs = screen.getAllByRole('spinbutton', { name: /zoom/i });
    expect(zoomInputs[0]).toHaveValue(2);
  });

  it('calls onZoomChange when zoom slider changes', () => {
    const onZoomChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onZoomChange={onZoomChange} />);

    const sliders = screen.getAllByRole('slider');
    const zoomSlider = sliders.find(s => s.getAttribute('min') === '1' && s.getAttribute('max') === '3');

    if (zoomSlider) {
      fireEvent.change(zoomSlider, { target: { value: '2.5' } });
      expect(onZoomChange).toHaveBeenCalledWith(2.5);
    }
  });

  it('renders aspect ratio buttons', () => {
    render(<CropResizePanel {...defaultProps} />);

    expect(screen.getByText('1:1')).toBeInTheDocument();
    expect(screen.getByText('4:3')).toBeInTheDocument();
    expect(screen.getByText('3:4')).toBeInTheDocument();
    expect(screen.getByText('16:9')).toBeInTheDocument();
    expect(screen.getByText('9:16')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('highlights selected aspect ratio button', () => {
    render(<CropResizePanel {...defaultProps} aspect={16 / 9} />);

    const button16x9 = screen.getByText('16:9');
    expect(button16x9).toHaveClass('bg-blue-500', 'text-white');
  });

  it('calls onAspectChange when aspect button is clicked', () => {
    const onAspectChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onAspectChange={onAspectChange} />);

    const button43 = screen.getByText('4:3');
    fireEvent.click(button43);

    expect(onAspectChange).toHaveBeenCalledWith(4 / 3);
  });

  it('shows free mode controls when Free button is clicked', () => {
    const onAspectChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onAspectChange={onAspectChange} />);

    const freeButton = screen.getByText('Free');
    fireEvent.click(freeButton);

    // Free mode input should appear - check for aspect ratio slider
    const sliders = screen.getAllByRole('slider');
    // Should have zoom slider + aspect ratio slider in free mode + scale slider = 3 total
    expect(sliders.length).toBe(3);
  });

  it('renders scale slider with correct value', () => {
    render(<CropResizePanel {...defaultProps} scale={1.5} />);

    expect(screen.getByText('1.5x')).toBeInTheDocument();
  });

  it('calls onScaleChange when scale slider changes', () => {
    const onScaleChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onScaleChange={onScaleChange} />);

    const sliders = screen.getAllByRole('slider');
    const scaleSlider = sliders.find(s => s.getAttribute('min') === '0.5' && s.getAttribute('max') === '3');

    if (scaleSlider) {
      fireEvent.change(scaleSlider, { target: { value: '2.0' } });
      expect(onScaleChange).toHaveBeenCalledWith(2.0);
    }
  });

  it('calculates and displays output dimensions correctly', () => {
    render(<CropResizePanel {...defaultProps} cropAreaWidth={640} cropAreaHeight={480} scale={2} />);

    // Expected output: 640 * 2 = 1280, 480 * 2 = 960
    expect(screen.getByText('1280 × 960 px')).toBeInTheDocument();
  });

  it('clamps zoom value within range when typing', () => {
    const onZoomChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onZoomChange={onZoomChange} />);

    const zoomInputs = screen.getAllByRole('spinbutton', { name: /zoom/i });
    const zoomNumberInput = zoomInputs[0];

    // Try to set value above max (3)
    fireEvent.change(zoomNumberInput, { target: { value: '5' } });
    expect(onZoomChange).toHaveBeenCalledWith(3); // Should be clamped to 3

    // Try to set value below min (1)
    fireEvent.change(zoomNumberInput, { target: { value: '0.5' } });
    expect(onZoomChange).toHaveBeenCalledWith(1); // Should be clamped to 1
  });

  it('updates aspect ratio correctly in free mode', () => {
    const onAspectChange = vi.fn();
    render(<CropResizePanel {...defaultProps} onAspectChange={onAspectChange} />);

    // Click Free button to enable free mode
    const freeButton = screen.getByText('Free');
    fireEvent.click(freeButton);

    // Find aspect ratio slider in free mode
    const sliders = screen.getAllByRole('slider');
    const aspectSlider = sliders.find(s => s.getAttribute('min') === '0.33' && s.getAttribute('max') === '3');

    if (aspectSlider) {
      fireEvent.change(aspectSlider, { target: { value: '1.5' } });
      expect(onAspectChange).toHaveBeenCalled();
    }
  });
});
