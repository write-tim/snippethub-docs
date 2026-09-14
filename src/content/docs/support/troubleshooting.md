---
title: Troubleshooting Guide
description: Solutions for common issues with shortcuts, sync, and page insertion.
sidebar:
  order: 2
---

## Shortcut `⌘K` or `Ctrl+Shift+P` Does Not Open

1. Navigate to `chrome://extensions/shortcuts` in your address bar.
2. Scroll to **SnippetHub - Text Snippet Manager**.
3. Check if another installed Chrome extension is conflicting with the same shortcut key.
4. Set a new preferred shortcut or rebind `Open the Command Palette`.

## Direct Insertion Doesn't Work on a Specific Website

Certain canvas-based editors (like Google Docs or custom iframe rich text widgets) do not respond to standard DOM input events:
- Instead of clicking **Insert**, use the **Copy** button (or press `Enter` / `C`), then press `⌘V` (Mac) or `Ctrl+V` (Windows) to paste directly into the document.

## Snippets Not Syncing Across Computers

1. Confirm you are signed into the same Google or Email account in the SnippetHub side panel on both machines.
2. Check your internet connection.
3. If necessary, sign out and sign back in from the user avatar dropdown menu to refresh your authentication token.

## Need Additional Help?

If you encounter a bug or have a feature request:
- Open an issue on our [GitHub Repository](https://github.com/tmj51578/snippethub/issues).
- Reach out to the maintainer via GitHub.

