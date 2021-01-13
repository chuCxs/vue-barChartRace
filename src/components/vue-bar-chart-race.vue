<template>
  <div class="renderBox" ref="renderBox" :style="{background:option.background}">
    <div id="web_d3_canvas"></div>
  </div>
  
</template>
<script>
export default {
  name: "vue-bar-chart-race",
  data() {
    return {
      ticker:null
    };
  },
  props:{
    option:{
      type:Object,
      default:{

      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
        console.log(this.option)
      const _self = this
      const option = this.option
      const dataOri = option.data
      const d3 = this.$d3
      const width = this.$refs.renderBox.offsetWidth
      const height = this.$refs.renderBox.offsetHeight
      const chartWidth = width - (option.margin.left + option.margin.right)
      const chartHeight = height - (option.margin.top + option.margin.bottom);
      const barHeight = (chartHeight - option.barGap * option.barNumber) / option.barNumber;
      const barRectY = (chartHeight/option.barNumber-barHeight) / 2;
      const newData = [];
      let dateIndex = 0;

      const getDate = () => dataOri.date[dateIndex];//待定
      let date = getDate();
      let dataSlice = [];
      let chart = null, scale = null, axis = null, svg = null,dateTitle = null;

      // 创建SVG
      const createSvg = () =>
        (svg = d3
          .select("#web_d3_canvas")
          .append("svg")
          .attr("width", width)
          .attr("height", height));

      // 格式化数据
      const formatData = () => {
        dataOri.valueList.forEach((item,i)=>{
          let color = getColor(i)
          dataOri.date.forEach((res,index)=>{
            newData.push({
              name: item.name,
              value: Number(item.data[index]),
              lastValue:i > 0 ? Number(item.data[index - 1]) : 0,
              date: res,
              color: option.barOption.type?randomRgbColor():color,
            })
          })

        })
      };
      const getColor = (index)=>{
        if(option.barOption.colorList.length == dataOri.valueList.length){
          return option.barOption.colorList[index]
        }else{
          let res = index%option.barOption.colorList.length
          return option.barOption.colorList[res]
        }
      }   
      // 获取当天数据并按倒叙排列
      const sliceData = () =>
        (dataSlice = newData
          .filter((d) => d.date === date)
          .sort((a, b) => b.value - a.value)
          .slice(0, option.barNumber));

      // 创建比例尺
      const createScale = () =>
        (scale = d3
          .scaleLinear()
          .domain([0, d3.max(dataSlice, (d) => d.value)])
          .range([0, chartWidth]));

      // 创建坐标轴
      const renderAxis = () => {
        createScale();

        axis = d3.axisTop().scale(scale).ticks(option.axisLine.lengths).tickPadding(option.axisLine.padding).tickSize(option.axisLine.marklength);

        svg
          .append("g")
          .classed("axis", true)
          .attr("color", option.axisLine.color)
          .style(
            "transform",
            `translate3d(${option.margin.left}px, ${option.margin.top}px, 0)`
          )
          .call(axis)
      };

      // 创建坐标线
      const renderAxisLine = () => {
        d3.selectAll("g.axis g.tick").select("line.grid-line").remove();
        d3.selectAll("g.axis g.tick")
          .append("line")
          .classed("grid-line", true)
          .attr("stroke", option.axisLine.color)
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 0)
          .attr("y2", chartHeight);
      };

      // 当数据变化时更新坐标轴
      const updateAxis = () => {
        createScale();

        axis.scale().domain([0, d3.max(dataSlice, (d) => d.value)]);

        svg
          .select("g.axis")
          .transition()
          .duration(option.speed)
          .ease(d3.easeLinear)
          .call(axis);

        d3.selectAll("g.axis g.tick text").attr("font-size", 12);
      };

      // 渲染日期标题
      const renderDateTitle = () => {
        dateTitle = svg
          .append("text")
          .classed("date-title", true)
          .text(date)
          .attr("x", width - option.margin.left)
          .attr("y", height - option.margin.top)
          .attr("fill", option.dateStyle.color)
          .attr("font-size", option.dateStyle.fontSize)  
          .attr("text-anchor", "end");
      };

      const calTranslateY = (i, end) => {
        if (dateIndex === 1 || end) {
          return (barHeight + option.barGap) * i + option.barGap / 2;
        } else {
          return (barHeight + option.barGap) * (option.barNumber + 1);
        }
      };

      const createChart = () => {
        chart = svg
          .append("g")
          .classed("chart", true)
          .style(
            "transform",
            `translate3d(${option.margin.left}px, ${option.margin.top}px, 0)`
          );
      };

      const renderChart = () => {
        const bars = chart.selectAll("g.bar").data(dataSlice, (d) => d.name);

        let barsEnter;

        barsEnter = bars
          .enter()
          .append("g")
          .classed("bar", true)
          .style(
            "transform",
            (d, i) => `translate3d(0, ${calTranslateY(i)}px, 0)`
          );

        dateIndex > 1 &&
          barsEnter
            .transition()
            .duration(option.speed)
            .style(
              "transform",
              (d, i) => `translate3d(0, ${calTranslateY(i, "end")}px, 0)`
            );

        barsEnter
          .append("rect")
          .style("width", (d) => scale(d.value))
          .style("height", barHeight + "px")
          .style("fill", (d) => d.color);

        barsEnter
          .append("text")
          .classed("label", true)
          .text((d) => d.name)
          .attr("x", "-5")
          .attr("y", option.barGap)
          .attr("fill", option.barOption.textStyle.color)
          .attr("font-size", option.barOption.textStyle.fontSize)     
          .style("text-anchor", "end");

        barsEnter
          .append("text")
          .classed("value", true)
          .text((d) => d.value)
          .attr("x", (d) => scale(d.value) + 10)
          .attr("y", option.barGap)
          .attr("fill", option.barOption.textStyle.color)
          .attr("font-size", option.barOption.textStyle.fontSize)

        // 更新模式
        bars
          .transition()
          .duration(option.speed)
          .ease(d3.easeLinear)
          .style(
            "transform",
            (d, i) => "translate3d(0, " + calTranslateY(i, "end") + "px, 0)"
          )
          .select("rect")
          .style("width", (d) => scale(d.value) + "px");

        bars
          .select("text.value")
          .transition()
          .duration(option.speed)
          .ease(d3.easeLinear)
          .attr("x", (d) => scale(d.value) + 10)
          .tween("text", function (d) {
            const textDom = this;
            const i = d3.interpolateRound(d.lastValue, d.value);
            return (t) => (textDom.textContent = i(t));
          });

        // 退出模式
        bars
          .exit()
          .transition()
          .duration(option.speed)
          .ease(d3.easeLinear)
          .style("transform", function (d, i) {
            return "translate3d(0, " + calTranslateY(i) + "px, 0)";
          })
          .style("width", function (d) {
            return scale(d.value) + "px";
          })
          .remove();
      };

      function createTicker() {
        _self.ticker = d3.interval(() => {
          if (dateIndex < dataOri.date.length - 1) {
            dateIndex++;
            date = getDate();
            dateTitle.text(date);
            sliceData();
            updateAxis();
            renderAxisLine();
            renderChart();
          } else {
            if(option.loop){
              dateIndex=0
              date = getDate();
              dateTitle.text(date);
              sliceData();
              updateAxis();
              renderAxisLine();
              renderChart();
            }else{
              _self.ticker.stop();
            }           
          }
        }, option.speed);
      }

      const init = () => {
        createSvg(); // 创建一个svg //完成
        formatData(); // 格式化数据
        sliceData(); // 截取当天数据
        renderAxis(); // 渲染坐标轴
        renderAxisLine(); // 渲染指示线
        renderDateTitle(); // 渲染日期
        createChart(); // 创建图表
        renderChart(); // 渲染图表
        createTicker(); // 创建定时器
      };

      init();

      function randomRgbColor() {
        const r = parseInt(Math.random()*(option.barOption.rgb[0][1]-option.barOption.rgb[0][0])+option.barOption.rgb[0][1]);
        const g = parseInt(Math.random()*(option.barOption.rgb[1][1]-option.barOption.rgb[1][0])+option.barOption.rgb[1][1]);
        const b = parseInt(Math.random()*(option.barOption.rgb[2][1]-option.barOption.rgb[2][0])+option.barOption.rgb[2][1]);
        return `rgb(${r},${g},${b})`;
      }
    },
  },
  beforeDestroy(){
    if(this.ticker != null){
      this.ticker.stop()
      this.ticker = null
    }
  }
};
</script>
<style>
.renderBox {
  width: 100%;
  height: 100%;
}
#web_d3_canvas{
  width: 100%;
  height: 100%;
}
</style>