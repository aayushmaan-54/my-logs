interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: string;
}

export const SITE = {
  website: import.meta.env.PUBLIC_SITE_URL,
  author: 'Aayushmaan Soni',
  profile: 'https://wwww.aayushmaan.me',
  title: 'My Logs.',
  description:
    'A personal log for thoughts, ideas, and lessons that feel worth writing down.',
  ogImage: 'og-image.png',
  lightAndDarkMode: true,
  browserStorage: {
    backUrl: 'my-logs/back-url',
    theme: 'my-logs/theme',
  },
  forcedTheme: '',
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showShortReads: true,
  showBackButton: true,
  showScrollAtTopAt: 0.25, // 25% of scroll
  editPost: {
    enabled: true,
    text: 'Edit page',
    url: 'https://github.com/aayushmaan-45/my-logs/edit/main/',
  },
  dynamicOgImage: true,
  dir: 'ltr', // "rtl" | "auto"
  lang: 'en',
  timezone: 'Asia/Kolkata', // Timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

export const SOCIALS: Social[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/satnaing/astro-paper',
    linkTitle: `My GitHub`,
    icon: 'tabler:brand-github',
  },
  {
    name: 'X',
    href: 'https://x.com/username',
    linkTitle: `My X`,
    icon: 'tabler:brand-x',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/username/',
    linkTitle: `My LinkedIn`,
    icon: 'tabler:brand-linkedin',
  },
  {
    name: 'Mail',
    href: 'mailto:yourmail@gmail.com',
    linkTitle: `Send an email to me`,
    icon: 'tabler:brand-gmail',
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/?text=',
    linkTitle: `Share this post via WhatsApp`,
    icon: 'tabler:brand-whatsapp',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/sharer.php?u=',
    linkTitle: `Share this post on Facebook`,
    icon: 'tabler:brand-facebook',
  },
  {
    name: 'X',
    href: 'https://x.com/intent/post?url=',
    linkTitle: `Share this post on X`,
    icon: 'tabler:brand-x',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/share/url?url=',
    linkTitle: `Share this post via Telegram`,
    icon: 'tabler:brand-telegram',
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/pin/create/button/?url=',
    linkTitle: `Share this post on Pinterest`,
    icon: 'tabler:brand-pinterest',
  },
  {
    name: 'Mail',
    href: 'mailto:?subject=See%20this%20post&body=',
    linkTitle: `Share this post via email`,
    icon: 'tabler:brand-gmail',
  },
] as const;
