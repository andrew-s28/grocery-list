import Sun from "./Sun";
import Moon from "./Moon";
import { useTheme } from "./ThemeProvider";

export default function DarkModeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      aria-label="Light/Dark Mode Toggle"
      className="flex cursor-pointer items-center justify-center p-1 m-0 size-[3rem] rounded-full bg-transparent shadow-none border border-transparent transition-colors duration-200 hover:bg-primary-300 dark:hover:bg-primary-300-dark focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(0,123,255,0.25)]"
    >
      <div className="flex items-center justify-center relative m-auto">
        <Sun className="absolute size-[2rem] p-0 m-0 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-[2rem] p-0 m-0 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 aria-hidden" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
