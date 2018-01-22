import { xios } from '@/api/instance';

/******************************
 *           Captcha
 ******************************/

export interface CaptchaResult {
    data: {
        captcha: string;
    }
}

// https://api.vmatrix.org.cn/#/captcha/get_api_captcha
export function fetchCaptcha() {
    return xios.get<CaptchaResult>(`/api/captcha`);
}
