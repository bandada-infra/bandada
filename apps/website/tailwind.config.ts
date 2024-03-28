import type { Config } from "tailwindcss"

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-bandada":
                    "linear-gradient(95deg, #FF5242 14.6%, #EB179B 92.7%)",
                "gradient-cloud":
                    "linear-gradient(139deg, #FF2A26 18.5%, #FF9B79 97.28%)",
                "gradient-purple-pink":
                    "linear-gradient(102deg, #CFB8F9 8.33%, #FFCCF2 48.44%)",
                "gradient-pink-transparent":
                    "linear-gradient(102deg, rgba(207, 184, 249, 0.80) 8.33%, rgba(255, 204, 242, 0.80) 48.44%)"
            },
            fontFamily: {
                unbounded: ["Unbounded", "sans-serif"],
                "dm-sans": ["DM Sans", "sans-serif"]
            },
            colors: {
                "baltic-sea": {
                    50: "#F8F7F8",
                    100: "#F6EDF4",
                    200: "#DED9DE",
                    300: "#C0B8C1",
                    400: "#9D919F",
                    500: "#827384",
                    600: "#6B5D6C",
                    700: "#574C58",
                    800: "#4B414B",
                    900: "#413941",
                    950: "#231F23"
                },
                "sunset-orange": {
                    50: "#FFF2F1",
                    100: "#FFE2DF",
                    200: "#FFCAC5",
                    300: "#FFA59D",
                    400: "#FF7164",
                    500: "#FF5242",
                    600: "#ED2715",
                    700: "#C81D0D",
                    800: "#A51C0F",
                    900: "#881E14",
                    950: "#4B0A04"
                },
                "classic-rose": {
                    50: "#FEF1FA",
                    100: "#FEE5F7",
                    200: "#FFCCF2",
                    300: "#FFA1E6",
                    400: "#FF66D2",
                    500: "#FB39BB",
                    600: "#EB179B",
                    700: "#CD097D",
                    800: "#A90B67",
                    900: "#8D0E57",
                    950: "#570032"
                }
            }
        }
    },
    plugins: []
}
export default config
