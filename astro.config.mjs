// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://snippethub-docs.awesomediscoveryzone.com',
  base: process.env.BASE_PATH || '/',
  integrations: [
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
