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

            <div className="row mb-3">
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
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Код рецепта</th>
                        <th>Дата</th>
                        {/* <th>Врач</th> */}
                        <th>Просмотр</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(r => (
                        <tr key={r.id}>
                            <td>{r.codeid}</td>
                            <td>{r.patient_codeid}</td>
                            <td>{new Date(r.created_at).toLocaleString()}</td>
                            {/* <td>{r.doctor_codeid}</td> */}
                            <td>
                                <button
                                    className="btn btn-info btn-sm"
                                    onClick={() => navigate(`/recipe/${r.public_token}`)}
                                >
                                    Открыть
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
