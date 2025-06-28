import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import QRCode from "react-qr-code";

export default function RecipeDetail() {
    const { recipeCode } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadRecipe = () => {
        socket.emit(
            "db_rows",
            {
                table: "db_recipe",
                fields: [{ name: "*" }],
                where: `WHERE public_token = '${recipeCode}'`
            },
            (rows) => {
                if (rows?.length > 0) {
                    setRecipe(rows[0]);
                }
            }
        );
    };

    const loadItems = () => {
        socket.emit(
            "db_rows",
            {
                table: "recipe_view",
                fields: [{ name: "*" }],
                where: `WHERE public_token = '${recipeCode}'`
            },
            (rows) => {
                setItems(rows);
            }
        );
    };

    useEffect(() => {
        loadRecipe();
        loadItems();
    }, [recipeCode]);

    const handleIssue = () => {
        if (!recipe) return;
        setLoading(true);

        socket.emit(
            "db_update",
            {
                table: "db_recipe",
                fields: [
                    { type: 'text', name: "status", val: 1 }
                ],
                where: `where codeid = ` + recipe.codeid
            },
            () => {
                loadRecipe();
                setLoading(false);
            }
        );
    };

    if (!recipe) {
        return <div className="container mt-4">Загрузка...</div>;
    }

    const isIssued = recipe.status === 1;

    return (
        <div className="container mt-4">
            <h4>
                Детали рецепта:{" "}
                <a href={`http://bihruz.mis.ibm.kg/recipe/view?token=${recipe.public_token}`} target="_blank" rel="noreferrer">
                    http://bihruz.mis.ibm.kg/recipe/view?token={recipe.public_token}
                </a>
            </h4>

            <p className="prescription-meta">
                Врач: <strong>{recipe.doctor_codeid}</strong> | Дата:{" "}
                <strong>{recipe.created_at}</strong> | Статус:{" "}
                {isIssued ? (
                    <span style={{
                        color: "red",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}>
                        ВЫДАНО
                    </span>
                ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                        НЕ ВЫДАНО
                    </span>
                )}
            </p>

            {!isIssued && (
                <button
                    className="btn btn-danger btn-sm mb-3"
                    onClick={handleIssue}
                    disabled={loading}
                >
                    {loading ? "Сохраняем..." : "Выдать рецепт"}
                </button>
            )}

            <h5>Состав рецепта</h5>
            <div className="table-main">
                <div className="table-div">
                    {/* Заголовок */}
                    <div className="table-row table-header">
                        <div className="table-cell">Врач</div>
                        <div className="table-cell">Пациент</div>
                        <div className="table-cell">Препарат</div>
                        <div className="table-cell">Форма</div>
                        <div className="table-cell">Доза</div>
                        <div className="table-cell">Способ</div>
                        <div className="table-cell">Курс</div>
                        <div className="table-cell">Кратность</div>
                        <div className="table-cell">Время</div>
                    </div>

                    {items.length > 0 ? (
                        items.map((item, idx) => (
                            <div className="table-row" key={idx}>
                                <div className="table-cell" data-label="Врач">{item.doctor_fio}</div>
                                <div className="table-cell" data-label="Пациент">{item.patient_fio}</div>
                                <div className="table-cell" data-label="Препарат">{item.drug}</div>
                                <div className="table-cell" data-label="Форма">{item.drug_form}</div>
                                <div className="table-cell" data-label="Доза">{item.dosege}</div>
                                <div className="table-cell" data-label="Способ">{item.method_use}</div>
                                <div className="table-cell" data-label="Курс">{item.count_days}</div>
                                <div className="table-cell" data-label="Кратность">{item.times_per_day}</div>
                                <div className="table-cell" data-label="Время">{item.use_time}</div>
                            </div>
                        ))
                    ) : (
                        <div className="table-row">
                            <div className="table-cell no-data" style={{ flex: "1 1 100%" }}>
                                Нет данных о препаратах
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-4 mt-3">
                    <h5>QR-код для доступа к рецепту</h5>
                    <QRCode
                        value={`https://bihruz.mis.ibm.kg/recipe/view?token=${recipe.public_token}`}
                        size={128}
                    />
                </div>
            </div>
        </div>
    );
}
