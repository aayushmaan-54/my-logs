import { SITE } from '@/site.config';

const THEME_STORAGE_KEY = SITE.browserStorage.theme;
const FORCED_THEME = SITE.forcedTheme;

const getTheme = () => {
  if (FORCED_THEME) return FORCED_THEME;
  return (
    localStorage.getItem(THEME_STORAGE_KEY) ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  );
};

const applyTheme = () => {
  const theme = getTheme();
  const isDark = theme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);

  const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (favicon) {
    favicon.href = isDark ? '/light-logo.svg' : '/dark-logo.svg';
  }

  const bgColor = getComputedStyle(document.body).backgroundColor;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', bgColor);
};

const setupToggle = () => {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;

  toggle.addEventListener(
    'click',
    () => {
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyTheme();
    },
    { once: false },
  );
};

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', () => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      applyTheme();
    }
  });

document.addEventListener('astro:before-swap', e => {
  const currentFavicon = document.querySelector(
    'link[rel="icon"]',
  ) as HTMLLinkElement;
  const newFavicon = e.newDocument.querySelector(
    'link[rel="icon"]',
  ) as HTMLLinkElement;
  if (currentFavicon && newFavicon) {
    newFavicon.href = currentFavicon.href;
  }
});

document.addEventListener('astro:after-swap', () => {
  applyTheme();
  setupToggle();
});

applyTheme();
setupToggle();
