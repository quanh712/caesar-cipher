import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../../../app/App";

describe("CaesarWorkspace", () => {
  it("loads the example and encrypts it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tạo ví dụ" }));
    expect(screen.getByRole("textbox", { name: "Nội dung đầu vào" })).toHaveValue("Hello World");

    await user.click(screen.getByRole("button", { name: "Mã hóa" }));
    expect(
      await screen.findByText(
        (_, element) => element?.tagName === "PRE" && element.textContent === "Khoor Zruog",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Mã hóa thành công.")).toBeInTheDocument();
  });

  it("shows a copy success toast", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tạo ví dụ" }));
    await user.click(screen.getAllByRole("button", { name: "Sao chép" })[0]);

    expect(await screen.findByText("Đã sao chép đầu vào.")).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("Hello World");
  });

  it("decrypts text", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("tab", { name: /Giải mã/ }));
    await user.type(screen.getByRole("textbox", { name: "Nội dung đầu vào" }), "Khoor Zruog");
    await user.type(screen.getByRole("textbox", { name: "Khóa Caesar" }), "3");
    await user.click(screen.getByRole("button", { name: "Giải mã" }));

    expect(
      await screen.findByText(
        (_, element) => element?.tagName === "PRE" && element.textContent === "Hello World",
      ),
    ).toBeInTheDocument();
  });

  it("accepts whitespace-only text", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole("textbox", { name: "Nội dung đầu vào" }), "   ");
    await user.type(screen.getByRole("textbox", { name: "Khóa Caesar" }), "3");

    expect(screen.getByRole("button", { name: "Mã hóa" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Mã hóa" }));
    expect(await screen.findByText("Mã hóa thành công.")).toBeInTheDocument();
  });

  it("reports an invalid key through a toast", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.clear(screen.getByRole("textbox", { name: "Khóa Caesar" }));
    await user.type(screen.getByRole("textbox", { name: "Khóa Caesar" }), "abc");

    expect(screen.getByText(/Khóa phải là số nguyên\./)).toBeInTheDocument();
  });

  it("previews and removes a valid text file", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    const fileInput = screen.getByLabelText("Chọn file văn bản");
    await user.upload(fileInput, new File(["Hello file"], "message.txt", { type: "text/plain" }));

    expect(await screen.findByText("message.txt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đổi file" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Gỡ file" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Gỡ file" }));
    expect(await screen.findByText("Kéo thả file .txt vào đây")).toBeInTheDocument();
  });

  it("accepts a file through drag and drop", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    const dropZone = screen.getByText("Kéo thả file .txt vào đây").parentElement!;
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [new File(["Dropped"], "dropped.txt", { type: "text/plain" })] },
    });

    expect(await screen.findByText("dropped.txt")).toBeInTheDocument();
  });

  it("reports an invalid file through a toast", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<App />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    await user.upload(
      screen.getByLabelText("Chọn file văn bản"),
      new File(["invalid"], "message.csv", { type: "text/csv" }),
    );

    expect(screen.getByText(/Chỉ chấp nhận file \.txt\./)).toBeInTheDocument();
  });

  it.each([
    ["encrypt", "Hello", "Khoor", "Mã hóa"],
    ["decrypt", "Khoor", "Hello", "Giải mã"],
  ] as const)("processes a file in %s mode", async (mode, source, expected, actionLabel) => {
    const user = userEvent.setup();
    render(<App />);

    if (mode === "decrypt") await user.click(screen.getByRole("tab", { name: /Giải mã/ }));
    await user.click(screen.getByRole("button", { name: "File .txt" }));
    await user.upload(
      screen.getByLabelText("Chọn file văn bản"),
      new File([source], "message.txt", { type: "text/plain" }),
    );
    await user.type(screen.getByRole("textbox", { name: "Khóa Caesar" }), "3");
    await user.click(screen.getByRole("button", { name: actionLabel }));

    expect(
      await screen.findByText(
        (_, element) => element?.tagName === "PRE" && element.textContent === expected,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tải kết quả" })).toBeEnabled();
  });

  it("locks request-changing controls while processing", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tạo ví dụ" }));
    await user.click(screen.getByRole("button", { name: "Mã hóa" }));

    expect(screen.getByRole("tab", { name: /Giải mã/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "File .txt" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Khóa Caesar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Tạo ví dụ" })).toBeDisabled();

    expect(await screen.findByText("Mã hóa thành công.")).toBeInTheDocument();
  });

  it("clears stale result when input changes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Tạo ví dụ" }));
    await user.click(screen.getByRole("button", { name: "Mã hóa" }));
    await screen.findByText("Mã hóa thành công.");

    const input = screen.getByRole("textbox", { name: "Nội dung đầu vào" });
    await user.clear(input);
    await user.type(input, "Changed input");
    expect(screen.getByText("Kết quả sẽ hiển thị ở đây sau khi xử lý.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tải kết quả" })).toBeDisabled();
  });
});
