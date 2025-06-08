/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
  safelist: [
    // 필요한 row-span 및 col-span 값들을 여기에 추가
    {
      pattern: /row-span-(1|2|3|4|5|6|7|8|9|10)/, // 필요한 최대 rowspan 값에 따라 조정
    },
    {
      pattern: /col-span-(1|2|3|4|5|6|7|8|9|10)/, // 필요한 최대 colspan 값에 따라 조정
    },
  ],
};
