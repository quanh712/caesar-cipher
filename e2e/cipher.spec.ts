import { expect, test } from "@playwright/test";

test("encrypts the generated example", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Caesar Cipher" })).toBeVisible();
  await expect(page).toHaveTitle("Caesar Cipher | Encode and Decode");
  await expect(page.getByText("Bảng dịch chuyển")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await page.getByRole("button", { name: "Generate example" }).click();
  await page.getByRole("button", { name: "Mã hóa" }).click();

  await expect(page.getByText("Khoor Zruog")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Mã hóa thành công");

  await page.getByRole("tab", { name: "Phân tích" }).click();
  await expect(page.getByText("Tổng ký tự")).toBeVisible();
  await expect(page.getByText("11", { exact: true })).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("switches to a future cipher without exposing Caesar controls", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Hill/ }).click();

  await expect(page.getByText("Thuật toán đang được chuẩn bị")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Khóa Caesar" })).toHaveCount(0);
});

test("decrypts text", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Decode/ }).click();
  await page.getByRole("textbox", { name: "Nội dung đầu vào" }).fill("Khoor Zruog");
  await page.getByRole("button", { name: "Giải mã" }).click();

  await expect(page.getByText("Hello World")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Giải mã thành công");
});

for (const scenario of [
  { mode: "encrypt", source: "Hello", expected: "Khoor", action: "Mã hóa" },
  { mode: "decrypt", source: "Khoor", expected: "Hello", action: "Giải mã" },
] as const) {
  test(`${scenario.mode}s and downloads a text file`, async ({ page }) => {
    await page.goto("/");
    if (scenario.mode === "decrypt") {
      await page.getByRole("tab", { name: /Decode/ }).click();
    }
    await page.getByRole("button", { name: "File .txt" }).click();
    await page.getByLabel("Chọn file văn bản").setInputFiles({
      name: "message.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(scenario.source),
    });
    await page.getByRole("button", { name: scenario.action }).click();

    await expect(page.getByText(scenario.expected, { exact: true })).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(`message_${scenario.mode}.txt`);
  });
}
