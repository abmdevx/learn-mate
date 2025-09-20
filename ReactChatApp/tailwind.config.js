export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    colors: {
    primary: "var(--color-primary)",
    "primary-dark": "var(--color-primary-dark)",
    secondary: "var(--color-secondary)",
    "secondary-dark": "var(--color-secondary-dark)",
    text: "var(--color-text)",
    bg: "var(--color-bg)",
    muted: "var(--color-muted)",
      },
    },
  },
  plugins: [],
};