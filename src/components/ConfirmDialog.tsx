interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  parentElement?: HTMLElement | null;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  parentElement,
}) => {
  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = parentElement
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }
    : {};

  return (
    <div
      className={parentElement ? "dialog-overlay-local" : "dialog-overlay"}
      style={overlayStyle}
    >
      <div className="macos-dialog">
        <div className="dialog-content">
          <div className="dialog-icon">⚠️</div>
          <div className="dialog-text">
            <h3>Close Terminal</h3>
            <p>{message}</p>
          </div>
        </div>
        <div className="dialog-buttons">
          <button className="dialog-button secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="dialog-button primary" onClick={onConfirm}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
