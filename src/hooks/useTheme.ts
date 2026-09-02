import { useEffect, useState } from "react";
export type Theme = "light" | "dark";
export function useTheme(){const [theme,setTheme]=useState<Theme>(()=>(localStorage.getItem("resumeiq_theme") as Theme)||"light");useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;localStorage.setItem("resumeiq_theme",theme);},[theme]);return{theme,toggleTheme:()=>setTheme(t=>t==="light"?"dark":"light")};}
