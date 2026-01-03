'use strict';
import { SITE } from '@/site.config';

const THEME_STORAGE_KEY = SITE.browserStorage.theme;
const FORCED_THEME = SITE.forcedTheme;

let currentTheme = resolveInitialTheme();

function resolveInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) return storedTheme;

  if (FORCED_THEME) return FORCED_THEME;

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyThemeToDOM() {
  const isDark = currentTheme === 'dark';

  document.documentElement.classList.toggle('dark', isDark);

  document
    .querySelector('#theme-toggle')
    ?.setAttribute(
      'aria-label',
      isDark ? 'Switch to light theme' : 'Switch to dark theme',
    );

  updateFavicon(isDark);
  updateThemeColorMeta();
}

function updateFavicon(isDark) {
  const favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) return;

  favicon.href = isDark ? '/light-logo.svg' : '/dark-logo.svg';
}

function updateThemeColorMeta() {
  const body = document.body;
  if (!body) return;

  const bgColor = getComputedStyle(body).backgroundColor;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', bgColor);
}

function persistAndApplyTheme() {
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  applyThemeToDOM();
}

function setupThemeToggle() {
  const toggle = document.querySelector('#theme-toggle');
  if (!toggle) return;

  toggle.onclick = () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    persistAndApplyTheme();
  };
}

function handleSystemThemeChange() {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', event => {
      currentTheme = event.matches ? 'dark' : 'light';
      persistAndApplyTheme();
    });
}

function preserveThemeColorAcrossSwap(event) {
  const themeColor = document
    .querySelector('meta[name="theme-color"]')
    ?.getAttribute('content');

  event.newDocument
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColor);

  // Set favicon in new document before swap to prevent flicker
  // Re-resolve theme to ensure we have the latest value
  const theme = resolveInitialTheme();
  const isDark = theme === 'dark';
  const newFavicon = event.newDocument.querySelector('link[rel="icon"]');
  if (newFavicon) {
    newFavicon.href = isDark ? '/light-logo.svg' : '/dark-logo.svg';
  }
}

applyThemeToDOM();

window.addEventListener('load', () => {
  setupThemeToggle();
  handleSystemThemeChange();

  document.addEventListener('astro:after-swap', () => {
    applyThemeToDOM();
    setupThemeToggle();
  });
});

document.addEventListener('astro:before-swap', preserveThemeColorAcrossSwap);
