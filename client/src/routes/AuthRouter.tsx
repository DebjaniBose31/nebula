import { useCallback, useEffect, useState } from "react";
import Home from "../features/home/Home";
import Login from "../features/login/Login";
import Signup from "../features/signup/Signup";

type AppRoute = "/" | "/login" | "/signup";

const DEFAULT_ROUTE: AppRoute = "/";

const isAppRoute = (pathname: string): pathname is AppRoute =>
  pathname === "/" || pathname === "/login" || pathname === "/signup";

const toAppRoute = (pathname: string): AppRoute =>
  isAppRoute(pathname) ? pathname : DEFAULT_ROUTE;

function AuthRouter() {
  const [route, setRoute] = useState<AppRoute>(() => toAppRoute(window.location.pathname));

  useEffect(() => {
    const syncFromUrl = () => {
      setRoute(toAppRoute(window.location.pathname));
    };

    if (!isAppRoute(window.location.pathname)) {
      window.history.replaceState({}, "", DEFAULT_ROUTE);
      syncFromUrl();
    }

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const navigate = useCallback((nextRoute: AppRoute) => {
    if (window.location.pathname === nextRoute) {
      return;
    }

    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
  }, []);

  if (route === "/login") {
    return <Login onNavigateToSignup={() => navigate("/signup")} />;
  }

  if (route === "/signup") {
    return <Signup onNavigateToLogin={() => navigate("/login")} />;
  }

  return (
    <Home
      onNavigateToLogin={() => navigate("/login")}
      onNavigateToSignup={() => navigate("/signup")}
    />
  );
}

export default AuthRouter;
