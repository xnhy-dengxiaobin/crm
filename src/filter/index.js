import Vue from "vue";
import * as moment from "moment";

export default {
  install() {
    Vue.filter("date", function(value, formatter = "YYYY-MM-DD HH:mm:ss") {
      return moment(value).format(formatter);
    });
  }
};
