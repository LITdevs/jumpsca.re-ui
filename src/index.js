import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import ThemeContext from "./context/ThemeContext";

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

root.render(
  <React.StrictMode>
      <ThemedApp>
          <App />
      </ThemedApp>
  </React.StrictMode>
);
