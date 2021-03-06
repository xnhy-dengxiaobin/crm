/**
 * 开发环境
 */
(function() {
  window.SITE_CONFIG = {};

  // api接口请求地址
  window.SITE_CONFIG["baseUrl"] = "http://localhost:8082/crm";
  window.SITE_CONFIG["baseUrl2"] = "http://localhost:6041/sync-server";
  // window.SITE_CONFIG["baseUrl"] = "http://120.92.154.12/crm-server";

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG["domain"] = "./"; // 域名
  window.SITE_CONFIG["version"] = ""; // 版本号(年月日时分)
  window.SITE_CONFIG["cdnUrl"] =
    window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
