import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function MenuNav() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(!open);
    const closeMenu = () => setOpen(false);

    return (
        <header className="navbar">
            <div className="navbar-brand" onClick={closeMenu}>
                MIS App
            </div>
            <button
                className={`navbar-toggle ${open ? "active" : ""}`}
                onClick={toggleMenu}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <nav className={`navbar-menu ${open ? "open" : ""}`}>
                <NavLink
                    to="/"
                    className="nav-link"
                    onClick={closeMenu}
                >
                    Сканирование
                </NavLink>
                <NavLink
                    to="/form"
                    className="nav-link"
                    onClick={closeMenu}
                >
                    Форма выпуска
                </NavLink>
                <NavLink
                    to="/drug"
                    className="nav-link"
                    onClick={closeMenu}
                >
                    Лекарственное средство
                </NavLink>
                <NavLink
                    to="/recipes"
                    className="nav-link"
                    onClick={closeMenu}
                >
                    Рецепты
                </NavLink>
            </nav>
        </header>
    );
}
