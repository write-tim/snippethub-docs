---
title: Dynamic Placeholders & Custom Variables
description: Automate timestamps, clipboard paste, and interactive user prompts within your snippets.
sidebar:
  order: 5
---

SnippetHub allows you to turn static text into dynamic templates using curly-bracket variables.

## Built-In System Placeholders

These placeholders are evaluated automatically at the moment of snippet insertion:

| Placeholder | Result | Example Output |
| :--- | :--- | :--- |
| `{{date}}` | Current date in `YYYY-MM-DD` | `2026-09-14` |
| `{{time}}` | Current time in `HH:mm` format | `16:30` |
| `{{year}}` | Current 4-digit year | `2026` |
| `{{month}}` | Current full month name | `September` |
| `{{day}}` | Current calendar day of month | `14` |
| `{{dayname}}` | Current day of the week | `Monday` |
| `{{clipboard}}` | Automatically inserts text currently on your clipboard | *(Clipboard text)* |
| `{{cursor}}` | Positions your cursor here after inserting | `|` |

## Interactive Custom Fill-In Variables

You can define custom variables that prompt you for input when inserting a snippet:

### Basic Syntax
Use `{{variable_name}}`:
```text
Hello {{name}}, welcome to the team!
```
When this snippet is inserted, SnippetHub displays a popup modal asking you to enter `name`.

### Friendly Labels
You can provide human-friendly labels using the colon syntax: `{{variable_key:Label}}`:
```text
Hi {{client_name:Client Name}},

Your invoice for {{project:Project Name}} has been generated for {{amount:Invoice Amount}}.
```
When triggered, SnippetHub prompts you with clean form inputs labeled **Client Name**, **Project Name**, and **Invoice Amount**, then instantly stitches together your final text!

