// socket.js
import io from "socket.io-client"; // ⚠️ НЕ использовать деструктуризацию (v2 не поддерживает)

const socket = io("https://bihruz.mis.ibm.kg"); // без дополнительных опций

socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("❌ Socket connect error:", err.message);
});

export { socket };
