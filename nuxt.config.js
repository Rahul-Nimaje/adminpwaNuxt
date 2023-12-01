
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  layout: 'default',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'my-nuxt-project',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'primevue/resources/themes/saga-blue/theme.css', // Choose your theme
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
    "primeflex/primeflex.css",
    '@/assets/css/main.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/primevue', ssr: false },
    '~/mixins/generalmixins.js' ,

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    'primevue/nuxt'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],
  mixins: [],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['primevue'],
  },
  router: {
    middleware: 'auth',
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'home',
        path: '/login',
        component: resolve(__dirname, 'pages/homePage.vue')
      },
      {
        name: 'dashboard',
        path: '/dashboard',
        component: resolve(__dirname, 'pages/Dashboard.vue')
      },
      {
        name: 'alluser',
        path: '/alluser',
        component: resolve(__dirname, 'pages/userPage.vue')
      }
      )
    }
  }
}
