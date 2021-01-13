import Vue from 'vue'
import App from './App.vue'
import * as d3 from 'd3';
Vue.prototype.$d3 = d3;

new Vue({
  el: '#app',
  render: h => h(App)
})
