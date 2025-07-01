import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function RecipeList() {
    const [recipes, setRecipes] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [patientNo, setPatientNo] = useState("");
    const [recipeCode, setRecipeCode] = useState("");
    const navigate = useNavigate();

    const loadRecipes = (patientNo = "", recipeCode = "") => {
        let whereClauses = [];

        if (patientNo.trim()) {
            whereClauses.push(`patient_codeid = ${patientNo.trim()}`);
        }

        if (recipeCode.trim()) {
            whereClauses.push(`codeid = ${recipeCode.trim()}`);
        }

        let where = "";
        if (whereClauses.length > 0) {
            where = "WHERE " + whereClauses.join(" AND ");
        }

        socket.emit(
            "db_rows",
            {
                table: "db_recipe",
                fields: [{ name: "*" }],
                where
            },
            (rows) => {
                console.log(rows);
                setRecipes(rows);
                setFiltered(rows);
            }
        );
    };

    const search = () => {
        loadRecipes(patientNo, recipeCode);
    };

    useEffect(() => {
        loadRecipes();
    }, []);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Список выписанных рецептов</h4>

            <div className="filter mb-3">
                <div className="col-md-3">
                    <input
                        className="form-control"
                        placeholder="№ пациента"
                        value={patientNo}
                        onChange={e => setPatientNo(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        className="form-control"
                        placeholder="Код рецепта"
                        value={recipeCode}
                        onChange={e => setRecipeCode(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary" onClick={search}>
                        Найти
                    </button>
                </div>
            </div>
            <div className="table-main">
                <div className="table-div">
                    {/* Заголовок */}
                    <div className="table-row table-header">
                        <div className="table-cell id-cell">ID</div>
                        <div className="table-cell code-cell">Код рецепта</div>
                        <div className="table-cell date-cell">Дата</div>
                        <div className="table-cell actions-cell">Просмотр</div>
                    </div>

                    {/* Строки */}
                    {filtered.map((r) => (
                        <div className="table-row" key={r.id}>
                            <div className="table-cell id-cell">{r.codeid}</div>
                            <div className="table-cell code-cell">{r.patient_codeid}</div>
                            <div className="table-cell date-cell">
                                {new Date(r.created_at).toLocaleString()}
                            </div>
                            <div className="table-cell actions-cell">
                                <button
                                    className="btn btn-info btn-sm"
                                    onClick={() => navigate(`/recipe/${r.public_token}`)}
                                >
                                    Открыть
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
