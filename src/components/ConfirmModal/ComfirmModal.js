import React from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({
  onClick,
  title,
  content,
  show,
  onClose,
}) {
  return (
    <>
      {show &&
        createPortal(
          <div className="modal-backdrop fade show"></div>,
          document.body
        )}
      <div
        className={`modal fade ${show ? "show" : ""}`}
        style={{ display: show ? "block" : "none" }}
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden={!show}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">{title}</h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">{content}</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Đóng
              </button>
              <button
                onClick={onClick}
                type="button"
                className="btn btn-primary"
              >
                Chấp nhận
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
