import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OutputSettingsPanel from '../../src/components/form/OutputSettingsPanel';
import { type CodecInfo, getSupportedCodecs, getSupportedCodecsForFormat } from '../../src/utils/codecSupport';

// Mock codec support utilities
vi.mock('../../src/utils/codecSupport', () => ({
  getSupportedCodecs: vi.fn(),
  getSupportedCodecsForFormat: vi.fn(),
}));

describe('OutputSettingsPanel', () => {
  const mockCodecs: CodecInfo[] = [
    { name: 'avc1', type: 'video' as const, description: 'H.264', supported: true },
    { name: 'vp8', type: 'video' as const, description: 'VP8', supported: true },
    { name: 'vp9', type: 'video' as const, description: 'VP9', supported: true },
  ];

  const defaultProps = {
    outputFormat: 'video/webm',
    selectedCodec: 'vp8',
    supportedFormats: ['video/webm', 'video/mp4'],
    onFormatChange: vi.fn(),
    onCodecChange: vi.fn(),
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSupportedCodecs).mockResolvedValue(mockCodecs);
    vi.mocked(getSupportedCodecsForFormat).mockResolvedValue({
      video: ['vp8', 'vp9'],
      audio: ['opus'],
    });
  });

  it('renders without crashing', async () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('output-settings-panel')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    expect(screen.getByText(/코덱 확인 중/i)).toBeInTheDocument();
  });

  it('displays format and codec selectors after loading', async () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('출력 포맷')).toBeInTheDocument();
      expect(screen.getByText('비디오 코덱')).toBeInTheDocument();
    });
  });

  it('renders WebM and MP4 format options', async () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const formatSelect = screen.getByRole('combobox');
    expect(formatSelect).toHaveValue('video/webm');

    const options = screen.getAllByRole('option');
    expect(options.some((opt) => opt.textContent?.includes('WebM'))).toBe(true);
    expect(options.some((opt) => opt.textContent?.includes('MP4'))).toBe(true);
  });

  it('calls onFormatChange when format is changed', async () => {
    const onFormatChange = vi.fn();
    render(<OutputSettingsPanel {...defaultProps} onFormatChange={onFormatChange} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const formatSelect = screen.getByRole('combobox');
    fireEvent.change(formatSelect, { target: { value: 'video/mp4' } });

    expect(onFormatChange).toHaveBeenCalledWith('video/mp4');
  });

  it('displays filtered codecs for selected format', async () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('vp8')).toBeInTheDocument();
      expect(screen.getByText('vp9')).toBeInTheDocument();
    });
  });

  it('calls onCodecChange when codec is selected', async () => {
    const onCodecChange = vi.fn();
    render(<OutputSettingsPanel {...defaultProps} onCodecChange={onCodecChange} />);

    await waitFor(() => {
      expect(screen.getByText('vp9')).toBeInTheDocument();
    });

    const vp9Radio = screen.getByRole('radio', { name: /vp9/i });
    fireEvent.click(vp9Radio);

    expect(onCodecChange).toHaveBeenCalledWith('vp9');
  });

  it('highlights selected codec', async () => {
    render(<OutputSettingsPanel {...defaultProps} selectedCodec="vp9" />);

    await waitFor(() => {
      expect(screen.getByText('선택됨')).toBeInTheDocument();
    });
  });

  it('shows compatibility message for valid codec-format combination', async () => {
    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/조합은 호환됩니다/i)).toBeInTheDocument();
    });

    // Verify the compatibility message contains the key parts
    const container = screen.getByTestId('output-settings-panel');
    const compatibilitySection = container.querySelector('.bg-green-50');
    expect(compatibilitySection).toBeInTheDocument();
    expect(compatibilitySection?.textContent).toContain('WebM');
    expect(compatibilitySection?.textContent).toContain('vp8');
    expect(compatibilitySection?.textContent).toContain('조합은 호환됩니다');
  });

  it('automatically selects first compatible codec when format changes', async () => {
    const onCodecChange = vi.fn();
    vi.mocked(getSupportedCodecsForFormat).mockResolvedValue({
      video: ['avc1'],
      audio: ['aac'],
    });

    render(<OutputSettingsPanel {...defaultProps} outputFormat="video/mp4" onCodecChange={onCodecChange} />);

    await waitFor(() => {
      expect(onCodecChange).toHaveBeenCalledWith('avc1');
    });
  });

  it('shows warning when no codecs are available for format', async () => {
    vi.mocked(getSupportedCodecsForFormat).mockResolvedValue({
      video: [],
      audio: [],
    });

    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/이 포맷에 지원되는 코덱이 없습니다/i)).toBeInTheDocument();
    });
  });

  it('disables controls when disabled prop is true', async () => {
    render(<OutputSettingsPanel {...defaultProps} disabled={true} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeDisabled();
    });

    await waitFor(() => {
      const radios = screen.queryAllByRole('radio');
      if (radios.length > 0) {
        radios.forEach((radio) => {
          expect(radio).toBeDisabled();
        });
      }
    });
  });

  it('handles codec loading error gracefully', async () => {
    vi.mocked(getSupportedCodecs).mockRejectedValue(new Error('Failed to load codecs'));

    render(<OutputSettingsPanel {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText(/코덱 정보를 불러오는 중 오류가 발생했습니다/i)).toBeInTheDocument();
    });
  });

  it('uses fallback codec when filtering fails', async () => {
    const onCodecChange = vi.fn();
    vi.mocked(getSupportedCodecsForFormat).mockRejectedValue(new Error('Filtering failed'));

    render(<OutputSettingsPanel {...defaultProps} outputFormat="video/webm" onCodecChange={onCodecChange} />);

    await waitFor(() => {
      // Should fallback to vp8 for webm format
      expect(onCodecChange).toHaveBeenCalledWith('vp8');
    });
  });

  it('marks unsupported formats as disabled in dropdown', async () => {
    render(<OutputSettingsPanel {...defaultProps} supportedFormats={['video/webm']} />);

    await waitFor(() => {
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    const mp4Option = options.find((opt) => opt.value === 'video/mp4');

    expect(mp4Option?.disabled).toBe(true);
    expect(mp4Option?.textContent).toContain('미지원');
  });
});
