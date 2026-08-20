# Technical Note – CampusConnect University Events Website

## 1. CSS Methods

Three CSS methods are demonstrated:

- **Inline CSS:** used only once on the small `.inline-note` paragraph to demonstrate the technique without making the page difficult to maintain.
- **Internal CSS:** used only for the clearly identified announcement section in the `<head>` of `index.html`.
- **External CSS:** `style.css` contains the main website design, including layout, typography, cards, forms, positioning and responsive rules.

For a multi-page website, **external CSS is the most suitable method** because one stylesheet can be shared by many pages. It provides consistency, easier maintenance, less duplicated code and simpler global design changes.

## 2. Selector Types

The stylesheet demonstrates more than five selector types:

1. Element selectors: `body`, `a`, `footer`
2. Class selectors: `.event-card`, `.btn`, `.container`
3. ID selector: `#events`
4. Group selector: `h1, h2, h3, p`
5. Descendant selector: `.announcement strong`
6. Child selector: `.event-card > .event-content`
7. Attribute selector: `input[type="email"]`
8. Pseudo-class selectors: `:hover`, `:focus-visible`
9. Pseudo-element: `::selection`

## 3. CSS Box Model Calculation

For the event card, assume the desktop grid gives each card a **content width of 338px**.

The card uses the default `content-box` model:

- Content width = 338px
- Left + right padding = 12px + 12px = 24px
- Left + right border = 2px + 2px = 4px
- Horizontal margin = 0px + 0px = 0px

**Total horizontal occupied width = 338 + 24 + 4 + 0 = 366px**

Formula:

`Total width = content + left/right padding + left/right border + left/right margin`

If `box-sizing: border-box` is applied with `width: 366px`, the 366px includes content, padding and border. Therefore the content area becomes:

`366 - 24 - 4 = 338px`

This makes width management easier in responsive layouts.

## 4. Layout and Normal Flow

CSS Grid is used for the primary event-card layout:

`grid-template-columns: repeat(3, minmax(0, 1fr));`

On screens below 800px it changes to:

`grid-template-columns: 1fr;`

The document remains in normal semantic order: header, home, announcement, events, registration, about and footer.

Flexbox is also used for the navigation, form rows and individual event-card content.

## 5. Beyond Normal Flow

Two positioning techniques are demonstrated:

- **Sticky:** the navigation header uses `position: sticky; top: 0;` so navigation remains available while scrolling.
- **Absolute:** event-status badges are positioned inside event images using `position: absolute`.
- **Fixed:** the help button uses `position: fixed` at the lower-right corner.
- **z-index:** the navigation and status badge are layered safely above their surrounding content.

The positioned elements do not cover form fields or essential content.

## 6. Other CSS Properties

The project demonstrates gradients, background colours, border-radius, box-shadow, text-shadow, opacity, overflow, cursor, transition, transform, max-width, list styling and visibility-related behaviour.

Transitions and transforms are used purposefully for button feedback, navigation interaction, event-card elevation and the help-button interaction.

## 7. Responsive Design

The page includes media queries for screens below 800px and approximately 420px.

At desktop width:
- Three event cards are displayed in columns.
- Registration fields can appear in two columns.
- Navigation is horizontal.

At mobile width around 375px:
- Event cards become one column.
- Form fields become one column.
- Navigation wraps into a two-column arrangement.
- Hero artwork is hidden to preserve space.
- No horizontal scrolling is required.

## 8. Testing Evidence

Recommended tests:

### Browser 1 – Chromium/Chrome
- Desktop viewport: approximately 1366 × 768
- Mobile viewport: 375 × 812
- Inspect the event card using Developer Tools > Computed/Box Model.

### Browser 2 – Firefox
- Repeat desktop and mobile checks.
- Verify navigation, event cards, buttons and form fields.

### Example issues and corrections

**Issue 1:** On small screens, two form fields became too narrow.
**Correction:** The `.form-row` changes from `display: flex` with side-by-side fields to `flex-direction: column`.

**Issue 2:** Navigation links became crowded on mobile.
**Correction:** The 420px media query changes `.nav-links` to a two-column grid.

## 9. Submission Files

- `index.html` – semantic webpage structure, internal CSS demonstration and JavaScript.
- `style.css` – primary external stylesheet.
- Desktop screenshot – capture the complete page at desktop width.
- Mobile screenshot – capture the page at approximately 375px.
- Box-model screenshot – inspect one `.event-card` in Developer Tools.
- This technical note – CSS methods, selectors, layout, positioning, responsive behaviour and testing.
