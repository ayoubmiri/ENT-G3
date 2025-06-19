module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'est-blue': '#1e3a8a',
        'est-light-blue': '#3b82f6',
        'est-yellow': '#f59e0b',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    }
  },
  plugins: [],

  theme: {
  extend: {
    colors: {
      primary: '#2c3e50',
      secondary: '#3498db',
      accent: '#e74c3c',
      light: '#ecf0f1',
      dark: '#2c3e50',
       success: '#27ae60',
       // Your existing EST colors
      'est-blue': '#1e3a8a',
      'est-light-blue': '#3b82f6',
      'est-yellow': '#f59e0b',
      }
    }
  }
}