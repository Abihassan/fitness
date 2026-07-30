/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0C",
        ink: "#131316",
        ink2: "#1C1C21",
        line: "#2A2A30",
        bone: "#F3F2EF",
        mist: "#9C9BA5",
        smoke: "#6B6A75",
        volt: "#C9FF3F",
        plasma: "#7B6CFF",
        ember: "#FF5A4E",
        heat0: "#1C1C21",
        heat1: "#3A3320",
        heat2: "#6B5A1E",
        heat3: "#B08A1E",
        heat4: "#C9FF3F",
      },
      fontFamily: {
        display: ["SpaceGrotesk_700Bold"],
        display_medium: ["SpaceGrotesk_500Medium"],
        body: ["Inter_400Regular"],
        body_medium: ["Inter_500Medium"],
        body_semibold: ["Inter_600SemiBold"],
        mono: ["JetBrainsMono_500Medium"],
      },
      borderRadius: { xl2: "28px" },
    },
  },
  plugins: [],
};
