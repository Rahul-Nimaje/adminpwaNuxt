
import usermixins from './usermixins';
import tokenmixins from './tokenmixins';
import categorymixins from './categorymixins';
import Vue from 'vue';
console.log("usermixins", usermixins)
Vue.mixin(
    usermixins
);
Vue.mixin(tokenmixins)
Vue.mixin(categorymixins)