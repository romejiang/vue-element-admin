
import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { isElectron } from '@/utils/electron'

// import { getToken } from './cookie'

const config = {
  baseURL: process.env.VUE_APP_BASE_API // 配置API接口地址
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
}

axios.defaults.withCredentials = true;

const service = axios.create(config)
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    // console.log("response");
    // console.log(res);
    // return response
    if (res.code !== 0) {
      const errInfo = res.detail
        ? res.detail
          .map(v => {
            return "<br>" + v.field + " " + v.message;
          })
          .join("")
        : "";

      Notification({
        type: 'error',
        title: '服务器提示',
        dangerouslyUseHTMLString: true,
        message: res.error + errInfo
      });
      //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //     // to re-login
      //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //       confirmButtonText: 'Re-Login',
      //       cancelButtonText: 'Cancel',
      //       type: 'warning'
      //     }).then(() => {
      //       store.dispatch('user/resetToken').then(() => {
      //         location.reload()
      //       })
      //     })
      //   }
      //   return Promise.reject(new Error(res.message || 'Error'))
    }
    return response
  },
  (error) => {
    if (error.response.status === 401 && isElectron()) {
      store.dispatch('user/refresh').then((data) => {
        // location.href = '/'
        location.reload()
        // console.log(data);
      })
    } else {
      Notification({
        type: 'error',
        title: '网络错误',
        message: error.message || '网络错误，请稍后再试'
      });
      // location.reload()
    }
    return Promise.reject(error)
  }
)

export default service
