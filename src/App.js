import React, { useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
  useLocation,
} from "react-router-dom";

import ScanPage from "./pages/ScanRecipe";
import FormPage from "./pages/DrugForms";
import DrugPage from "./pages/DrugNames";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import LoginPage from "./pages/LoginPage"; // компонент страницы логина
import "./App.css";
import MenuNav from "./components/MenuNav";

// Создаём контекст авторизации
const AuthContext = createContext();

// Хук для удобного использования auth
function useAuth() {
  return useContext(AuthContext);
}

// Компонент-защитник приватных роутов
function PrivateRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    // Если не авторизован — редиректим на логин и сохраняем куда хотел попасть
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  // Состояние пользователя — null если не залогинен
  const [user, setUser] = useState(null);

  // Пример простого логина
  const login = ({ email, password }) => {
    // Здесь должна быть реальная авторизация, например запрос на сервер.
    // Для примера — простой хардкод
    if (email === "admin" && password === "123") {
      setUser({ email });
      return true;
    }
    return false;
  };

  // Выход
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div>
          {user && (
            <MenuNav />
          )}
          <Routes>
            <Route
              path="/login"
              element={<LoginPageWrapper />}
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ScanPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/form"
              element={
                <PrivateRoute>
                  <FormPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/drug"
              element={
                <PrivateRoute>
                  <DrugPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipes"
              element={
                <PrivateRoute>
                  <RecipeList />
                </PrivateRoute>
              }
            />
            <Route
              path="/recipe/:recipeCode"
              element={
                <PrivateRoute>
                  <RecipeDetail />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

// Обёртка для страницы логина, чтобы иметь доступ к контексту и навигации
function LoginPageWrapper() {
  const auth = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [error, setError] = React.useState(null);

  const handleLogin = ({ email, password }) => {
    const ok = auth.login({ email, password });
    if (!ok) {
      setError("Неверный email или пароль");
      return;
    }
    setError(null);
  };

  // Если уже авторизован — редирект
  if (auth.user) {
    return <Navigate to={from} replace />;
  }

  return <LoginPage onLogin={handleLogin} error={error} />;
}
