import { xios } from '@/api/instance';
import { ICaptchaResult } from '@/api/interface';

/******************************
 *           Captcha
 ******************************/

// https://api.vmatrix.org.cn/#/captcha/get_api_captcha
export function fetchCaptcha() {
  return xios.get<ICaptchaResult>(`/api/captcha`);
}
