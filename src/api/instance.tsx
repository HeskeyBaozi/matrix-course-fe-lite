import axios, { AxiosResponse } from 'axios';
import { notification } from 'antd';
import React from 'react';




export const xios = axios.create({
    timeout: 5000
});

xios.interceptors.response.use(
    response => response,
    (error): Promise<never | AxiosResponse<any>> => {
        const { request, response, config, code } = error;
        const message = <span><strong>{(config.method as string).toUpperCase()}</strong> {config.url}</span>

        // Timeout
        if (code && code === 'ECONNABORTED') {
            notification.error({
                message,
                description: '请求超时'
            });
            return Promise.reject(error);
        }

        notification.error({
            message,
            description: response && response.data && response.data.msg || `请求错误`
        });
        return Promise.resolve<AxiosResponse<any>>(response);
    }
);

