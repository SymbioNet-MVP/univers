const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const colorScale = (name) =>
  Object.fromEntries(
    steps.map((step) => [step, `oklch(var(--${name}-${step}) / <alpha-value>)`]),
  );

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: colorScale('background'),
        foreground: colorScale('foreground'),
        primary: colorScale('primary'),
        accent: colorScale('accent'),
        secondary: colorScale('secondary'),
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        label: ['var(--font-label)'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        float: 'var(--shadow-float)',
      },
      borderRadius: {
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        panel: 'var(--radius-panel)',
      },
    },
  },
  plugins: [],
};
