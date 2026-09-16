import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CaesarWorkspace } from "./CaesarWorkspace";

describe("CaesarWorkspace", () => {
  it("loads the example and encrypts it", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "Generate example" }));
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
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "Generate example" }));
    await user.click(screen.getAllByRole("button", { name: "Copy" })[0]);

    expect(await screen.findByText("Copy đầu vào thành công.")).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("Hello World");
  });

  it("decrypts text", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("tab", { name: /Decode/ }));
    await user.type(screen.getByRole("textbox", { name: "Nội dung đầu vào" }), "Khoor Zruog");
    await user.click(screen.getByRole("button", { name: "Giải mã" }));

    expect(
      await screen.findByText(
        (_, element) => element?.tagName === "PRE" && element.textContent === "Hello World",
      ),
    ).toBeInTheDocument();
  });

  it("reports an invalid key through a toast", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.clear(screen.getByRole("textbox", { name: "Khóa Caesar" }));
    await user.type(screen.getByRole("textbox", { name: "Khóa Caesar" }), "abc");

    expect(await screen.findByRole("status")).toHaveTextContent("Khóa phải là số nguyên.");
  });

  it("previews and removes a valid text file", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    const fileInput = screen.getByLabelText("Chọn file văn bản");
    await user.upload(fileInput, new File(["Hello file"], "message.txt", { type: "text/plain" }));

    expect(await screen.findByText("message.txt")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Change" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(await screen.findByText("Kéo thả file .txt vào đây")).toBeInTheDocument();
  });

  it("accepts a file through drag and drop", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    const dropZone = screen.getByText("Kéo thả file .txt vào đây").parentElement!;
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [new File(["Dropped"], "dropped.txt", { type: "text/plain" })] },
    });

    expect(await screen.findByText("dropped.txt")).toBeInTheDocument();
  });

  it("reports an invalid file through a toast", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "File .txt" }));
    await user.upload(
      screen.getByLabelText("Chọn file văn bản"),
      new File(["invalid"], "message.csv", { type: "text/csv" }),
    );

    expect(await screen.findByRole("status")).toHaveTextContent("Chỉ hỗ trợ file .txt.");
  });

  it.each([
    ["encrypt", "Hello", "Khoor", "Mã hóa"],
    ["decrypt", "Khoor", "Hello", "Giải mã"],
  ] as const)("processes a file in %s mode", async (mode, source, expected, actionLabel) => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    if (mode === "decrypt") await user.click(screen.getByRole("tab", { name: /Decode/ }));
    await user.click(screen.getByRole("button", { name: "File .txt" }));
    await user.upload(
      screen.getByLabelText("Chọn file văn bản"),
      new File([source], "message.txt", { type: "text/plain" }),
    );
    await user.click(screen.getByRole("button", { name: actionLabel }));

    expect(
      await screen.findByText(
        (_, element) => element?.tagName === "PRE" && element.textContent === expected,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download" })).toBeEnabled();
  });

  it("locks request-changing controls while processing", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "Generate example" }));
    await user.click(screen.getByRole("button", { name: "Mã hóa" }));

    expect(screen.getByRole("tab", { name: /Decode/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "File .txt" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Khóa Caesar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Generate example" })).toBeDisabled();

    expect(await screen.findByText("Mã hóa thành công.")).toBeInTheDocument();
  });

  it("keeps result analysis tied to the completed request", async () => {
    const user = userEvent.setup();
    render(<CaesarWorkspace />);

    await user.click(screen.getByRole("button", { name: "Generate example" }));
    await user.click(screen.getByRole("button", { name: "Mã hóa" }));
    await screen.findByText("Mã hóa thành công.");

    const input = screen.getByRole("textbox", { name: "Nội dung đầu vào" });
    await user.clear(input);
    await user.type(input, "Changed input");
    const keyInput = screen.getByRole("textbox", { name: "Khóa Caesar" });
    await user.clear(keyInput);
    await user.type(keyInput, "5");
    await user.click(screen.getByRole("tab", { name: "Phân tích" }));

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
  });
});
