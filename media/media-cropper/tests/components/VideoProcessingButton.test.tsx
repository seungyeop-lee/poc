import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VideoProcessingButton from '../../src/components/video/VideoProcessingButton';

// Mock LoadingSpinner component
vi.mock('../../src/components/ui', () => ({
  LoadingSpinner: ({ message, progress }: { message: string; progress: number }) => (
    <div data-testid="loading-spinner">
      {message} - {progress}%
    </div>
  ),
}));

describe('VideoProcessingButton', () => {
  const defaultProps = {
    isProcessing: false,
    progress: 0,
    onCropAndTrim: vi.fn(),
    disabled: false,
  };

  it('renders without crashing', () => {
    render(<VideoProcessingButton {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays default label when not processing', () => {
    render(<VideoProcessingButton {...defaultProps} />);
    expect(screen.getByText('크롭 및 트림 실행')).toBeInTheDocument();
  });

  it('displays custom label when provided', () => {
    render(<VideoProcessingButton {...defaultProps} label="커스텀 라벨" />);
    expect(screen.getByText('커스텀 라벨')).toBeInTheDocument();
  });

  it('calls onCropAndTrim when clicked', () => {
    const onCropAndTrim = vi.fn();
    render(<VideoProcessingButton {...defaultProps} onCropAndTrim={onCropAndTrim} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onCropAndTrim).toHaveBeenCalledTimes(1);
  });

  it('is enabled by default', () => {
    render(<VideoProcessingButton {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<VideoProcessingButton {...defaultProps} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('is disabled when isProcessing is true', () => {
    render(<VideoProcessingButton {...defaultProps} isProcessing={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading spinner when processing', () => {
    render(<VideoProcessingButton {...defaultProps} isProcessing={true} progress={50} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText(/처리 중\.\.\. - 50%/)).toBeInTheDocument();
  });

  it('displays custom processing label when provided', () => {
    render(
      <VideoProcessingButton
        {...defaultProps}
        isProcessing={true}
        progress={75}
        processingLabel="인코딩 중..."
      />
    );

    expect(screen.getByText(/인코딩 중\.\.\. - 75%/)).toBeInTheDocument();
  });

  it('updates progress display when progress changes', () => {
    const { rerender } = render(
      <VideoProcessingButton {...defaultProps} isProcessing={true} progress={25} />
    );

    expect(screen.getByText(/처리 중\.\.\. - 25%/)).toBeInTheDocument();

    rerender(<VideoProcessingButton {...defaultProps} isProcessing={true} progress={75} />);

    expect(screen.getByText(/처리 중\.\.\. - 75%/)).toBeInTheDocument();
  });

  it('switches from processing to idle state', () => {
    const { rerender } = render(
      <VideoProcessingButton {...defaultProps} isProcessing={true} progress={50} />
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    rerender(<VideoProcessingButton {...defaultProps} isProcessing={false} progress={0} />);

    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    expect(screen.getByText('크롭 및 트림 실행')).toBeInTheDocument();
  });

  it('does not call onCropAndTrim when disabled', () => {
    const onCropAndTrim = vi.fn();
    render(<VideoProcessingButton {...defaultProps} disabled={true} onCropAndTrim={onCropAndTrim} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onCropAndTrim).not.toHaveBeenCalled();
  });

  it('does not call onCropAndTrim when processing', () => {
    const onCropAndTrim = vi.fn();
    render(<VideoProcessingButton {...defaultProps} isProcessing={true} onCropAndTrim={onCropAndTrim} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onCropAndTrim).not.toHaveBeenCalled();
  });

  it('applies correct styling classes', () => {
    render(<VideoProcessingButton {...defaultProps} />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('bg-blue-500', 'text-white', 'rounded-lg');
  });

  it('applies disabled styling when disabled', () => {
    render(<VideoProcessingButton {...defaultProps} disabled={true} />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
  });
});
