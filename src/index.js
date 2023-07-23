import React, {lazy, Suspense, useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import ThemeContext from "./context/ThemeContext";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/Root";
import ErrorPage from "./components/ErrorPage";
import NotFoundPage from "./components/NotFoundPage";
import Homepage from "./routes/Homepage";
import OrderCancel from "./routes/OrderCancel";
import OrderSuccess from "./routes/OrderSuccess";
import Register from "./routes/Register";
import AuthenticationNeeded from "./routes/AuthenticationNeeded";
import AuthContext from "./context/AuthContext";
import RandomSpinner from "./components/RandomSpinner";
import api from "./util/API";
import Dashboard from "./routes/Dashboard";
import DashboardAccount from "./routes/DashboardAccount";
import DashboardAddress from "./routes/DashboardAddress";

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
    // AuthContext
    const [accessToken, setAccessToken] = useState(localStorage.getItem("jrACToken"))
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("jrREToken"))
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        if (accessToken === api.accessToken) return;
        api.setAccessToken(accessToken, setLoggedIn);
    }, [accessToken])
    useEffect(() => {
        if (refreshToken === api.refreshToken) return;
        // I agree, this is an interesting place to put the logout method
        // It sort of makes sense though :D
        api.setRefreshToken(refreshToken, setLoggedIn, () => {
            setAccessToken(null)
            setRefreshToken(null)
            setLoggedIn(null)
            localStorage.removeItem("jrACToken")
            localStorage.removeItem("jrREToken")
        }, (v) => {
            setAccessToken(v);
            localStorage.setItem("jrACToken", v)
        });
    }, [refreshToken])

    // ThemeContext/Theming
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
            <AuthContext.Provider value={{
                accessToken, setAccessToken: (v) => {
                        setAccessToken(v);
                        localStorage.setItem("jrACToken", v)
                    },
                refreshToken, setRefreshToken: (v) => {
                        setRefreshToken(v);
                        localStorage.setItem("jrREToken", v)
                    },
                loggedIn, setLoggedIn
            }}>
                <Suspense fallback={<RandomSpinner />}>
                    { (theme === "dark")  && <Themes.Dark />  }
                    { (theme === "light") && <Themes.Light /> }
                </Suspense>
                {props.children}
            </AuthContext.Provider>
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
                path: "/dashboard",
                element: <AuthenticationNeeded />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "/dashboard/account",
                        element: <DashboardAccount />
                    },
                    {
                        path: "/dashboard/address/:address",
                        element: <DashboardAddress />
                    }
                ]
            },
            {
                path: "/checkout/cancel",
                element: <OrderCancel type="new" />
            },
            {
                path: "/renewal/cancel",
                element: <OrderCancel type="renewal" />
            },
            {
                path: "/checkout/success",
                element: <OrderSuccess type="new" />
            },
            {
                path: "/renewal/success",
                element: <OrderSuccess type="renewal" />
            },
            {
                path: "/register",
                element: <Register />
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
