# Interactions, animations & UI behavior

Describe how things move and behave so Cursor can implement them. Be specific where it matters.

---

## Navigation bar

- **Dropdown / mega menu:** How does it open? (hover vs click) What's inside? (links, sections, icons?)
If you hover your mouse over it, the drop down shows up and you click on the page you want to go to. It has link for different things like lessons, resources
- **Animation:** Use @design/mocks/buildinganimation for when the user clicks "get started" on the homepage. It is an animation of a pink pig shaking while a gold coin is dropped into its back (because its a piggybank)
Use @design/mocks/answeranimation when the user finishes the last questionnaire and its building out the classes. The animation is the pink and green pig both running back and forth carrying books
- **Mobile:** Hamburger menu, Same dropdown

*(Replace with your actual nav behavior.)*

---

## Other dropdowns & menus

- List each dropdown (e.g. "User menu", "Filter dropdown").
Dashboard, Library, Resources, My Profile
- For each: trigger (click/hover), open direction, animation, close on outside click?
Hover and the drop down expands, if you move your mouse away, the dropdown disappears. If you click one of the drop down selections, it goes to that page

---

## Page / section animations

- **Page load:** Any fade-in, slide-up, or stagger for sections?
- **Scroll:** Parallax, sticky headers, or elements that animate in on scroll?
- **Lists / cards:** Stagger on load? Hover lift / shadow?

---

## Micro-interactions

- **Buttons:** Hover (scale, shadow, color)? Active/pressed state?
- **Links:** Underline on hover? Color change?
- **Forms:** Focus ring, error shake, success checkmark?
- **Modals / sheets:** Backdrop fade? Modal slide-up vs fade? Duration?

---

## Keyframes / timing (if you have them)

- Easing: e.g. `ease-out`, `cubic-bezier(0.4, 0, 0.2, 1)`
- Durations: e.g. 150ms for hover, 300ms for modals

*(Add any values from Figma's prototype or design specs.)*
