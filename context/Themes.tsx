import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { createMaterial3Theme, useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

type Theme = typeof MD3LightTheme;

interface ThemeContextType {
    theme: Theme;
    setTheme: (primaryColor: string) => void; // Expose theme setter
}

const ThemeDynamicContext = createContext<ThemeContextType>({
    theme: MD3LightTheme, // Default theme
    setTheme: () => {}, // Default setTheme
});

export const useDynamicTheme = () => useContext(ThemeDynamicContext);

interface ThemeDynamicProviderProps {
    children: ReactNode;
}

export const ThemeDynamicProvider: React.FC<ThemeDynamicProviderProps> = ({ children }) => {
    const colorScheme = useColorScheme();
    const { theme } = useMaterial3Theme();
    const [dynamicTheme, setDynamicTheme] = useState<Theme>(
        colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }
    );

    // Custom primary color tracking
    const [customColor, setCustomColor] = useState<string | null>(null);

    // Function to set a custom theme color
    const setTheme = useCallback((primaryColor: string) => {
        setCustomColor(primaryColor); // Store the custom color
        const { dark, light } = createMaterial3Theme(primaryColor);
        const newTheme = colorScheme === 'dark' ? { ...MD3DarkTheme, colors: dark } : { ...MD3LightTheme, colors: light };
        setDynamicTheme(newTheme);
    }, [colorScheme]);

    // Update theme when the color scheme changes (light/dark mode) or when a custom color is set
    useEffect(() => {
        if (customColor) {
            // Apply custom theme if a custom color is set
            setTheme(customColor);
        } else {
            // Use default Material You colors if no custom color is set
            setDynamicTheme(
                colorScheme === 'dark' ? { ...MD3DarkTheme, colors: theme.dark } : { ...MD3LightTheme, colors: theme.light }
            );
        }
    }, [colorScheme, theme, customColor, setTheme]);

    return (
        <ThemeDynamicContext.Provider value={{ theme: dynamicTheme, setTheme }}>
            {children}
        </ThemeDynamicContext.Provider>
    );
};

export default ThemeDynamicProvider;
