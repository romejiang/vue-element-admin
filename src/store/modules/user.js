import { login, logout, getInfo, refresh } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/cookie'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  apikey: '',
  name: '',
  avatar: '',
  email: '',
  vcode: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_APIKEY: (state, apikey) => {
    state.apikey = apikey
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_VCODE: (state, vcode) => {
    state.vcode = vcode
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: username.trim(), password: password }).then(response => {
        if (response.data && response.data.code === 0) {
          const { data } = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { role, mobile, realName, avatar, _id, email, vcode } = data

        // roles must be a non-empty array
        if (!role) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', [role.access])
        commit('SET_NAME', mobile)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', realName)
        commit('SET_APIKEY', _id)
        commit('SET_EMAIL', email)
        commit('SET_VCODE', vcode)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ dispatch, commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        dispatch('server/setStatus', false, { root: true })
          .then(status => {

          })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  // changeRoles({ commit, dispatch }, role) {
  //   return new Promise(async resolve => {
  //     const token = role + '-token'

  //     commit('SET_TOKEN', token)
  //     setToken(token)

  //     const { roles } = await dispatch('getInfo')

  //     resetRouter()

  //     // generate accessible routes map based on roles
  //     const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

  //     // dynamically add accessible routes
  //     router.addRoutes(accessRoutes)

  //     // reset visited views and cached views
  //     dispatch('tagsView/delAllViews', null, { root: true })

  //     resolve()
  //   })
  // },

  refresh({ commit }) {
    return new Promise((resolve, reject) => {
      refresh().then(response => {
        if (response.data && response.data.code === 0) {
          const { data } = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        } else {
          reject(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
