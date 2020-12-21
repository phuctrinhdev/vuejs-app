import ServiceCategoryApi from '../../api/goods/service-category-api'

const state_default = {
  service_categorys: {},
  service_category_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getServiceCategory(state){ 
    return state.service_categorys
  },
  getServiceCategoryAction(state) {
    return state.service_category_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setServiceCategory(state, service_categorys){  
    state.service_categorys = service_categorys
  },
  updateServiceCategory(state, service_category_edit){ 
    for(let key in state.service_categorys.data.items){
      if(state.service_categorys.data.items[key].id == service_category_edit.id){
        state.service_categorys.data.items[key] = Object.assign(state.service_categorys.data.items[key], service_category_edit)
      }
    }
  },
  setServiceCategoryAction(state, service_category_action){
    state.service_category_action = service_category_action
  },
}

// actions
const actions = {
  async getServiceCategoryDataAsync({commit}, filter){
    try {
      let service_category_api = new ServiceCategoryApi()
      let result = await service_category_api.getServiceCategoryAsync(filter)
      
      commit('setServiceCategory', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateServiceCategoryData({commit}, service_category){
    commit('updateServiceCategory', service_category)
  },
  setServiceCategoryActionData({commit}, service_category_action){
    commit('setServiceCategoryAction', service_category_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
