import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function ScanRecipe() {
    const readerRef = useRef(null);
    const qrScannerRef = useRef(null);
    const isScanningRef = useRef(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const scannerId = "reader";
        const qrScanner = new Html5Qrcode(scannerId);
        qrScannerRef.current = qrScanner;

        qrScanner
            .start(
                { facingMode: "environment" }, // <-- задняя камера
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    if (!isScanningRef.current) return;

                    // Извлечь токен, если это URL
                    let recipeCode = decodedText;
                    try {
                        const url = new URL(decodedText);
                        const tokenParam = url.searchParams.get("token");
                        if (tokenParam) {
                            recipeCode = tokenParam;
                        }
                    } catch (e) {
                        // decodedText — это не URL, значит это просто токен
                    }

                    setMessage(`✅ Рецепт найден: ${recipeCode}. Переход...`);
                    isScanningRef.current = false;

                    qrScanner
                        .stop()
                        .then(() => {
                            navigate(`/recipe/${recipeCode}`);
                        })
                        .catch((err) => {
                            console.warn("Ошибка остановки:", err);
                        });
                },
                (errorMessage) => {
                    console.warn("Ошибка сканирования:", errorMessage);
                }
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
    }, [navigate]);

    return (
        <div className="page-container">
            <h2 className="page-title text-blue">Сканирование рецепта</h2>
            <div id="reader" ref={readerRef} className="scanner-box shadow-blue"></div>
            <div className="scanner-message text-green fw-bold">{message}</div>
        </div>
    );
}
