# Time of Magic

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/stezkoy/flarum-time-of-magic.svg)](https://packagist.org/packages/stezkoy/flarum-time-of-magic) [![Total Downloads](https://img.shields.io/packagist/dt/stezkoy/flarum-time-of-magic.svg)](https://packagist.org/packages/stezkoy/flarum-time-of-magic)

A Flarum extension that adds a touch of magic to your site with visual enhancements and fun effects.

[Русская версия](README.ru.md)

## Features

### Scroll Progress Bar
A thin progress bar below the header that fills as you scroll down the page. Matches your site's primary color.

### Back to Top Button
A floating button that appears after scrolling down. Click it to smoothly scroll back to the top.
- Choose between **circle** or **rounded square** shape
- Use any **FontAwesome icon** (e.g. `fa-solid fa-chevron-up`, `fa-solid fa-angle-double-up`)

### Falling Snow
Adds animated falling snowflakes across the entire site. Perfect for the holiday season.
- **3 density levels:** Light (25 flakes), Medium (50 flakes), Heavy (75 flakes)

### Falling Leaves
Adds animated autumn leaves drifting across the entire site.
- **3 density levels:** Light (10 leaves), Medium (25 leaves), Heavy (40 leaves)

### Falling Rain
Adds a rain effect with falling raindrops across the entire site. Color adapts to the site theme.
- **3 density levels:** Light (40 drops), Medium (80 drops), Heavy (140 drops)

### Custom Scrollbar
Replaces the default browser scrollbar with a thin, themed one that matches your site colors.

### Click Spark
A burst of sparkles from your cursor on every click. A fun little touch that adds magic to the whole site.

### Swap Sidebar & Content
Moves the sidebar to the right and discussion list to the left, giving your forum a unique layout.

### Background Patterns
Subtle background patterns that work on both light and dark themes:
- Dots
- Grid
- Diagonal lines
- Waves
- Hexagons

### Per-Feature Accent Colors
Each colored feature is individually customizable and defaults to your forum's color when left empty:
- Progress bar color
- Back to top button color
- Custom scrollbar color
- Click spark color

Accepts any CSS color, e.g. `#00a185`, `red`, `rgb(255, 0, 0)` — or leave empty to use your forum color.

## Installation

```bash
composer require stezkoy/flarum-time-of-magic
```

## Requirements

- Flarum 2.0
- PHP 8.3+

## Configuration

All features are configurable via **Admin > Extensions > Time of Magic**. Each feature can be toggled on/off independently.

## License

MIT
