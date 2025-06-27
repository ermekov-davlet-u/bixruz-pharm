import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function DrugForms() {
    const [forms, setForms] = useState([]);
    const [formName, setFormName] = useState("");

    const loadForms = () => {
        socket.emit("db_rows", { table: "db_drug_form", fields: [{ name: "*" }] }, setForms);
    };

    const addForm = () => {
        if (!formName.trim()) return;
        socket.emit("db_exec", { exec: "add_drug_form", fields: [{ val: formName }] }, () => {
            setFormName("");
            loadForms();
        });
    };

    const deleteForm = (codeid) => {
        socket.emit("db_delete", { table: "db_drug_form", where: { codeid } }, loadForms);
    };

    useEffect(loadForms, []);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Добавить форму выпуска</h4>
            <div className="d-flex mb-3">
                <input className="form-control me-2" value={formName} onChange={e => setFormName(e.target.value)} placeholder="Напр., табл., инъекция" />
                <div className="">
                    <button className="btn btn-primary" onClick={addForm}>Добавить</button>
                </div>
            </div>
            <div className="table-main">
                <table className="table table-bordered">
                    <thead>
                        <tr><th>ID</th><th>Название</th></tr>
                    </thead>
                    <tbody>
                        {forms.map(f => (
                            <tr key={f.codeid}>
                                <td>{f.codeid}</td>
                                <td>{f.nameid}</td>
                                {/* <td><button className="btn btn-danger btn-sm" onClick={() => deleteForm(f.codeid)}>Удалить</button></td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}