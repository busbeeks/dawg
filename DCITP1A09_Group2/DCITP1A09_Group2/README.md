# KAHLID — Fitness &amp; Wellness Website

**Module:** ST0501 Front-End Web Development — CA2
**Group 2 · Class DCITP/FT/1A/09**
Nabil (P2618522) · Sheng Tao (P2529071) · Adrina (P2618027) · Warren (P2618043)

A responsive, multi-page fitness &amp; wellness site for beginners. Built with a **single
styling framework (Bootstrap 5)** plus a custom external stylesheet, and **vanilla
JavaScript** for all interactivity (no templates, no CMS, no JS frameworks).

## How to view
Open `index.html` in Google Chrome. All pages are linked through the top navigation.

## Folder structure
```
site/
├── index.html               (Home)
├── bmi-calculator.html       ┐ Health Tools
├── calorie-calculator.html   ┘
├── workout-library.html      ┐
├── workout-details.html      │ Workout Programs
├── build-workout.html        ┘
├── nutrition-guide.html      ┐
├── food-database.html        │ Nutrition
├── meal-planner.html         ┘
├── book-trainer.html         ┐
├── class-schedule.html       │ Booking &amp; Community
├── testimonials-faq.html     ┘
├── css/
│   └── style.css             (all custom styling — external only)
├── js/
│   ├── components.js         (shared nav/footer, scroll reveals, parallax, marquee)
│   ├── bmi.js, calorie.js, workout-library.js, build-workout.js,
│   ├── food-database.js, meal-planner.js, booking.js,
│   └── class-schedule.js, testimonials.js
└── images/                   (13 optimised graphics, each &lt; 800 KB)
```

## JavaScript interactivity (DOM manipulation, not alerts)
- **BMI Calculator** — validated inputs, live category + gauge marker.
- **Calorie Calculator** — Mifflin-St Jeor BMR/TDEE, goal adjustment, macro split.
- **Workout Library** — filter cards by level &amp; type with live count.
- **Build Your Own Workout** — 4-step quiz generates a custom plan table.
- **Food Database** — live search, category filter and sort.
- **Meal Planner** — add foods to meals; totals recalculate instantly.
- **Book a Trainer** — full client-side validation + on-page confirmation.
- **Class Schedule** — filter timetable by day.
- **Testimonials &amp; FAQ** — rating filter, Bootstrap accordion, contact validation.
- **Global** — sticky glass navbar, mobile menu, scroll-reveal animations, marquee.

## Technical compliance
- One framework only: **Bootstrap 5** (via CDN) + custom `css/style.css`.
- Responsive for mobile (portrait), tablet and desktop (Bootstrap grid + media queries).
- All styling, layout and effects are in **external files** (no inline styles, no `<style>`).
- Meaningful `alt` text on every image; high-contrast colour palette.
- Semantic HTML5, valid markup (validator.w3.org &amp; jigsaw.w3.org CSS validator).
- Consistent kebab-case file naming and organised folders.
