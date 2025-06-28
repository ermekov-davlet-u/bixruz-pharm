import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function DrugNames() {
    const [forms, setForms] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [name, setName] = useState("");
    const [selectedForm, setSelectedForm] = useState("");

    const loadForms = () => {
        socket.emit("db_rows", { table: "db_drug_form", fields: [{ name: "*" }] }, setForms);
    };

    const loadDrugs = () => {
        socket.emit("db_rows", { table: "db_drugs", fields: [{ name: "*" }] }, setDrugs);
    };

    const addDrug = () => {
        if (!name.trim()) return;
        socket.emit("db_exec", {
            exec: "add_drug",
            fields: [
                { name: "nameid", val: name },
                { name: "drug_form_codeid", val: selectedForm || null }
            ]
        }, () => {
            setName("");
            setSelectedForm("");
            loadDrugs();
        });
    };
    const deleteForm = (codeid) => {
        socket.emit("db_delete", { table: "db_drug_form", where: { codeid } }, loadForms);
    };

    useEffect(() => {
        loadForms();
        loadDrugs();
    }, []);

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Добавить торговое название ЛС</h4>
            <input className="form-control mb-2" placeholder="Напр., Парацетамол" value={name} onChange={e => setName(e.target.value)} />
            <select className="form-select mb-2" value={selectedForm} onChange={e => setSelectedForm(e.target.value)}>
                <option value="">Выберите форму выпуска</option>
                {forms.map(f => <option key={f.codeid} value={f.codeid}>{f.nameid}</option>)}
            </select>
            <div className="">
                <button className="btn btn-primary mb-3" onClick={addDrug}>Добавить</button>
            </div>
            <div className="table-main">
                <div className="table-div">
                    {/* Заголовок */}
                    <div className="table-row table-header">
                        <div className="table-cell id-cell">ID</div>
                        <div className="table-cell name-cell">Название</div>
                        <div className="table-cell form-cell">Форма</div>
                    </div>

                    {/* Строки */}
                    {drugs.map((d) => {
                        const formName =
                            forms.find((f) => f.codeid === d.drug_form_codeid)?.nameid || "—";

                        return (
                            <div className="table-row" key={d.codeid}>
                                <div className="table-cell id-cell">{d.codeid}</div>
                                <div className="table-cell name-cell">{d.nameid}</div>
                                <div className="table-cell form-cell">{formName}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
