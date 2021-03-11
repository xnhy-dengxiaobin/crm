import {
  DELETE,
  DELETE_BUTTON_ID,
  INSERT,
  INSERT_BUTTON_ID,
  UPDATE,
  UPDATE_BUTTON_ID
} from "./constant";

export default class DataUtil {
  constructor(vue) {
    this.vue = vue;
    this.path = vue.path;
    this.menuId = vue.menuId;
    this.actionId = vue.actionId;
  }

  addRowState(ls, rowstate) {
    ls.forEach(l => {
      l.rowstate = rowstate;
    });
  }

  resetChecked(item) {
    delete item.isChecked;
  }

  query(p) {
    let param = {
      path: this.path,
      actionId: this.actionId,
      menuId: this.menuId,
      datasetIds: p.datasetIds,
      dataParam: p.dataParam,
      hideLoading: p.hideLoading,
      success: data => {
        this.processSaveReturn(p, data);
      },
      error: error => {
        this.processErrorReturn(p, error);
      }
    };
    return this.vue.$http.doPost(param);
  }

  // 异步验证方法
  // check(p) {
  //   return this.query(p).pipe(
  //     map(p.validFunc)
  //   );
  // }

  /**
   * @param p={item:{}, datasetId:"", success: func, error: func}
   */
  increase = function(p) {
    this.addRowState([p.item], INSERT);
    let datas = p.datas
      ? p.datas
      : [
          {
            datasetId: p.datasetId,
            rows: [p.item]
          }
        ];
    let param = {
      path: this.path,
      actionId: this.actionId,
      menuId: this.menuId,
      buttonId: INSERT_BUTTON_ID,
      hideLoading: p.hideLoading,
      datas: datas,
      success: data => {
        this.processSaveReturn(p, data);
      },
      error: error => {
        this.processErrorReturn(p, error);
      }
    };
    this.vue.$http.doPost(param);
  };

  /**
   * @param p={datas:[{datasetId:"", rows:[]},{}], success: func, error: func}
   */
  modifyN(p) {
    let param = {
      path: this.path,
      actionId: this.actionId,
      menuId: this.menuId,
      buttonId: UPDATE_BUTTON_ID,
      hideLoading: p.hideLoading,
      datas: p.datas,
      success: data => {
        this.processSaveReturn(p, data);
      },
      error: error => {
        this.processErrorReturn(p, error);
      }
    };
    this.vue.$http.doPost(param);
  }

  /**
   * @param p={item:{}, datasetId:"", success: func, error: func}
   */
  modify(p) {
    this.addRowState([p.item], UPDATE);
    let param = {
      path: this.path,
      actionId: this.actionId,
      menuId: this.menuId,
      buttonId: UPDATE_BUTTON_ID,
      hideLoading: p.hideLoading,
      datas: [
        {
          datasetId: p.datasetId,
          rows: [p.item]
        }
      ],
      success: data => {
        this.processSaveReturn(p, data);
      },
      error: error => {
        this.processErrorReturn(p, error);
      }
    };
    this.vue.$http.doPost(param);
  }

  // 剔除数据中没有修改过的项
  clearDatas = function(items) {
    let datas = [];
    for (let i in items) {
      if (
        items[i].rowstate === INSERT ||
        items[i].rowstate === UPDATE ||
        items[i].rowstate === DELETE
      ) {
        datas.push(items[i]);
      }
    }
    return datas;
  };

  /**
   * @param p={items:{}, datasetId:"", success: func, error: func}
   */
  remove(p) {
    let actionId = this.actionId;
    let menuId = this.menuId;
    let addRowState = this.addRowState;
    if (!this.vue.arrUtil.atLeastOne(p.items)) {
      this.message.warning("请选择需要删除的记录");
      return;
    }
    this.vue.confirm("确定删除记录吗?", () => {
      addRowState(p.items, DELETE);
      let param = {
        path: this.path,
        actionId: actionId,
        menuId: menuId,
        buttonId: DELETE_BUTTON_ID,
        hideLoading: p.hideLoading,
        datas: [
          {
            datasetId: p.datasetId,
            rows: p.items
          }
        ],
        success: data => {
          this.processSaveReturn(p, data);
        },
        error: error => {
          this.processErrorReturn(p, error);
        }
      };
      this.vue.$http.doPost(param);
    });
  }

  /**
   * @param p={buttonId:"", stepGroupId:"", dataParam:{}, datas:[], success:func, error:func}
   */
  exec(p) {
    let param = {
      path: this.path,
      actionId: this.actionId,
      menuId: this.menuId,
      buttonId: UPDATE_BUTTON_ID,
      stepGroupId: "grv",
      steps: p.steps,
      dataParam: p.dataParam,
      hideLoading: p.hideLoading,
      datas: p.datas,
      success: data => {
        this.processSaveReturn(p, data);
      },
      error: error => {
        this.processErrorReturn(p, error);
      }
    };
    this.vue.$http.doPost(param);
  }

  processSaveReturn(p, data) {
    if (data && data.code) {
      if (p.success) {
        p.success(data);
      } else {
        let message = data.message;
        if (message) {
          this.vue.info(message);
        } else {
          this.vue.success("操作成功");
        }
      }
    } else {
      this.processErrorReturn(p, data);
    }
  }

  processErrorReturn(p, error) {
    if (!error) {
      // 即使调用成功, 也总是会先进这里, 只好把undefined排除掉
      return;
    }
    if (p.error) {
      p.error(error);
    } else {
      this.vue.error(error && error.message ? error.message : "执行服务出错");
    }
  }
}
