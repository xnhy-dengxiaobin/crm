/**
 * 可惜vue的插件在原型链中增加对象有限制, 因为对象中的this指向当前对象,
 *     这样就没法调用其它插件了, 因为没法获取到vue的实例, 所以全部添加的实例方法
 * 所有的Util统一封装为Util的实例方法, 避免调用时混淆
 */
const Util = {};
Util.install = function(Vue, options) {
  /** ********* alert/confirm/prompt/toast等Util ***************/
  Vue.prototype.alert = function(message, cb) {
    this.$alert(message, "提示", {
      confirmButtonText: "确定",
      callback: action => {
        if (cb) {
          cb();
        }
      }
    });
  };
  Vue.prototype.confirm = function(message, success, cancel) {
    this.$confirm(message, "确认").then(
      () => {
        if (success) {
          success();
        }
      },
      () => {
        if (cancel) {
          cancel();
        }
      }
    );
  };
  Vue.prototype.prompt = function(message, success, cancel) {
    this.$prompt(message, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消"
    })
      .then(({ value }) => {
        if (success) {
          success(value);
        }
      })
      .catch(() => {
        if (cancel) {
          cancel();
        }
      });
  };
  Vue.prototype.toast = function(
    message,
    type = "success",
    callback = null,
    duration = 2000
  ) {
    this.$message({
      message: message,
      type: type,
      center: true,
      duration: duration,
      onClose: callback
    });
  };
  Vue.prototype.success = function(message, callback = null, duration = 2000) {
    this.toast(message, "success", callback, duration);
  };
  Vue.prototype.error = function(message, callback = null, duration = 2000) {
    this.toast(message, "error", callback, duration);
  };

  /** *************** 选择处理 ******************/
  Vue.prototype.checkAtLeastOne = function(items) {
    let selectedItems = items.filter(it => {
      return it.isChecked;
    });
    if (this.arrUtil.isEmpty(selectedItems)) {
      return false;
    }
    return selectedItems;
  };

  Vue.prototype.checkOnlyOne = function(items) {
    let selectedItems = this.checkAtLeastOne(items);
    if (!selectedItems) {
      return selectedItems;
    }
    return selectedItems.length > 1 ? false : selectedItems[0];
  };

  /** ************* modal ******************/
  Vue.prototype.modalOpen = function(ref) {
    this.$refs[ref].open();
  };
  Vue.prototype.modalClose = function(ref) {
    this.$refs[ref].close();
  };

  /** ************ loading ************ */
  Vue.prototype.showLoading = function() {
    let loading = document.getElementById("loading");
    loading.style.position = "absolute";
    loading.style.zIndex = "100000000";
    loading.style.left = "0";
    loading.style.top = "0";
    loading.style.width = "100%";
    loading.style.height = "100%";
    loading.style.background = "rgba(177, 178, 179, 0.6)";
    loading.style.border = "1px solid #6D6D6D";
    loading.style.borderRadius = "4px";
    loading.style.display = "flex";
  };
  Vue.prototype.closeLoading = function() {
    setTimeout(() => {
      let loading = document.getElementById("loading");
      loading.style.display = "none";
    }, 200);
  };
};
export default Util;
