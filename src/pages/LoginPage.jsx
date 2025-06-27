import React, { useState, useEffect } from "react";

export default function LoginPage({ onLogin, error }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin({ email, password });
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Вход в систему</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                    autoComplete="username"
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-control"
                    autoComplete="current-password"
                    required
                />
                <button type="submit" className="btn btn-primary">Войти</button>
            </form>
        </div>
    );
}
