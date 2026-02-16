import { useCallback, useEffect, useState } from "react";
import Login from "../features/login/Login";
import Register from "../features/register/Register";

type AppRoute = "/login" | "/register";

const DEFAULT_ROUTE: AppRoute = "/login";

const isAppRoute = (pathname: string): pathname is AppRoute =>
  pathname === "/login" || pathname === "/register";

const toAppRoute = (pathname: string): AppRoute =>
  isAppRoute(pathname) ? pathname : DEFAULT_ROUTE;

function AuthRouter() {
  const [route, setRoute] = useState<AppRoute>(() =>
    toAppRoute(window.location.pathname),
  );

  useEffect(() => {
    const syncFromUrl = () => {
      setRoute(toAppRoute(window.location.pathname));
    };

    if (!isAppRoute(window.location.pathname)) {
      window.history.replaceState({}, "", DEFAULT_ROUTE);
      syncFromUrl();
    }

    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    if (window.location.pathname === nextRoute) {
      return;
    }

    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
  }, []);

  if (route === "/register") {
    return <Register onNavigateToLogin={() => navigate("/login")} />;
  }

  return <Login onNavigateToRegister={() => navigate("/register")} />;
}

export default AuthRouter;
