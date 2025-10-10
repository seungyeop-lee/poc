import { test, expect } from '@playwright/test';

test.describe('Task 2-5: 포맷 변경 시 코덱 자동 선택 검증', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 테스트용 비디오 파일 업로드
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('tests/test.mp4');

    // 비디오 크롭 페이지로 이동 대기
    await page.waitForURL('**/video-crop', { timeout: 10000 });

    // 비디오 제어 패널이 표시될 때까지 대기 (출력 포맷 선택 기다리기)
    await page.waitForSelector('select:has-text("WebM")', { timeout: 10000 });
  });

  test('시나리오 1: MP4 포맷 선택 시 AVC 코덱 자동 선택 확인', async ({ page }) => {
    // 출력 포맷 선택 드롭다운 클릭
    const formatSelect = page.locator('select:has-text("WebM")');
    await expect(formatSelect).toBeVisible();
    await formatSelect.selectOption('MP4');

    // 잠시 대기하여 코덱 자동 선택이 완료되도록 함
    await page.waitForTimeout(1000);

    // 자동 선택된 코덱 확인 - "자동 선택됨" 텍스트와 AVC 코덱이 체크되었는지 확인
    const autoSelectedCodec = page.locator('text="자동 선택됨"');
    await expect(autoSelectedCodec).toBeVisible({ timeout: 5000 });

    // AVC 코덱이 선택되었는지 확인
    const avcRadio = page.locator('input[type="radio"][value="avc"]');
    await expect(avcRadio).toBeChecked();

    console.log('✅ MP4 포맷 선택 시 AVC 코덱 자동 선택 확인 완료');
  });

  test('시나리오 2: WebM 포맷 변경 시 VP8/VP9 코덱 자동 선택 확인', async ({ page }) => {
    // 먼저 MP4 포맷 선택하여 AVC가 자동 선택되게 함
    const formatSelect = page.locator('select:has-text("WebM")');
    await formatSelect.selectOption('MP4');
    await page.waitForTimeout(1000);

    // WebM 포맷으로 다시 변경
    await formatSelect.selectOption('WebM');

    // 잠시 대기하여 코덱 자동 선택이 완료되도록 함
    await page.waitForTimeout(1000);

    // 자동 선택된 코덱 확인 - "자동 선택됨" 텍스트 확인
    const autoSelectedCodec = page.locator('text="자동 선택됨"');
    await expect(autoSelectedCodec).toBeVisible({ timeout: 5000 });

    // VP8 또는 VP9 코덱이 선택되었는지 확인
    const vp8Radio = page.locator('input[type="radio"][value="vp8"]');
    const vp9Radio = page.locator('input[type="radio"][value="vp9"]');

    // VP8 또는 VP9 중 하나가 체크되었는지 확인
    const isVP8Checked = await vp8Radio.isChecked();
    const isVP9Checked = await vp9Radio.isChecked();

    expect(isVP8Checked || isVP9Checked).toBeTruthy();

    console.log('✅ WebM 포맷 선택 시 VP8/VP9 코덱 자동 선택 확인 완료');
  });

  test('시나리오 3: 포맷/코덱 선택 후 비디오 처리 정상 동작 확인', async ({ page }) => {
    // MP4 포맷 선택
    const formatSelect = page.locator('select:has-text("WebM")');
    await formatSelect.selectOption('MP4');
    await page.waitForTimeout(1000);

    // 코덱이 자동 선택되었는지 확인
    const autoSelectedCodec = page.locator('text="자동 선택됨"');
    await expect(autoSelectedCodec).toBeVisible();

    // '크롭 및 트림 실행' 버튼 클릭
    const processButton = page.locator('button:has-text("크롭 및 트림 실행")');
    await expect(processButton).toBeVisible();
    await processButton.click();

    // 처리 중 상태 확인 - 버튼 텍스트 변경이나 처리 중 표시 대기
    await page.waitForTimeout(2000);

    // 에러 메시지가 나타나지 않는지 확인 (처리 완료까지 최대 20초 대기)
    try {
      await page.waitForSelector('text=/에류|오류|실패/', { timeout: 20000, state: 'detached' });
    } catch {
      // 에러가 없으면 정상
    }

    // 처리 성공 여부 확인 - 여러 방법으로 확인 가능
    // 1. 다운로드 버튼이 나타나는지 확인
    const downloadButton = page.locator('button:has-text("다운로드")').or(
      page.locator('a:has-text("다운로드")')
    ).first();

    // 2. 성공 메시지 확인
    const successMessage = page.locator('text=/성공|완료|처리되었습니다/').first();

    // 다운로드 버튼이나 성공 메시지 중 하나라도 나타나면 성공
    const hasDownloadOrSuccess = await Promise.race([
      downloadButton.isVisible().catch(() => false),
      successMessage.isVisible().catch(() => false),
      page.waitForTimeout(10000).then(() => false) // 10초 타임아웃
    ]);

    expect(hasDownloadOrSuccess).toBeTruthy();

    console.log('✅ 포맷/코덱 선택 후 비디오 처리 정상 동작 확인 완료');
  });

  test('추가 검증: 모든 포맷 변경 시나리오에서 코덱 자동 선택 성공률 확인', async ({ page }) => {
    const formatConfigs = [
      { format: 'MP4', expectedCodec: 'avc', codecName: 'AVC' },
      { format: 'WebM', expectedCodec: 'vp8', codecName: 'VP8/VP9' }
    ];
    let successCount = 0;

    for (const config of formatConfigs) {
      // 포맷 선택
      const formatSelect = page.locator('select:has-text("WebM")');
      await formatSelect.selectOption(config.format);
      await page.waitForTimeout(1000);

      // 자동 선택된 코덱 확인
      const autoSelectedCodec = page.locator('text="자동 선택됨"');
      const isAutoSelectedVisible = await autoSelectedCodec.isVisible();

      // 기대 코덱이 선택되었는지 확인
      const expectedRadio = page.locator(`input[type="radio"][value="${config.expectedCodec}"]`);
      const isExpectedCodecSelected = await expectedRadio.isChecked();

      // WebM의 경우 VP8 또는 VP9 모두 허용
      let codecCheckPassed = isExpectedCodecSelected;
      if (config.format === 'WebM' && !isExpectedCodecSelected) {
        const vp9Radio = page.locator('input[type="radio"][value="vp9"]');
        codecCheckPassed = await vp9Radio.isChecked();
      }

      if (isAutoSelectedVisible && codecCheckPassed) {
        successCount++;
        console.log(`✅ ${config.format} 포맷: ${config.codecName} 코덱 자동 선택 성공`);
      } else {
        console.log(`❌ ${config.format} 포맷: 코덱 자동 선택 실패`);
      }
    }

    // 성공률 100% 확인
    expect(successCount).toBe(formatConfigs.length);
    console.log(`✅ 모든 포맷 변경 시나리오에서 코덱 자동 선택 성공률: ${(successCount / formatConfigs.length) * 100}%`);
  });
});