# Homepage Grid Specification

## Overview

- Target file: src/components/sites/runoob-com-bab8d52b/root-8a5edab2/HomePage.tsx
- Screenshot: docs/design-references/runoob-com-bab8d52b/root-8a5edab2/homepage-desktop.png
- Interaction model: click-driven static catalog

## DOM Structure

- root shell
  - header
    - brand + search box
    - green navigation bar
  - main
    - array of tutorial groups
      - section title
      - course card grid
        - icon badge
        - item title

## Computed Styles

### Header
- background: rgba(246, 246, 242, 0.94)
- border-bottom: 1px solid rgba(30, 35, 28, 0.15)
- padding-top: 18px

### Navigation
- background: linear-gradient(180deg, #8ea670 0%, #90a974 100%)
- color: rgba(255, 255, 255, 0.97)
- min-height: 54px
- font-weight: 600

### Cards
- background: #f2f4f1
- border: 1px solid #dfe2dc
- border-radius: 12px
- padding: 18px
- hover: slight upward movement, light background shift

## Responsive Behavior
- Desktop: 2-column course grid
- Tablet: stacks to a single column or preserves the same spacing with reduced gap
- Mobile: navigation condenses to 2-column or stacked items, search input full width

## Text Content

The page catalogs tutorial entries such as Python, AI, front-end, back-end, database, mobile development, DevOps, and website building, matching the source page’s categories and tutorial labels.

## Assets
- Icons: local CSS-generated badges, not external images
- No remote images or fonts are required after the build fix
