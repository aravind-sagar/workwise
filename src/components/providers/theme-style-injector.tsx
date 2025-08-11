"use client";

import { useTweakTheme } from "@/components/providers/tweak-theme-provider";
import { useEffect } from "react";

const THEME_INJECTOR_ID = "theme-style-injector";

export function ThemeStyleInjector() {
    const { theme } = useTweakTheme();

    useEffect(() => {
        const themePath = `/styles/theme-${theme}.css`;

        // Remove any existing theme stylesheet
        const existingLink = document.getElementById(THEME_INJECTOR_ID);
        if (existingLink) {
            existingLink.remove();
        }

        // Create and inject the new stylesheet link
        const link = document.createElement("link");
        link.id = THEME_INJECTOR_ID;
        link.rel = "stylesheet";
        link.href = themePath;
        document.head.appendChild(link);
        
        // When the component unmounts, remove the stylesheet
        return () => {
            const linkToRemove = document.getElementById(THEME_INJECTOR_ID);
            if(linkToRemove) {
                linkToRemove.remove();
            }
        };

    }, [theme]);

    return null;
}
