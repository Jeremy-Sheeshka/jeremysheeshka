export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;

export const webmentionDomain = 'www.jeremysheeshka.ca';
export const siteName = 'Jeremy Sheeshka';
export const siteType = 'Person'; // schema

export const author = {
  name: 'Jeremy Sheeshka',
  avatar: '/icon-512x512.png',
  email: 'hello@jeremysheeshka.ca',
  website: 'https://www.jeremysheeshka.ca',
};

export const creator = {
  name: 'Jeremy Sheeshka',
  email: 'hello@jeremysheeshka.com',
  website: 'https://www.jeremysheeshka.ca',
};

export const social = {
  twitter: '@jeremysheeshka',
  mastodon: 'https://mastodon.social/@jeremysheeshka',
  github: 'https://github.com/jeremysheeshka',
  linkedin: 'https://linkedin.com/in/jeremysheeshka'
};

export const pathToSvgLogo = 'src/assets/images/template/avatar.jpg';
export const themeColor = '#dd4462';
export const themeLight = '#f8f8f8';
export const themeDark = '#2e2e2e';
export const ogDefault = '/assets/images/template/opengraph-default.jpg';

export const blog = {
  name: 'My Portfolio and Blog',
  description: 'Tell the world what you are writing about in your blog. It will show up on feed readers.',
  feedLinks: [
    {
      title: 'Atom Feed',
      url: '/feed.xml',
      type: 'application/atom+xml'
    },
    {
      title: 'JSON Feed',
      url: '/feed.json',
      type: 'application/json'
    }
  ],
  paginationNumbers: true
};

export const navigation = {
  drawerNav: false
};

export const viewRepo = {
  allow: true
};
