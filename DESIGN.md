---
name: Cyber-Pokedex Narrative
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859398'
  outline-variant: '#3c494e'
  surface-tint: '#3cd7ff'
  primary: '#a8e8ff'
  on-primary: '#003642'
  primary-container: '#00d4ff'
  on-primary-container: '#00586b'
  inverse-primary: '#00677e'
  secondary: '#ffb3b2'
  on-secondary: '#680012'
  secondary-container: '#ff525c'
  on-secondary-container: '#5b000f'
  tertiary: '#efd6ff'
  on-tertiary: '#4b007e'
  tertiary-container: '#ddb2ff'
  on-tertiary-container: '#7800c5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b4ebff'
  primary-fixed-dim: '#3cd7ff'
  on-primary-fixed: '#001f27'
  on-primary-fixed-variant: '#004e5f'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b2'
  on-secondary-fixed: '#410008'
  on-secondary-fixed-variant: '#92001e'
  tertiary-fixed: '#f1daff'
  tertiary-fixed-dim: '#dfb7ff'
  on-tertiary-fixed: '#2d004f'
  on-tertiary-fixed-variant: '#6b00b0'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  ui-header:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  data-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for a high-fidelity, futuristic encyclopedia experience. It evokes the feeling of interacting with a premium, military-grade tactical interface or a high-tech data core. The aesthetic is rooted in **Glassmorphism** and **Cyber-Tech** influences, utilizing deep blacks to provide a void-like canvas for vibrant, neon-emissive data points. 

The emotional response should be one of "discovery through technology"—where every interaction feels like decrypting advanced biological data. Layouts are sharp, structured, and prioritize information density without sacrificing visual breathing room.

## Colors
The palette is built on a "Deep Space" foundation using **Deep Black (#050505)** to ensure maximum contrast for neon elements. 

- **Primary (Electric Blue):** Used for active states, primary actions, and "Electric" type data.
- **Secondary (Crimson Red):** Reserved for high-alert data, HP bars, and "Fire" type indicators.
- **Tertiary (Violet):** Used for "Psychic" or rare legendary data tiers.
- **Cyan:** The main functional accent for borders, scanners, and technical readouts.

All interactive elements utilize a "Glow State"—a 0-15px outer blur using the element's parent color to simulate an emissive light source on the hardware screen.

## Typography
Typography is a blend of expressive geometric forms and utilitarian precision. 

- **Sora** handles all major headings, providing a bold, futuristic weight that feels premium and authoritative.
- **Manrope** is used for descriptive text and lore, ensuring high readability during long sessions of data consumption.
- **Geist** acts as the technical layer, used for labels, numerical stats, and metadata. Its monospaced characteristics reinforce the "scanner" aesthetic.

Use `textTransform: uppercase` and tracking (letter-spacing) on Geist labels to mimic tactical HUD interfaces.

## Layout & Spacing
The layout follows a **Fixed Grid** model for desktop to maintain the "console" feel, and a fluid model for mobile. We use a 12-column system where components often span 3 or 4 columns to create a modular "dashboard" appearance.

Vertical rhythm is strictly governed by a 4px base unit. Larger sections are separated by 48px or 64px to allow the glass backgrounds to breathe. Use asymmetric padding in "scanner panels" (e.g., more padding on the left than the right) to suggest advanced technical instrumentation.

## Elevation & Depth
Depth is achieved through **Glassmorphism** rather than traditional shadows. 

1.  **Base Layer:** Deep Black (#050505).
2.  **Surface Layer:** Semi-transparent panels with a `backdrop-filter: blur(20px)`. 
3.  **Accent Layer:** 1px solid borders using low-opacity versions of the Neon palette (Cyan or Electric Blue).
4.  **Emissive Layer:** Inner and outer glows (drop-shadows with 0 offset and high blur) indicate which panel is currently "active" or "hovered."

Avoid opaque surfaces; the UI should feel like layers of projected light on a dark glass substrate.

## Shapes
The shape language is "Technical Soft." While the overall system is grounded in a grid, corners are slightly softened (0.25rem to 0.5rem) to feel like modern consumer electronics (smartphones/tablets). 

Specific "Scanner Panels" may feature **chamfered edges** (clipped corners at 45 degrees) on one or two sides to lean into the sci-fi aesthetic, particularly for HUD elements and stat containers.

## Components

- **Glowing Cards:** Feature a 1px Cyan border. On hover, apply a subtle CSS `rotate3d` tilt effect and increase the border's glow intensity.
- **Stat Bars:** Use a segmented design (rectangles with gaps) rather than a solid fill. Use a gradient fill from a dim color to a bright neon color (e.g., Dark Red to Crimson Red).
- **Glass Buttons:** Fully transparent backgrounds with a 1px stroke. Text must be in `ui-header` style (Geist, Uppercase). The background fills with a solid neon color on click/tap.
- **Scanner Panels:** Large containers for Pokémon sprites. Should include "corner-only" borders (L-shaped accents) and a very subtle animated "scanline" overlay (low-opacity horizontal line moving vertically).
- **Input Fields:** Bottom-border only, using a subtle Cyan stroke. When focused, the stroke glows and a "Data Input" label appears in the corner.
- **Navigation:** A top-pinned bar with `backdrop-filter: blur(30px)`. Active links are underlined with a high-glow 2px Cyan line.