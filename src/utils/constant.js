export const debug = true;

export const META = {
  companyId: "enn",
  systemNo: "enn",
  companyName: "enn",
  companyTree: "enn",
  parentCompanyId: "enn",
  tree: "enn"
};

/* export const PROTOCOL = 'http';
export const HOST = '172.18.3.112';
export const PORT = '8080'; */
/* export const PROTOCOL = 'http';
export const HOST = 'localhost';
export const PORT = '6022';
export const IP_AND_PORT = HOST + (PORT ? ":" + PORT : '');
export const CONTEXT_NAME = 'csot-server';
export const URL = `${PROTOCOL}://${IP_AND_PORT}${(CONTEXT_NAME ? ("/" + CONTEXT_NAME) : "")}`; */

let BASE_URL = window.SITE_CONFIG["baseUrl"];
export const BUSINESS_HOST = `${BASE_URL}/core/`; // 取数
export const SSO_HOST = `${BASE_URL}/sso/`; // 登录
export const FILE_HOST = `${BASE_URL}/file/`; // 文件服务
export const CAPTCHA_HOST = `${BASE_URL}/captcha/`; // 图片验证码服务
export const IMAGE_HOST = `${BASE_URL}/pics/`; // 图片上传
export const EXCEL_HOST = `${BASE_URL}/excel/`; // excel导入导出

/**
 * 业务的action名称
 */
export const BUSINESS_ACTION = "execBusiness";
/**
 * 生成单号action
 */
export const DOC_CODE_ACTION = "genDocCode";
/**
 * 导出excel
 */
export const EXPORT_EXCEL_ACTION = "export";
/**
 * 导入excel
 */
export const EXCEL_IMPORT_ACTION = "import";
/**
 * 保存的action名称
 */
export const SSO_ACTION = "login";
/**
 * 登出的action名称
 */
export const SSO_LOGOUT_ACTION = "logout";
/**
 * 上传的action名称
 */
export const FILE_UPLOAD_ACTION = "upload";
/**
 * 文件下载
 */
export const FILE_DOWNLOAD_ACTION = "download";
// 文件下载url的前半部分
export const DOWNLOAD_URL = FILE_HOST + FILE_DOWNLOAD_ACTION + "?fileId=";
// 生成文件验证码action
export const CAPTCHA_ACTION = "gen";
// 验证码
export const CAPTCHA_URL = `${CAPTCHA_HOST}${CAPTCHA_ACTION}`;

// 数据增删查改标识
export const DELETE = 2;
export const DELETE_BUTTON_ID = 1;
export const INSERT = 4;
export const INSERT_BUTTON_ID = 2;
export const UPDATE = 8;
export const UPDATE_BUTTON_ID = 3;

// 分页参数初始值
export const PAGE_START = 0;
export const PAGE_SIZE = 10;
export const PAGE_NUMS = 5;

export const CURRENT_TAB_KEY = "currentTab";
export const TABS_KEY = "tabs";
export const TABS_SESSION_ID = "";

export const home = {
  menuname: "主页",
  menuurl: "/main/Dashboard",
  actionid: "Dashboard",
  menuid: "Dashboard",
  notClosable: true,
  display: 0
};

// TODO: 测试时用
/* export const HOME_COMPONENT_ACTION_ID = "commonMenu"
export const HOME_COMPONENT_MENU_ID = "commonMenu"
export const HOME_COMPONENT_NAME = "菜单管理" */

export const EVENT_NAV_CHANGED = "navChanged";

export const BUTTONS_DEFAULT = 7;
export const BUTTONS_ALL = 65535;
