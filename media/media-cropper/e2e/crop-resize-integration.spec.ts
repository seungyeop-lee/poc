import { expect, test } from '@playwright/test';

test.describe('CropResizePanel 통합 컴포넌트 검증', () => {
  test.beforeEach(async ({ page }) => {
    // 개발 서버가 실행 중인지 확인하고 필요시 시작
    await page.goto('http://localhost:5173');
  });

  test('통합된 크롭 및 리사이징 컴포넌트가 정상적으로 표시됨', async ({ page }) => {
    // 비디오 파일 업로드
    const fileInput = page.locator('input[type="file"]');
    const testVideoPath = './e2e/test.mp4';

    // 파일 업로드 대기
    await fileInput.setInputFiles(testVideoPath);
    await page.waitForSelector('[data-testid="crop-resize-panel"]', { timeout: 10000 });

    // 통합된 CropResizePanel이 표시되는지 확인
    const cropResizePanel = page.locator('[data-testid="crop-resize-panel"]');
    await expect(cropResizePanel).toBeVisible();

    // 기존 개별 컴포넌트들이 표시되지 않는지 확인
    const oldCropControls = page.locator('[data-testid="crop-controls"]');
    const oldResizeSlider = page.locator('[data-testid="resize-scale-slider"]');
    await expect(oldCropControls).not.toBeVisible();
    await expect(oldResizeSlider).not.toBeVisible();
  });

  test('줌 슬라이더 기능이 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 줌 슬라이더 찾기 및 조작
    const zoomSlider = page.locator('[data-testid="zoom-slider"] input[type="range"]');
    await expect(zoomSlider).toBeVisible();

    // 줌 슬라이더 조작
    await zoomSlider.fill('1.5');
    await expect(zoomSlider).toHaveValue('1.5');
  });

  test('비율 선택 기능이 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 비율 선택 드롭다운 찾기 및 조작
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    await expect(aspectRatioSelect).toBeVisible();

    // 특정 비율 선택 (버튼 클릭)
    const ratioButton = aspectRatioSelect.locator('button:has-text("16:9")');
    await ratioButton.click();
  });

  test('스케일 슬라이더 기능이 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 스케일 슬라이더 찾기 및 조작
    const scaleSlider = page.locator('[data-testid="scale-slider"] input[type="range"]');
    await expect(scaleSlider).toBeVisible();

    // 스케일 슬라이더 조작
    await scaleSlider.fill('1.2');
    await expect(scaleSlider).toHaveValue('1.2');
  });

  test('모든 크롭 및 리사이징 기능이 통합된 UI에서 동시에 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 줌 설정
    const zoomSlider = page.locator('[data-testid="zoom-slider"] input[type="range"]');
    await zoomSlider.evaluate((el: HTMLInputElement) => (el.value = '2.0'));
    await zoomSlider.dispatchEvent('input');

    // 비율 설정
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    const ratioButton = aspectRatioSelect.locator('button:has-text("4:3")');
    await ratioButton.click();

    // 스케일 설정
    const scaleSlider = page.locator('[data-testid="scale-slider"] input[type="range"]');
    await scaleSlider.evaluate((el: HTMLInputElement) => (el.value = '1.5'));
    await scaleSlider.dispatchEvent('input');

    // 모든 설정이 적용되었는지 확인
    await expect(zoomSlider).toHaveValue('2');
    await expect(scaleSlider).toHaveValue('1.5');
  });

  test('UI 요소 수가 감소했는지 확인', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 통합된 컴포넌트 내의 모든 컨트롤 요소 개수 확인
    const cropResizePanel = page.locator('[data-testid="crop-resize-panel"]');
    const controls = cropResizePanel.locator('input, select, button');
    const controlCount = await controls.count();

    // 적어도 3개 이상의 컨트롤(줌, 비율, 스케일)이 있어야 함
    expect(controlCount).toBeGreaterThanOrEqual(3);

    // 기존 개별 컴포넌트들이 존재하지 않음을 확인
    const separateComponents = page.locator('[data-testid*="crop-controls"], [data-testid*="resize-scale"]');
    await expect(separateComponents).toHaveCount(0);
  });

  test('3:4 종횡비 버튼이 존재하고 클릭 시 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 3:4 버튼 찾기 및 존재 확인
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    const ratioButton = aspectRatioSelect.locator('button:has-text("3:4")');
    await expect(ratioButton).toBeVisible();

    // 3:4 버튼 클릭
    await ratioButton.click();
  });

  test('9:16 종횡비 버튼이 존재하고 클릭 시 정상 동작함', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // 9:16 버튼 찾기 및 존재 확인
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    const ratioButton = aspectRatioSelect.locator('button:has-text("9:16")');
    await expect(ratioButton).toBeVisible();

    // 9:16 버튼 클릭
    await ratioButton.click();
  });

  test('Free 모드에서 0.33 입력 시 정상 적용됨', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // Free 버튼 클릭
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    const freeButton = aspectRatioSelect.locator('button:has-text("Free")');
    await freeButton.click();

    // Free 모드 number input에 0.33 입력
    const aspectInput = aspectRatioSelect.locator('input[type="number"]');
    await aspectInput.fill('0.33');
    await expect(aspectInput).toHaveValue('0.33');
  });

  test('Free 모드에서 0.33 미만 입력 시 0.33으로 클램핑됨', async ({ page }) => {
    await page.goto('http://localhost:5173');

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./e2e/test.mp4');
    await page.waitForSelector('[data-testid="crop-resize-panel"]');

    // Free 버튼 클릭
    const aspectRatioSelect = page.locator('[data-testid="aspect-ratio-select"]');
    const freeButton = aspectRatioSelect.locator('button:has-text("Free")');
    await freeButton.click();

    // Free 모드 number input에 0.32 입력
    const aspectInput = aspectRatioSelect.locator('input[type="number"]');
    await aspectInput.fill('0.32');

    // blur 이벤트 발생시켜 클램핑 트리거
    await aspectInput.blur();

    // 0.33으로 클램핑되었는지 확인
    await expect(aspectInput).toHaveValue('0.33');
  });
});
