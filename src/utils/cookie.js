// 写 cookies
export const setCookie = function(name, value, time) {
  if (time) {
    // const strsec = getsec(time)
    const exp = new Date()
    exp.setTime(exp.getTime() + parseInt(time))
    document.cookie =
      name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  } else {
    document.cookie = name + '=' + escape(value)
  }
}

// 读 cookies
export const getCookie = function(name) {
  const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

// 删 cookies
export const delCookie = function(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 获取Token
export const getToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    return window.sessionStorage.Bearer
  } else if (window.localStorage && window.localStorage.Bearer) {
    return window.localStorage.Bearer
  } else if (window.document.cookie) {
    return getCookie('Bearer')
  }
}

// 设置Token
export const setToken = function(token, rememberTime) {
  if (window.sessionStorage) {
    window.sessionStorage.Bearer = token
  }

  if ((window.localStorage) || !window.sessionStorage) {
    window.localStorage.Bearer = token
  }

  if (
    window.document.cookie &&
    !window.sessionStorage &&
    !window.localStorage
  ) {
    if (rememberTime) {
      setCookie('Bearer', token, rememberTime)
    } else {
      setCookie('Bearer', token)
    }
  }
}

// 删除Token
export const removeToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    window.sessionStorage.removeItem('Bearer')
  }

  if (window.localStorage && window.localStorage.Bearer) {
    window.localStorage.removeItem('Bearer')
  }

  if (window.document.cookie) {
    delCookie('Bearer')
  }
}
