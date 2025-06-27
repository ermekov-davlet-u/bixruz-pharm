import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function ScanRecipe() {
    const readerRef = useRef(null);
    const qrScannerRef = useRef(null);
    const isScanningRef = useRef(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const scannerId = "reader";
        const qrScanner = new Html5Qrcode(scannerId);
        qrScannerRef.current = qrScanner;

        qrScanner
            .start(
                { facingMode: "environment" }, // ✅ включаем заднюю камеру
                (decodedText) => {
                    if (!isScanningRef.current) return;
                    setMessage(`✅ Рецепт найден: ${decodedText}. Скачивание...`);
                    isScanningRef.current = false;

                    qrScanner
                        .stop()
                        .then(() => {
                            window.location.href = decodedText;
                        })
                        .catch((err) => {
                            console.warn("Ошибка остановки:", err);
                        });
                },
                () => { }
            )
            .then(() => {
                isScanningRef.current = true;
            })
            .catch((err) => {
                console.error("Ошибка запуска сканера:", err);
                setMessage("Ошибка запуска камеры: " + err);
            });

        return () => {
            if (qrScannerRef.current && isScanningRef.current) {
                qrScannerRef.current
                    .stop()
                    .then(() => {
                        isScanningRef.current = false;
                    })
                    .catch(() => { });
            }
        };
    }, []);

    return (
        <div className="page-container">
            <h2 className="page-title text-blue">Сканирование рецепта</h2>
            <div id="reader" ref={readerRef} className="scanner-box shadow-blue"></div>
            <div className="scanner-message text-green fw-bold">{message}</div>
        </div>
    );
}
