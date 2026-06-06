import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        mist: "#f4f7f5",
        moss: "#315b48",
        coral: "#d7624d",
        gold: "#c8912f"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 32, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
