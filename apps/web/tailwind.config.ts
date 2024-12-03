import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        disabled: 'rgb(var(--NN400,170,180,200))'
      },
      fontFamily: {
        'poppins': '"Poppins", sans-serif',
        'smooch': '"Smooch Sans", sans-serif'
      },
      backgroundColor: {
        'disabled': 'rgb(var(--NN100,228,235,245))'
      }
    },
  },
  plugins: [],
} satisfies Config;
