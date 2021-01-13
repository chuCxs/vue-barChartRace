import vueBarChartRace from './vue-bar-chart-race.vue'
import _Vue from 'vue'
// import * as d3 from 'd3';
// _Vue.prototype.$d3 = d3;

vueBarChartRace.install = Vue => {
if (!Vue) {
window.Vue = Vue = _Vue
}
Vue.component(vueBarChartRace.name, vueBarChartRace)
}
export default vueBarChartRace;