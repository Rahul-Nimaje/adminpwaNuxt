import Vue from "vue";
import Vuex from "vuex";
import user from "./user";
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
export default () => {
    return new Vuex.Store({
      modules: {
        user,
      },
      plugins: [
        // Use vuex-persistedstate as a Vuex plugin
        createPersistedState({
          key: 'my-app-key', // Change this key to a unique identifier for your app
          paths: ['user'], // Specify which state properties to persist
        }),
      ],
    });
  };
  
