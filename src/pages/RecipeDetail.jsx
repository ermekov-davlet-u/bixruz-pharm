import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import QRCode from "react-qr-code";

export default function RecipeDetail() {
    const { recipeCode } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Загружаем рецепт
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

        // Загружаем состав рецепта
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
    }, [recipeCode]);

    if (!recipe) {
        return <div className="container mt-4">Загрузка...</div>;
    }

    return (
        <div className="container mt-4">
            <h4>Детали рецепта: http://bihruz.mis.ibm.kg/recipe/view?token={recipe.public_token}</h4>

            <p className="prescription-meta">
                Врач: <strong>{recipe.doctor_codeid}</strong> | Дата:{" "}
                <strong>{recipe.created_at}</strong>
            </p>

            <h5>Состав рецепта</h5>
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Врач</th>
                            <th>Пациент</th>
                            <th>Препарат</th>
                            <th>Форма</th>
                            <th>Доза</th>
                            <th>Способ</th>
                            <th>Курс</th>
                            <th>Кратность</th>
                            <th>Время</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length > 0 ? (
                            items.map((item, idx) => (
                                <tr key={idx}>
                                    <td data-label="Врач">{item.doctor_fio}</td>
                                    <td data-label="Пациент">{item.patient_fio}</td>
                                    <td data-label="Препарат">{item.drug}</td>
                                    <td data-label="Форма">{item.drug_form}</td>
                                    <td data-label="Доза">{item.dosege}</td>
                                    <td data-label="Способ">{item.method_use}</td>
                                    <td data-label="Курс">{item.count_days}</td>
                                    <td data-label="Кратность">{item.times_per_day}</td>
                                    <td data-label="Время">{item.use_time}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Нет данных о препаратах
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="mb-4">
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
