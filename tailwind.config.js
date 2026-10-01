module.exports = {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      colors:{
        'rojo-claro':'#9b2247',
        'rojo-oscuro':'#611323',
        'verde-claro':'#1e5b4f',
        'verde-oscuro':'#002f2a',
        'amarillo-claro':'#e6d194',
        'amarillo-oscuro':'#a57f2c',
        'gris':'#98989a',
        'negro':'#161a1d'
      }
    },
  },
  plugins: [
    require('flowbite-typography'),
  ],
}

