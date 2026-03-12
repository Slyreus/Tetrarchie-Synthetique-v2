import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#090B12',
        panel: '#111423'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        'mesh-radial':
          'radial-gradient(circle at 20% 20%, rgba(102, 51, 255, 0.2), transparent 35%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.2), transparent 30%), radial-gradient(circle at 60% 80%, rgba(255,90,95,0.15), transparent 30%)'
      }
    }
  },
  plugins: []
};

export default config;
