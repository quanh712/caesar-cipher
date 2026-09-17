import { expect, test } from "@playwright/test";

test("encrypts the generated example", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Cipher Workbench" })).toBeVisible();
  await expect(page).toHaveTitle("Cipher Workbench | Encode and Decode");
  await expect(page.getByText("Bảng dịch chuyển")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(
    false,
  );

  await expect(page.getByText("Bản demo giả lập")).toBeVisible();
  await page.getByRole("button", { name: "Tạo ví dụ" }).click();
  await page.getByRole("button", { name: "Mã hóa" }).click();

  await expect(page.getByText("Khoor Zruog")).toBeVisible();
  await expect(page.getByText("Mã hóa thành công.", { exact: true })).toBeVisible();

  await page.getByRole("tab", { name: "Phân tích" }).click();
  await expect(page.getByText("Tổng ký tự")).toBeVisible();
  await expect(page.getByText("11", { exact: true })).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test("decrypts text", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: /Giải mã/ }).click();
  await page.getByRole("textbox", { name: "Nội dung đầu vào" }).fill("Khoor Zruog");
  await page.getByRole("textbox", { name: "Khóa Caesar" }).fill("3");
  await page.getByRole("button", { name: "Giải mã" }).click();

  await expect(page.getByText("Hello World")).toBeVisible();
  await expect(page.getByText("Giải mã thành công.", { exact: true })).toBeVisible();
});

for (const scenario of [
  { mode: "encrypt", source: "Hello", expected: "Khoor", action: "Mã hóa" },
  { mode: "decrypt", source: "Khoor", expected: "Hello", action: "Giải mã" },
] as const) {
  test(`${scenario.mode}s and downloads a text file`, async ({ page }) => {
    await page.goto("/");
    if (scenario.mode === "decrypt") {
      await page.getByRole("tab", { name: /Giải mã/ }).click();
    }
    await page.getByRole("button", { name: "File .txt" }).click();
    await page.getByLabel("Chọn file văn bản").setInputFiles({
      name: "message.txt",
      mimeType: "text/plain",
      buffer: Buffer.from(scenario.source),
    });
    await page.getByRole("textbox", { name: "Khóa Caesar" }).fill("3");
    await page.getByRole("button", { name: scenario.action }).click();

    await expect(page.getByText(scenario.expected, { exact: true })).toBeVisible();
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Tải kết quả" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      `message.${scenario.mode === "encrypt" ? "encrypted" : "decrypted"}.txt`,
    );
  });
}
