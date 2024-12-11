import React, { createContext, useContext, useEffect, useState } from "react";

interface Props {
    children: React.ReactNode
}

interface ThemeContextType {
   isDarkMode: boolean,
   toggleTheme: () => void
}


export const ThemeContext = createContext<ThemeContextType | null>(null)

export default function ThemeContextProvider (props: Props) {
    const storedTheme = localStorage.getItem('theme') === 'dark'
    const [isDarkMode, setIsDarkMode] = useState(storedTheme)

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    const themeContext = useContext(ThemeContext)
    if (themeContext === null) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    }
    return themeContext
}