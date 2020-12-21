import UserApi from '../../api/user/user-api'
import store from '../store'
import { options } from '../../helpers/options'
import { guid } from '../../helpers/common'

const SAVE_NAMES ={
  CURRENT_USER :'currentUser',
  REMEMBER_ID : 'id'
}
const shop_locations =[
  {country_code:'',   shop_location:'' },
  {country_code:'KR', shop_location: 'kr-ko' },
  {country_code:'VN', shop_location: 'vi-vn' }
]
export function getShopLocation (country) {
  const c = shop_locations.find(x => x.country_code == country)
  const r = (c) ? c.shop_location : ''
  return r
}

const state_default = {
  user: {
    user_id             : 1, // aha-soft
    user_name           : 'Aha-Soft',
    user_full_name      : 'Aha-Soft Dev',
    user_role_code      : 'MASTER',
    shop_user_role_code : '',
    role                : options.user_roles.chain_head,
    language            : 'en',
    api_token           : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJDb3VudHJ5Q29kZSI6IlZOIiwiVXNlcklEIjoidGVzdHNob3AwMDEiLCJOYW1lIjoidGVzdHNob3AwMDEiLCJyb2xlIjoiTUFTVEVSIiwiU29sdXRpb25JZCI6IjMwMDIiLCJTaG9wSWQiOiI2MDAwMDgiLCJVc2VyQWNjb3VudElkIjoiMTIiLCJuYmYiOjE1ODY0ODg4OTIsImV4cCI6MTYxODAyNDg5MiwiaWF0IjoxNTg2NDg4ODkyfQ.18rBqSgzQAL_WLNKHqMjwyjTz6HqzHiwwtxC2NMYrSE',
    session_token       : guid()
  },
  shop: {
    shop_id   : 51,
    shop_name : '',
    chain_id  : 0,
    chain_sharing_settings: {
      share_client                : false,
      share_service               : false,
      share_product               : false,
      use_other_shop_prepaidgoods : false,
      allow_shop_service          : false,
      allow_shop_product          : false,
    },
    shared            : true,
    solution_id       : 3002,
    business_type_code: 'BS_SKC',
    service_type_code : 'SV_PRO',
    country           : 'VN',
    timezone          : '+09:00',
    format_date       : options.standard_date_format.ymd,
    shop_location     : 'vi-VN',
    netmoney_balance  : 0,
    phone_number      : ''
  },
  logged_in : null,
  id        :''
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getUser(state) {
    reloadIfNeeds(state)
    return state.user
  },
  getShop(state) {
    reloadIfNeeds(state)
    return state.shop
  },
  getLoggedIn(state) {
    reloadIfNeeds(state)
    return ( state.logged_in == true)
  },
  getRememberId(state){
    const user_id = localStorage.getItem(SAVE_NAMES.REMEMBER_ID)
    if (state.id != user_id) state.id = user_id
    return state.id
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setUser(state, user){
    state.user = {
      user_id             : user.user_auth_info.user_id,
      user_name           : user.user_auth_info.user_name,
      user_full_name      : user.user_auth_info.user_full_name,
      user_role_code      : user.user_auth_info.user_role_code,
      shop_user_role_code : user.user_auth_info.shop_user_role_code,
      role                : options.user_roles.chain_head,
      language            : user.user_auth_info.language,
      api_token           : user.user_auth_info.api_token,
      session_token       : guid(),
    }
    state.shop = {
      shop_id                       : user.shop_basic_info.shop_id,
      shop_name                     : user.shop_basic_info.shop_name,
      branch_number                 : user.shop_basic_info.branch_number,
      chain_id                      : user.shop_basic_info.chain_id,
      chain_sharing_settings: {
        share_client                : user.shop_basic_info.share_client,
        share_service               : user.shop_basic_info.share_service,
        share_product               : user.shop_basic_info.share_product,
        use_other_shop_prepaidgoods : user.shop_basic_info.use_other_shop_prepaidgoods,
        allow_shop_service          : user.shop_basic_info.allow_shop_service,
        allow_shop_product          : user.shop_basic_info.allow_shop_product
      },
      share             : true,
      solution_id       : user.user_auth_info.solution_id,
      business_type_code: user.shop_basic_info.business_type_code,//'BS_SKC',
      service_type_code : user.shop_basic_info.service_type_code,//'SV_PRO'
      country           : user.user_auth_info.country,
      timezone          : user.user_auth_info.timezone,
      format_date       : user.user_auth_info.format_date,
      shop_location     : getShopLocation(user.user_auth_info.country), //'vi-VN',
      netmoney_balance  : user.shop_basic_info.netmoney_balance,
      phone_number        : user.shop_basic_info.phone_number
    }
    state.logged_in= true
    const data = {user: state.user, shop:state.shop}
    sessionStorage.setItem(SAVE_NAMES.CURRENT_USER, JSON.stringify(data))
  },
  setUserFromUpdateShopInfo(state, user){
    state.user = user.user_auth_info,
    state.shop = user.shop_basic_info
    state.logged_in= true
    const data = {user: state.user, shop:state.shop}
    sessionStorage.setItem(SAVE_NAMES.CURRENT_USER, JSON.stringify(data))
  },
  setLogout(state){
    sessionStorage.removeItem(SAVE_NAMES.CURRENT_USER)  
    initState(state)
  },
  setRememberId(state, user_id){
    if (user_id != '') localStorage.setItem(SAVE_NAMES.REMEMBER_ID, user_id)
    else localStorage.removeItem( SAVE_NAMES.REMEMBER_ID )
    state.id = user_id
  },
  setShop(state, shop_id){
    state.shop.shop_id = shop_id
  },
}

// actions
const actions = {
  setUserData({dispatch, commit}, user_data){
    dispatch('resetStoreData')
    commit('setUser', user_data)
  },
  setShopData({dispatch,commit}, shop_id){
    dispatch('resetStoreData')
    commit('setShop', shop_id)
  },
  resetStoreData({commit}){
    let modules = Object.keys(store.state)
    for(let i in modules){
      commit(modules[i] + '/resetState', null, { root:true })
    }
  },
  async getUserDataAsync({commit}, query){
    try {
      let user_api = new UserApi()
      let result = await user_api.getUserAsync(query)
      if (result.is_ok) {
        commit('setUser', result.data)
      }
      return result
    }
    catch(e){
      return this.http.loadError(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}

function reloadIfNeeds(state) {
  if (state.logged_in == null ){
    let data= JSON.parse(sessionStorage.getItem( SAVE_NAMES.CURRENT_USER))    
    if(data != null) {
      restoreUserState(state,data)
    } 
    else {
      initState(state)
    }
  }
}

function restoreUserState(state, data){
  state.user      = data.user
  state.shop      = data.shop
  state.logged_in = true
}

function initState(state){
  state.user      = Object.assign({}, state_default.user)
  state.shop      = Object.assign({}, state_default.shop)
  state.logged_in = null
}