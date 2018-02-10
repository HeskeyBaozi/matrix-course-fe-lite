import { xios } from '@/services/instance';
import { ICaptchaResult } from '@/types/api';

/******************************
 *           Captcha
 ******************************/

// https://api.vmatrix.org.cn/#/captcha/get_api_captcha
export function fetchCaptcha() {
  return xios.get<ICaptchaResult>(`/api/captcha`);
}
