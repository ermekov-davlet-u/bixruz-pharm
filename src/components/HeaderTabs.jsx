import { NavLink } from 'react-router-dom';

export default function HeaderTabs() {
    return (
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/scan">Сканирование рецепта</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/forms">Форма выпуска</NavLink>
            </li>
            <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/drugs">Торговое название ЛС</NavLink>
            </li>
        </ul>
    );
}

// Далее я могу сгенерировать страницы: ScanRecipe.jsx, DrugForms.jsx и DrugNames.jsx.
// Подтвердите, чтобы продолжить.
