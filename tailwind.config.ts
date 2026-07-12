import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E3A8A',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          DEFAULT: '#10B981',
          500: '#10B981',
          600: '#059669',
        },
        neutral: {
          DEFAULT: '#F8FAFC',
        },
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  darkMode: 'class',
  plugins: [], // heroui() রিমুভ করা হয়েছে
};

export default config;