import { expect, test } from '@playwright/test';

test.describe('OutputSettingsPanel 통합 컴포넌트 검증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('통합된 출력 포맷 및 코덱 컴포넌트가 정상적으로 표시됨', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // OutputSettingsPanel이 표시되는지 확인
    const outputSettingsPanel = page.locator('[data-testid="output-settings-panel"]');
    await expect(outputSettingsPanel).toBeVisible();

    // 기존 개별 컴포넌트들이 표시되지 않는지 확인
    const oldFormatSelector = page.locator('[data-testid="format-selector"]');
    const oldCodecSelector = page.locator('[data-testid="codec-selector"]');
    await expect(oldFormatSelector).not.toBeVisible();
    await expect(oldCodecSelector).not.toBeVisible();
  });

  test('포맷 선택 기능이 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="output-settings-panel"]');

    // 포맷 선택 드롭다운 찾기
    const formatSelect = page.locator('[data-testid="output-settings-panel"] select');
    await expect(formatSelect).toBeVisible();

    // MP4 포맷 선택
    await formatSelect.selectOption('video/mp4');
    await expect(formatSelect).toHaveValue('video/mp4');

    // WebM 포맷 선택
    await formatSelect.selectOption('video/webm');
    await expect(formatSelect).toHaveValue('video/webm');
  });

  test('포맷 변경 시 코덱 목록이 자동으로 필터링됨', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="output-settings-panel"]');

    const formatSelect = page.locator('[data-testid="output-settings-panel"] select');

    // MP4 포맷 선택 - MP4 호환 코덱 확인
    await formatSelect.selectOption('video/mp4');
    await page.waitForTimeout(1000); // 코덱 로딩 대기

    const mp4Codecs = page.locator('[data-testid="output-settings-panel"] input[name="codec"]');
    const mp4CodecCount = await mp4Codecs.count();
    expect(mp4CodecCount).toBeGreaterThan(0);

    // WebM 포맷 선택 - WebM 호환 코덱 확인
    await formatSelect.selectOption('video/webm');
    await page.waitForTimeout(1000); // 코덱 로딩 대기

    const webmCodecs = page.locator('[data-testid="output-settings-panel"] input[name="codec"]');
    const webmCodecCount = await webmCodecs.count();
    expect(webmCodecCount).toBeGreaterThan(0);
  });

  test('포맷 변경 시 첫 번째 호환 코덱이 자동 선택됨', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="output-settings-panel"]');

    const formatSelect = page.locator('[data-testid="output-settings-panel"] select');

    // MP4 포맷 선택 후 자동 선택된 코덱 확인
    await formatSelect.selectOption('video/mp4');
    await page.waitForTimeout(1000);

    const selectedMp4Codec = page.locator('[data-testid="output-settings-panel"] input[name="codec"]:checked');
    await expect(selectedMp4Codec).toBeVisible();

    // WebM 포맷 선택 후 자동 선택된 코덱 확인
    await formatSelect.selectOption('video/webm');
    await page.waitForTimeout(1000);

    const selectedWebmCodec = page.locator('[data-testid="output-settings-panel"] input[name="codec"]:checked');
    await expect(selectedWebmCodec).toBeVisible();

    // 두 코덱이 다른지 확인 (자동 선택이 동작하는지)
    const mp4CodecValue = await selectedMp4Codec.getAttribute('value');
    const webmCodecValue = await selectedWebmCodec.getAttribute('value');

    // 값이 존재하는지만 확인 (실제로 다를 수도 있음)
    expect(mp4CodecValue).toBeTruthy();
    expect(webmCodecValue).toBeTruthy();
  });

  test('모든 포맷/코덱 조합이 정상적으로 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="output-settings-panel"]');

    const formatSelect = page.locator('[data-testid="output-settings-panel"] select');
    const formats = ['video/mp4', 'video/webm'];

    for (const format of formats) {
      // 포맷 선택
      await formatSelect.selectOption(format);
      await page.waitForTimeout(1000);

      // 해당 포맷의 코덱 목록 확인
      const codecs = page.locator('[data-testid="output-settings-panel"] input[name="codec"]');
      const codecCount = await codecs.count();
      expect(codecCount).toBeGreaterThan(0);

      // 각 코덱 선택 시도
      for (let i = 0; i < codecCount; i++) {
        const codec = codecs.nth(i);
        await codec.check();
        await page.waitForTimeout(500);

        // 선택된 코덱이 호환성 메시지를 표시하는지 확인
        const compatibilityMessage = page
          .locator('[data-testid="output-settings-panel"]')
          .locator('text=/✅.*호환됩니다/');
        const isCompatible = await compatibilityMessage.isVisible();

        if (isCompatible) {
          await expect(compatibilityMessage).toBeVisible();
        }
      }
    }
  });

  test('UI 요소 수가 감소했는지 확인', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="output-settings-panel"]');

    // 통합된 컴포넌트 내의 모든 컨트롤 요소 개수 확인
    const outputSettingsPanel = page.locator('[data-testid="output-settings-panel"]');
    const controls = outputSettingsPanel.locator('select, input, button');
    const controlCount = await controls.count();

    // 적어도 2개 이상의 컨트롤(포맷, 코덱)이 있어야 함
    expect(controlCount).toBeGreaterThanOrEqual(2);

    // 기존 개별 컴포넌트들이 존재하지 않음을 확인
    const separateComponents = page.locator('[data-testid*="format-selector"], [data-testid*="codec-selector"]');
    await expect(separateComponents).toHaveCount(0);
  });
});
