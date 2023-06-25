import React, {lazy, Suspense, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import ThemeContext from "./context/ThemeContext";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./components/ErrorPage";
import NotFoundPage from "./components/NotFoundPage";
import Homepage from "./Homepage";

const root = ReactDOM.createRoot(document.getElementById('root'));

const Themes = {
    Dark: lazy(() => import('./components/themes/dark')),
    Light: lazy(() => import('./components/themes/light'))
}

/**
 * This is a hack. I will be using this to set the theme.
 * If you have a better way to do it, create a pull request or YouTrack ticket or something
 * @param props
 * @returns {JSX.Element}
 */
function ThemedApp(props) {
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme") || (prefersDarkMode ? "dark" : "light")
    const [theme, setTheme] = React.useState(savedTheme);

    useEffect(() => {
        if (theme) {
            localStorage.setItem("theme", theme);
        } else {
            localStorage.removeItem("theme");
        }
    }, [theme])

    return (
        <ThemeContext.Provider value={{
            theme, setTheme
        }}>
            <Suspense fallback={<></>}>
                { (theme === "dark")  && <Themes.Dark />  }
                { (theme === "light") && <Themes.Light /> }
            </Suspense>
            {props.children}
        </ThemeContext.Provider>
    );
}

/**
 * This is the router.
 * It routes.
 * Shocking.
 * @type {Router}
 */
const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Homepage />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    }
])

root.render(
  <React.StrictMode>
      <ThemedApp>
          <RouterProvider router={router} />
      </ThemedApp>
  </React.StrictMode>
);
