import { fetchResource } from './fetch';
const API_HOST = 'http://testifop.xinyusoft.com';
const API_HOST2 = 'http://120.27.198.61:8080';
/**测试环境
 * 
 * api
 * http://120.27.198.61:8080
 * api2
 * http://testifop.xinyusoft.com
 * 开发环境为代理环境
 * 生产为url
 */

 
// const API8080 = 'api8080'
// const API9527 = 'api9527'

const API8080 = 'http://120.27.198.61:8080'
const API9527 = 'http://testifop.xinyusoft.com'

const SERVICE_NAME = '';

export const Resource = {
  GetQRCodeLogin: fetchResource(`${API_HOST}${SERVICE_NAME}/ifop/GetQRCodeLogin`),//登陆二维码
  QueryLoginResult: fetchResource(`${API9527}${SERVICE_NAME}/ifop/QueryLoginResult`),
  ESBServlet: fetchResource(`${API8080}${SERVICE_NAME}/xycoding/ESBServlet`),
  ESBServlet2: fetchResource(`${API9527}${SERVICE_NAME}/ESBServlet`),
  UploadFile: `${API8080}/xycoding/UploadFile`,//上传接口
  WxAuthLogin: `${API_HOST}/ifop/WxAuthLogin?oid=xyc_test`,//注册二维码

}
