export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getThemePreference() {
              if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
                return localStorage.getItem('theme');
              }
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            
            function setTheme(theme) {
              if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(systemTheme);
              } else {
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(theme);
              }
            }
            
            const themePreference = getThemePreference();
            setTheme(themePreference);
            
            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
              const storedTheme = localStorage.getItem('theme');
              if (!storedTheme || storedTheme === 'system') {
                setTheme('system');
              }
            });
          })();
        `,
      }}
    />
  )
} 