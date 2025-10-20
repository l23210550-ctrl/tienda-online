import { useEffect } from "react";

export default function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2000); // 🔹 Desaparece en 2 s
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={styles.toast}>
      🛒 {message}
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    background: "#FF8C00",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
    fontWeight: "bold",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
};
