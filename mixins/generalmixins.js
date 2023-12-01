
import usermixins from './usermixins';
import tokenmixins from './tokenmixins';
import Vue from 'vue';
console.log("usermixins", usermixins)
Vue.mixin(
    usermixins
);
Vue.mixin(tokenmixins)