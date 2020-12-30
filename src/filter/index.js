import Vue from "vue";
import * as moment from "moment";

export default {
  install() {
    Vue.filter("date", function(value, formatter = "YYYY-MM-DD HH:mm:ss") {
      return moment(value).format(formatter);
    });

    Vue.filter("prepareStatus", function(value) {
      switch (value) {
        case -10:
          return "拒收无效";
        case -20:
          return "手工无效";
        case -30:
          return "过期无效";
        case 10:
          return "有效";
        default:
          return "待确认";
      }
    });

    Vue.filter("busiStatus", function(value) {
      switch (value) {
        case 20:
          return "接收";
        case 30:
          return "来访";
        case 40:
          return "认筹";
        case 50:
          return "认购";
        case 55:
          return "认购作废";
        case 60:
          return "签约";
      }
    });
  }
};
