interface OutputPanelProps {
  result: string;
  onClear: () => void;
  onCopy: () => void;
  onDownload: () => void;
  showDownload: boolean;
}

export function OutputPanel(props: OutputPanelProps) {
  return (
    <section>
      <div className="section-label">Kết quả</div>
      <div className="panel">
        <div className="panel__header">
          <h2>Output</h2>
          <div className="button-group">
            {props.showDownload && (
              <button className="button button--secondary" onClick={props.onDownload} disabled={!props.result} type="button">
                Download
              </button>
            )}
            <button className="button button--secondary" onClick={props.onCopy} disabled={!props.result} type="button">
              Copy
            </button>
            <button className="button button--secondary" onClick={props.onClear} disabled={!props.result} type="button">
              Clear
            </button>
          </div>
        </div>
        <pre className={props.result ? "output" : "output output--empty"}>
          {props.result || "Kết quả sẽ hiển thị ở đây sau khi xử lý."}
        </pre>
      </div>
    </section>
  );
}
