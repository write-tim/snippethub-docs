// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.BASE_PATH !== undefined 
  ? process.env.BASE_PATH 
  : (process.env.GITHUB_ACTIONS === 'true' ? '/snippethub-docs' : '/');

// https://astro.build/config
export default defineConfig({
  site: 'https://write-tim.github.io',
  base: base,
  integrations: [
    starlight({
      title: 'SnippetHub Support',
      description: 'Official documentation and support portal for SnippetHub - Text Snippet Manager for Chrome',
      logo: {
        src: './src/assets/logo.png',
        replacesTitle: false,
      },
      favicon: '/favicon.png',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          link: 'https://github.com/write-tim/snippethub-docs'
        }
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
          label: 'Content Management',
          items: [
            { label: 'Sveltia CMS Admin', link: '/admin/', badge: { text: 'CMS', variant: 'tip' } }
          ]
        }
      ],
    }),
  ],
});
