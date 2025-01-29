const template = {
  open: '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  close: '</urlset>',
  url: {
    open: '<url>',
    close: '</url>',
    loc: {
      open: '<loc>',
      close: '</loc>',
    },
    lastmod: {
      open: '<lastmod>',
      close: '</lastmod>',
    },
    xhtmlLink: {
      open: '<xhtml:link rel="alternate"',
      hreflang: {
        open: 'hreflang="',
        close: '"',
      },
      href: {
        open: 'href="',
        close: '"',
      },
      close: '/>',
    },
  },
};

const domain = 'https://www.invernspirit.com/';
const languages: string[] = [];
const pages: string[] = [];

function getFormattedDate(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getSitemapString(): string {
  let str = template.open;
  const currentDate = getFormattedDate();

  for (const page of pages) {
    for (const lang of languages) {
      str += template.url.open;
      // loc
      str += template.url.loc.open;
      str += domain + lang + (page ? '/' : '') + page;
      str += template.url.loc.close;

      // lastmod
      str += template.url.lastmod.open;
      str += currentDate;
      str += template.url.lastmod.close;

      // xhtml:link
      for (const langLink of languages) {
        str += `${template.url.xhtmlLink.open} `;
        str += template.url.xhtmlLink.hreflang.open;
        str += langLink;
        str += `${template.url.xhtmlLink.hreflang.close} `;
        str += template.url.xhtmlLink.href.open;
        str += domain + langLink + (page ? '/' : '') + page;
        str += template.url.xhtmlLink.href.close;
        str += template.url.xhtmlLink.close;
      }

      str += template.url.close;
    }
  }

  str += template.close;
  return str;
}

/* eslint-disable no-console */
try {
  await Bun.write('./static/sitemap.xml', getSitemapString());
  console.log('Sitemap written successfully!');
} catch (err) {
  console.error('Error writing sitemap', err);
}

export {};
