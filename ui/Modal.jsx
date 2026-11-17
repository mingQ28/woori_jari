import React from "react";

const Modal = ({ children, onClose }) => {
  return (
    <>
      {/* 배경 (blur 효과) */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 10,
        }}
      ></div>

      {/* 다이얼로그 */}
      <div
        style={{
          position: "fixed",
          zIndex: 20,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#1e293b", // slate-800
          color: "white",
          padding: "2rem 2.5rem",
          width: "min(90%, 500px)",
          borderRadius: "12px",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)",
          transition: "all 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
