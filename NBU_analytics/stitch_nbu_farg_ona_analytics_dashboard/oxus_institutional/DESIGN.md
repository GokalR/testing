```markdown
# Design System Document: Institutional Intelligence

## 1. Overview & Creative North Star: "The Sovereign Ledger"
The National Bank of Uzbekistan (NBU) represents the intersection of historical permanence and future-facing economic power. This design system moves away from the "generic SaaS dashboard" aesthetic, adopting a Creative North Star we call **"The Sovereign Ledger."**

This is an editorial-first approach to banking analytics. We treat data not as "widgets" but as a curated financial narrative. By utilizing intentional asymmetry, expansive negative space, and a high-contrast typographic scale (pairing the geometric authority of *Manrope* with the utilitarian precision of *Inter*), we create an environment that feels secure, institutional, and bespoke. The layout mimics the deliberate composition of a high-end financial report rather than a cluttered software interface.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is rooted in the NBU Deep Blue (`primary: #003d7c`), but its application is nuanced. We avoid the "flatness" of traditional dashboards by focusing on light-refraction and tonal shifts.

### The "No-Line" Rule
To achieve a premium, modern feel, **1px solid borders are strictly prohibited** for sectioning or container definition. Boundaries must be defined through:
- **Background Shifts:** Place a `surface-container-lowest` card against a `surface-container-low` background.
- **Tonal Transitions:** Use the subtle difference between `surface` and `surface-container` to imply structure.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Hierarchy is defined by "Value Nesting":
1.  **Base Layer:** `background` (#f7f9fb)
2.  **Structural Sections:** `surface-container-low` (#f2f4f6)
3.  **Primary Interaction Cards:** `surface-container-lowest` (#ffffff)
4.  **Floating Elements/Modals:** `surface-bright` with 80% opacity and `backdrop-blur`.

### Glass & Gradient Polish
Main Action Buttons and Key Performance Indicators (KPIs) should use a subtle linear gradient:
*   **From:** `primary` (#003d7c) 
*   **To:** `primary_container` (#0054a6) at a 135-degree angle.
This prevents the "flat-fill" look and adds a "weighted" feel to the bank's most important touchpoints.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance institutional weight with data readability.

*   **Display & Headlines (Manrope):** Used for large-scale data points and section titles. *Manrope* provides a modern, geometric character that feels architectural.
*   **Body & Labels (Inter):** Used for all granular data, tables, and functional UI elements. *Inter* is chosen for its exceptional legibility at small sizes and high "data density" performance.

**Key Rule:** Use `display-lg` for primary financial totals (e.g., Total Assets). The sheer scale of the typography replaces the need for "loud" colors to indicate importance.

---

## 4. Elevation & Depth: The Layering Principle
Traditional "drop shadows" are often messy. In this system, we use **Ambient Shadows** and **Tonal Layering**.

*   **Tonal Layering:** Instead of shadows, lift a card by placing a `#ffffff` (`surface-container-lowest`) element on a `#f2f4f6` (`surface-container-low`) background.
*   **The Ambient Shadow:** When elevation is required (e.g., for a hovered card or a dropdown), use:
    *   `box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);`
    *   The shadow color is derived from `on_surface` at 6% opacity, creating a natural light falloff.
*   **The Ghost Border:** If accessibility requires a border, use `outline_variant` (#c2c6d3) at **15% opacity**. It should be felt, not seen.
*   **Institutional Glassmorphism:** For sidebars or navigation overlays, use `surface_container_low` at 70% opacity with a `blur(20px)`. This keeps the user grounded in the data-rich background while focusing on the navigation.

---

## 5. Components: Precision & Density

### Cards (The Analytics Vessel)
*   **Rule:** Forbid divider lines. Use vertical whitespace (1.5rem to 2rem) or `surface-variant` background blocks to separate card sections.
*   **Header:** Title in `title-sm` (Inter, Bold) using `on_surface`. Subtitles in `label-md` using `on_surface_variant`.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. Text in `on_primary`. Radius: `md` (0.375rem).
*   **Secondary:** Ghost style. No fill. `outline` (#727783) at 20% opacity for the border.
*   **Tertiary:** `on_secondary_container` text with no container.

### Input Fields
*   **Standard State:** `surface_container_high` fill, no border.
*   **Focus State:** `surface_container_highest` fill, with a 2px `primary` bottom-border only. This mimics the "underlined" authority of a signed legal document.

### Data Visualization (Bespoke Styles)
*   **Charts:** Use `primary` for main data lines. Use `tertiary` (#004920) for "Growth/Positive" and `error` (#ba1a1a) for "Risk/Negative." 
*   **Maps:** Use `surface_container_highest` for landmasses and `primary_fixed` for active data regions to maintain the blue/silver institutional feel.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme typographic scale. Make the numbers huge and the labels small and precise.
*   **Do** allow for "breathing room." High data density requires more white space between *groups*, not less.
*   **Do** use `tertiary` (`#004920`) for success states—it’s a deep, "Banking Green" that feels more prestigious than a bright lime.

### Don't
*   **Don't** use 100% black. Use `on_surface` (#191c1e) for text to maintain a softer, higher-end visual.
*   **Don't** use "Standard Blue" for links. Use the `primary` token to reinforce the NBU brand.
*   **Don't** use rounded corners larger than `xl` (0.75rem). The system should feel structured and stable, not "bubbly" or playful.
*   **Don't** use "Grey" shadows. Always use a tinted shadow derived from the surface color to keep the UI looking clean.