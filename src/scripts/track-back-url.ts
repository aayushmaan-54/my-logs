import { SITE } from '@/site.config';

const trackBackUrl = () => {
  const STORAGE_KEY = SITE.browserStorage.backUrl;
  const currentPath = window.location.pathname;

  const lastSavedPath = sessionStorage.getItem(STORAGE_KEY);

  if (currentPath !== lastSavedPath) {
    sessionStorage.setItem(STORAGE_KEY, currentPath);
  }
};

document.addEventListener('astro:after-preparation', trackBackUrl);

export default trackBackUrl;
