import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function DrugForms() {
    const [forms, setForms] = useState([]);
    const [formName, setFormName] = useState("");

    const loadForms = () => {
        socket.emit(
            "db_rows",
            { table: "db_drug_form", fields: [{ name: "*" }] },
            setForms
        );
    };

    const addForm = () => {
        if (!formName.trim()) return;
        socket.emit(
            "db_exec",
            { exec: "add_drug_form", fields: [{ val: formName }] },
            () => {
                setFormName("");
                loadForms();
            }
        );
    };

    const deleteForm = (codeid) => {
        socket.emit(
            "db_delete",
            { table: "db_drug_form", where: { codeid } },
            loadForms
        );
    };

    useEffect(loadForms, []);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Добавить форму выпуска</h4>
            <div className="d-flex mb-3 flex-wrap gap-2">
                <input
                    className="form-control me-2 flex-grow-1"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Напр., табл., инъекция"
                />
                <button className="btn btn-primary" onClick={addForm}>
                    Добавить
                </button>
            </div>

            {/* Таблица на div */}
            <div className="table-main">
                <div className="table-div">
                    {/* Заголовок */}
                    <div className="table-row table-header">
                        <div className="table-cell id-cell">ID</div>
                        <div className="table-cell name-cell">Название</div>
                        <div className="table-cell actions-cell"></div>
                    </div>

                    {/* Строки */}
                    {forms.map((f) => (
                        <div className="table-row" key={f.codeid}>
                            <div className="table-cell id-cell">{f.codeid}</div>
                            <div className="table-cell name-cell">{f.nameid}</div>
                            <div className="table-cell actions-cell">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteForm(f.codeid)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
