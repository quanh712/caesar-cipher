import { expect, test } from "@playwright/test";

test("uses the real FastAPI text contract through the Vite proxy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bản demo giả lập")).toHaveCount(0);

  await page.getByRole("button", { name: "Tạo ví dụ" }).click();
  await page.getByRole("button", { name: "Mã hóa" }).click();

  await expect(page.getByText("Khoor Zruog", { exact: true })).toBeVisible();
  await expect(page.getByText("Mã hóa thành công.", { exact: true })).toBeVisible();
});

test("sends a large key as an exact JSON integer token", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Nội dung đầu vào" }).fill("A");
  await page.getByRole("textbox", { name: "Khóa Caesar" }).fill("9007199254740993");

  const requestPromise = page.waitForRequest("**/api/caesar/encrypt");
  await page.getByRole("button", { name: "Mã hóa" }).click();
  const request = await requestPromise;

  expect(request.postData()).toBe('{"text":"A","key":9007199254740993}');
  await expect(page.locator("pre.output")).toHaveText("H");
});

test("previews and downloads a file with two server requests", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "File .txt" }).click();
  await page.getByLabel("Chọn file văn bản").setInputFiles({
    name: "bao.cao.v2.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("Hello World"),
  });
  await page.getByRole("textbox", { name: "Khóa Caesar" }).fill("3");
  await page.getByRole("button", { name: "Mã hóa" }).click();

  await expect(page.getByText("Khoor Zruog", { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tải kết quả" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("bao.cao.v2.encrypted.txt");
});

test("shows the canonical backend message for invalid UTF-8", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "File .txt" }).click();
  await page.getByLabel("Chọn file văn bản").setInputFiles({
    name: "invalid.txt",
    mimeType: "text/plain",
    buffer: Buffer.from([0xff]),
  });
  await page.getByRole("textbox", { name: "Khóa Caesar" }).fill("3");
  await page.getByRole("button", { name: "Mã hóa" }).click();

  await expect(page.getByText("File phải sử dụng UTF-8.", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tải kết quả" })).toBeDisabled();
});
