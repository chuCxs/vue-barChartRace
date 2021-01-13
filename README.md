# 描述
基于D3.js的历史统计数据比赛条形图
# 示例效果
![image](https://github.com/chuCxs/vue-barChartRace/blob/main/src/assets/demo.gif)
# 说明
组件基于D3.js进行开发的vue组件
# 安装

```
npm i vue-bar-chart-race --save
```
# 依赖安装


```
npm i d3 --save
```


##### main.js

```
import * as d3 from 'd3';
Vue.prototype.$d3 = d3;
```


##### Demo.vue

```
<template>
  <div class="box">
    <vueBarChartRace :option="option"></vueBarChartRace>
  </div>
</template>
<script>
import vueBarChartRace from 'vue-bar-chart-race'
export default {
  components:{
    vueBarChartRace
  },
}
</script>
```
组件上层需要定义一个块元素作为组件的父容器，父容器的width和height属性不能为auto

# 配置属性


```
option: {
    loop: false, //循环
    background: "rgba(0, 0, 0, 0.2)",
    speed: 1000, //速度
    barNumber: 10, //柱子数量
    barGap: 20, //柱间距离
    margin: {//画布边距
        top: 50,
        bottom: 10,
        left: 80,
        right: 100,
    },
    dateStyle: {
        color: "#000",
        fontSize: 30,
    },
    data:{},
    barOption: {
        //柱色域
        type: true, //true 随机 //false 自定义颜色
        rgb: [[0, 0],[0, 128],[0, 128],], //随机色域取值范围//true
        colorList: ["#f00", "#fff", "#00f"], //自定义颜色
        textStyle: {
          color: "#000",
          fontSize: 15,
        },
    },
    axisLine: {
        //x轴线
        color: "#000", //轴线刻度文字颜色
        lengths: 7, //轴线数量
        padding: 10, //x轴文字距离轴线的距离
        marklength: 5, //刻度线长度
    },
},
```
# data格式


```
data:{
    date:[
        "2020-3-12",
        "2020-3-19",
        "2020-3-26",
        "2020-4-02",
        "2020-4-09",
        "2020-4-16",
        "2020-4-23",
        "2020-4-30",
        "2020-5-07",
        "2020-5-14",
        "2020-5-21",
        "2020-5-28",
        "2020-6-04",
        "2020-6-11",
        "2020-6-18",
        "2020-6-25",
        "2020-6-28",
    ],
    valueList:[{
        name: "美国",
        data: [
          "15113",
          "41035",
          "80589",
          "115242",
          "143626",
          "168941",
          "189973",
          "205463",
          "215858",
          "223096",
          "228006",
          "231732",
          "234013",
          "236142",
          "238159",
          "239706",
          "240136",
        ],
    },{
      name: "巴西",
      data: [
        "52",
        "621",
        "2985",
        "8044",
        "18092",
        "30425",
        "50036",
        "87187",
        "135773",
        "203165",
        "310087",
        "438238",
        "614941",
        "802828",
        "978142",
        "1228114",
        "1313667",
      ],
    }
    ......
    ]
}
```