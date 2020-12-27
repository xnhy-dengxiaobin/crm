<template>
  <div class="mod-demo-echarts">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <el-select v-model="selectProject2" placeholder="请选择" @change="changeProject2">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <div id="J_chartBarBox" class="chart-box"></div>
          <el-radio-group v-model="unit2" @change="changeUnit2">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <el-select v-model="selectProject" placeholder="请选择" @change="changeProject">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <div id="J_chartPieBox" class="chart-box"></div>
          <el-radio-group v-model="unit" @change="changeUnit">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        selectProject: null,
        selectProject2: null,
        projects: [],
        chartLine: null,
        chartBar: null,
        chartPie: null,
        chartScatter: null,
        xData: [],
        yData: [],
        dataList: [],
        unit: "day",
        unit2: "day",
        xData2: [],
        yData2: {
          zrdf: [],
          qdkh: [],
          ldx: [],
          lkh: []
        },
        dataList2: [],
        labelOption: {
          show: true,
          // position: app.config.position,
          // distance: app.config.distance,
          // align: app.config.align,
          // verticalAlign: app.config.verticalAlign,
          // rotate: app.config.rotate,
          // formatter: '{c}  {name|{a}}',
          position: "top",
          fontSize: 10,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        }
      }
    },
    mounted () {
      var $this = this
      this.queryProjects(function () {
        $this.initChartBar()
        $this.initChartPie()
      })
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartPie) {
        this.chartPie.resize()
      }
      if (this.chartScatter) {
        this.chartScatter.resize()
      }
    },
    methods: {
      changeProject() {
        console.log(this.selectProject)
        this.changeUnit()
      },
      changeProject2() {
        console.log(this.selectProject2)
        this.changeUnit2()
      },
      queryProjects(fun) {
        this.$http({
          url: this.$http.adornUrl('/busi/busiuserproject/listProjectsByUser'),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.projects = data.projects
            // this.projects.splice(0, 0, {id: 0, name: '全部项目'});
            this.selectProject = this.projects[0].id
            this.selectProject2 = this.projects[0].id
            fun()
          } else {
            this.projects = []
          }
        })
      },
      changeUnit(value) {
        console.log(this.unit)
        this.xData = [];
        this.yData = [];
        this.dataList = [];
        // var $this = this;
        this.queryStatistics("", function () {
          // $this.queryStatisticsInfo($this.dataList[$this.dataList.length - 1])
        })
      },
      changeUnit2(value) {
        console.log(this.unit)
        this.xData2 = [];
        this.yData = {
          zrdf: [],
          qdkh: [],
          ldx: [],
          lkh: []
        };
        this.dataList2 = [];
        this.statisticsSource("", function () {
          // $this.queryStatisticsInfo($this.dataList[$this.dataList.length - 1])
        })
      },
      // 柱状图
      initChartBar () {
        var option = {
          title: {
            text: '客户来源统计'
          },
          // dataZoom: [{
          //   type: 'inside',
          //   startValue: 1,
          //   endValue: 4
          // }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          color: ['#086f0c', '#006699', '#4cabce', '#e5323e'],
          legend: {
            data: ['渠道客户', '自然到访', '老客户', '老带新']
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: this.xData2,
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#2C2C2C",
                  fontSize: 11,
                },
                formatter: function (value) {
                  var ret = "";// 拼接加\n返回的类目项
                  var maxLength = 5;// 每项显示文字个数
                  var valLength = value.length;// X轴类目项的文字个数
                  var rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
                  if (rowN > 1) { // 如果类目项的文字大于5,
                    for (var i = 0; i < rowN; i++) {
                      var temp = "";// 每次截取的字符串
                      var start = i * maxLength;// 开始截取的位置
                      var end = start + maxLength;// 结束截取的位置
                      // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                      temp = value.substring(start, end) + "\n";
                      ret += temp; // 凭借最终的字符串
                    }
                    return ret;
                  } else {
                    return value;
                  }
                }
              }
            }
          ],
          yAxis: [
            {
              show: false
            }
          ]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        var $this = this
        this.chartBar.on('datazoom', function (params) {
          console.log(params)
          // 监听到有平移动作，就请求接口，数组增加
          if (params.batch[0].start === 0) {
            $this.statisticsSource($this.dataList2[0])
          }
        });
        this.statisticsSource('')
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },

      statisticsSource(endDate, fun) {
        this.$http({
          url: this.$http.adornUrl('/busi/manager/busicustomer/statisticsSource?projectId=' + this.selectProject2 + "&unit=" + this.unit2 + "&endDate=" + endDate),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data.code === 0) {
            var list = data.rs;
            for (var index in list) {
              if (index !== '0' || !endDate) {
                this.xData2.unshift(list[index].dateAbscissa)
                this.yData2.zrdf.unshift(list[index].zrdf)
                this.yData2.qdkh.unshift(list[index].qdkh)
                this.yData2.ldx.unshift(list[index].ldx)
                this.yData2.lkh.unshift(list[index].lkh)
                this.dataList2.unshift(list[index].fullDate)
              }
            }
            if (fun) {
              fun()
            }
            this.chartBar.setOption({
              dataZoom: [{
                type: 'inside',
                startValue: 1,
                endValue: 4
              }],
              xAxis: {
                data: this.xData2
              },
              series: [

                {
                  name: '渠道客户',
                  type: 'bar',
                  label: this.labelOption,
                  data: this.yData2.qdkh
                },
                {
                  name: '自然到访',
                  type: 'bar',
                  barGap: 0,
                  label: this.labelOption,
                  data: this.yData2.zrdf
                },
                {
                  name: '老客户',
                  type: 'bar',
                  label: this.labelOption,
                  data: this.yData2.lkh
                },
                {
                  name: '老带新',
                  type: 'bar',
                  label: this.labelOption,
                  data: this.yData2.ldx
                }
              ]
            });
          }
        })
      },
      // 饼状图
      initChartPie () {
        this.yData = [];
        this.xData = []
        var option = {
          dataZoom: [{
            type: 'inside',
            startValue: 1,
            endValue: 7
          }],
          yAxis: {
            show: false
          },
          // color: ['#0077FF'],
          title: {
            text: "来访客户统计",
          },
          tooltip: {
            trigger: "item",
            // trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow",
              // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              axisTick: { show: false },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#2C2C2C",
                  fontSize: 11,
                },
                formatter: function (value) {
                  if (!value) {
                    return value
                  }
                  var ret = "";// 拼接加\n返回的类目项
                  var maxLength = 5;// 每项显示文字个数
                  var valLength = value.length;// X轴类目项的文字个数
                  var rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
                  if (rowN > 1) { // 如果类目项的文字大于5,
                    for (var i = 0; i < rowN; i++) {
                      var temp = "";// 每次截取的字符串
                      var start = i * maxLength;// 开始截取的位置
                      var end = start + maxLength;// 结束截取的位置
                      // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                      temp = value.substring(start, end) + "\n";
                      ret += temp; // 凭借最终的字符串
                    }
                    return ret;
                  } else {
                    return value;
                  }
                }
              },
              data: this.xData,
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              type: "bar",
              // barWidth: "30%",
              data: this.yData,
              label: {
                show: true,
                position: "top",
                color: "#2c2c2c",
              },
              // 柱体顶部显示数值
              itemStyle: {
                color: "#4a9eff",
              },
              markLine: {
                symbol: ["none", "none"],
                label: {
                  show: true,
                  position: "start",
                },
                lineStyle: {
                  color: "#CF0000",
                  width: 1,
                },
                data: [
                  {
                    yAxis: 1000,
                  },
                ],
              },
              // 库存不足红色标线
            },
          ],
        };
        this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
        this.chartPie.setOption(option)
        var $this = this
        this.chartPie.on('datazoom', function (params) {
          // 监听到有平移动作，就请求接口，数组增加
          if (params.batch[0].start === 0) {
            $this.fetchData();
          }
        });
        // this.chartPie.on('click', function (params) {
        //   $this.queryStatisticsInfo($this.dataList[params.dataIndex])
        // });
        this.queryStatistics('')
        window.addEventListener('resize', () => {
          this.chartPie.resize()
        })
      },

      fetchData() {
        // 通过 setTimeout 模拟异步加载
        this.queryStatistics(this.dataList[0])
      },
      queryStatistics(endDate, fun) {
        this.$http({
          url: this.$http.adornUrl('/busi/manager/busicustomer/statisticsCom?projectId=' + this.selectProject2 + "&unit=" + this.unit + "&endDate=" + endDate),
          method: 'get',
          params: {}
        }).then(({data}) => {
          if (data.code === 0) {
            var list = data.rs;
            for (var index in list) {
              if (index !== '0' || !endDate) {
                this.xData.unshift(list[index].dateAbscissa)
                this.yData.unshift(list[index].num)
                this.dataList.unshift(list[index].fullDate)
              }
            }
            if (fun) {
              fun()
            }
            this.chartPie.setOption({
              dataZoom: [{
                type: 'inside',
                startValue: 1,
                endValue: 7
              }],
              xAxis: {
                data: this.xData
              },
              series: [{
                // 根据名字对应到相应的系列
                data: this.yData
              }]
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -10px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-box {
      min-height: 400px;
    }
  }
</style>
