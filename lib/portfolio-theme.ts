export const PORTFOLIO_THEME_KEY = "portfolio-color-theme";
export const PORTFOLIO_THEME_EVENT = "portfolio-theme-change";

// Runs in the document head so the saved theme is applied before first paint.
export const portfolioThemeScript = `(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    let saved;
    try { saved = localStorage.getItem('${PORTFOLIO_THEME_KEY}'); } catch {}
    document.documentElement.dataset.portfolioTheme =
      saved === 'light' || saved === 'dark' ? saved : media.matches ? 'dark' : 'light';
    window.dispatchEvent(new Event('${PORTFOLIO_THEME_EVENT}'));
  };
  apply();
  media.addEventListener('change', apply);
  window.addEventListener('storage', (event) => {
    if (event.key === '${PORTFOLIO_THEME_KEY}' || event.key === null) apply();
  });
})();`;
