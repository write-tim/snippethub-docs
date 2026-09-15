// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { parse as parseJs } from 'acorn';
import { visit } from 'unist-util-visit';

function generateArticlesManifest() {
  const docsDir = path.resolve('./src/content/docs');
  const targetFile = path.resolve('./public/admin/articles.json');
  if (!fs.existsSync(docsDir)) return;

  function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = getFiles(docsDir);
  const catMap = {
    'getting-started': '1. Getting Started',
    features: '2. Features',
    productivity: '3. Productivity',
    'account-sync': '4. Account & Sync',
    customization: '5. Customization',
    support: '6. Support & FAQs',
  };

  const articles = files.map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(docsDir, file);
    const titleMatch = content.match(/^title:\s*["'`]?(.*?)["'`]?$/m);
    const descMatch = content.match(/^description:\s*["'`]?(.*?)["'`]?$/m);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(file, path.extname(file));
    const desc = descMatch ? descMatch[1].trim() : '';

    let route = '/' + rel.replace(/\\/g, '/').replace(/(index)?\.(mdx|md)$/, '');
    if (!route.endsWith('/') && route !== '/') route += '/';
    if (route === '//') route = '/';

    const parts = rel.split(path.sep);
    let category = 'General';
    if (parts.length > 1) {
      const catKey = parts[0];
      category = catMap[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1);
    } else if (rel === 'index.mdx' || rel === 'index.md') {
      category = 'Home';
    }

    return { title, route, desc, category, file: rel };
  });

  articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title.localeCompare(b.title);
  });

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, JSON.stringify(articles, null, 2), 'utf8');
}

const articleManifestIntegration = () => ({
  name: 'article-manifest-generator',
  hooks: {
    'astro:config:setup': () => {
      generateArticlesManifest();
    },
    'astro:server:setup': () => {
      generateArticlesManifest();
    },
    'astro:build:start': () => {
      generateArticlesManifest();
    },
  },
});

const STARLIGHT_COMPONENTS = [
  'Aside',
  'Steps',
  'Tabs',
  'TabItem',
  'Card',
  'CardGrid',
  'FileTree',
  'Badge',
  'Icon',
  'LinkCard',
];

function remarkStarlightAutoImport() {
  return (tree, file) => {
    if (!file.path || !file.path.endsWith('.mdx')) return;

    const imported = new Set();
    for (const node of tree.children) {
      if (node.type === 'mdxjsEsm' && node.data?.estree?.body) {
        for (const stmt of node.data.estree.body) {
          if (stmt.type === 'ImportDeclaration') {
            for (const spec of stmt.specifiers || []) {
              if (spec.local?.name) {
                imported.add(spec.local.name);
              }
            }
          }
        }
      }
    }

    const toImport = STARLIGHT_COMPONENTS.filter((c) => !imported.has(c));
    if (toImport.length === 0) return;

    const js = `import { ${toImport.join(', ')} } from '@astrojs/starlight/components';`;
    const importNode = {
      type: 'mdxjsEsm',
      value: js,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [],
          ...parseJs(js, { ecmaVersion: 'latest', sourceType: 'module' }),
        },
      },
    };

    tree.children.unshift(importNode);
  };
}

function rehypeLinkTarget() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'a' && node.properties && node.properties.href) {
        let href = String(node.properties.href);
        const hasBlankHash = href.endsWith('#_blank') || href.includes('#_blank?') || href.includes('#_blank#');
        const hasBlankQuery = href.includes('target=_blank') || href.includes('_blank=1');
        const isExternal = /^(https?:)?\/\//i.test(href);
        const hasExplicitSelf = href.endsWith('#_self') || href.includes('target=_self');

        if ((hasBlankHash || hasBlankQuery || isExternal) && !hasExplicitSelf) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
          node.properties.href = href
            .replace(/#_blank$/, '')
            .replace(/#_blank\?/, '?')
            .replace(/#_blank#/, '#')
            .replace(/([?&])target=_blank&?/, '$1')
            .replace(/[?&]$/, '');
        } else if (hasExplicitSelf) {
          node.properties.target = '_self';
          node.properties.href = href
            .replace(/#_self$/, '')
            .replace(/([?&])target=_self&?/, '$1')
            .replace(/[?&]$/, '');
        }
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkStarlightAutoImport],
    rehypePlugins: [rehypeLinkTarget],
  },
  site: 'https://snippethub-docs.awesomediscoveryzone.com',
  base: process.env.BASE_PATH || '/',
  integrations: [
    articleManifestIntegration(),
    starlight({
      title: 'SnippetHub Support',
      description: 'Official documentation and support portal for SnippetHub - Text Snippet Manager for Chrome',
      logo: {
        src: './src/assets/snippethub.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      social: {
        github: 'https://github.com/write-tim/snippethub-docs',
      },
      head: [
        {
          tag: 'script',
          content: `
            (function() {
              function processLinks() {
                document.querySelectorAll('a[href]').forEach(function(a) {
                  var href = a.getAttribute('href') || '';
                  var hasBlank = href.endsWith('#_blank') || href.includes('#_blank?') || href.includes('#_blank#');
                  var isExt = /^(https?:)?\\/\\//i.test(href) && !href.includes(window.location.host);
                  var isSelf = href.endsWith('#_self') || href.includes('target=_self');
                  if ((hasBlank || isExt) && !isSelf) {
                    a.setAttribute('target', '_blank');
                    a.setAttribute('rel', 'noopener noreferrer');
                    if (hasBlank) {
                      a.setAttribute('href', href.replace(/#_blank$/, '').replace(/#_blank\\?/, '?').replace(/#_blank#/, '#'));
                    }
                  } else if (isSelf) {
                    a.setAttribute('target', '_self');
                    a.setAttribute('href', href.replace(/#_self$/, ''));
                  }
                });
              }
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', processLinks);
              } else {
                processLinks();
              }
              document.addEventListener('astro:page-load', processLinks);
              document.addEventListener('click', function(e) {
                var a = e.target.closest('a[href]');
                if (!a) return;
                var href = a.getAttribute('href') || '';
                var hasBlank = href.endsWith('#_blank') || href.includes('#_blank?') || href.includes('#_blank#');
                var isExt = /^(https?:)?\\/\\//i.test(href) && !href.includes(window.location.host);
                var isSelf = href.endsWith('#_self') || href.includes('target=_self');
                if ((hasBlank || isExt) && !isSelf) {
                  a.setAttribute('target', '_blank');
                  a.setAttribute('rel', 'noopener noreferrer');
                  if (hasBlank) {
                    a.setAttribute('href', href.replace(/#_blank$/, '').replace(/#_blank\\?/, '?').replace(/#_blank#/, '#'));
                  }
                }
              }, true);
            })();
          `,
        },
      ],
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Welcome to Support', link: '/' },
          ],
        },
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        {
          label: 'Features',
          autogenerate: { directory: 'features' },
        },
        {
          label: 'Productivity',
          autogenerate: { directory: 'productivity' },
        },
        {
          label: 'Account & Sync',
          autogenerate: { directory: 'account-sync' },
        },
        {
          label: 'Customization',
          autogenerate: { directory: 'customization' },
        },
        {
          label: 'Support & FAQs',
          autogenerate: { directory: 'support' },
        },
        {
          label: 'Back to SnippetHub',
          link: 'https://awesomediscoveryzone.com/snippethub/',
        },
      ],
    }),
  ],
});
