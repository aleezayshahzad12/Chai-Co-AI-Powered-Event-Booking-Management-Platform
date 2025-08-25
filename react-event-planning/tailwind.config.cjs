module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vogueHeading: ['Playfair Display', 'serif'],
        vogueBody: ['Cormorant Garamond', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
