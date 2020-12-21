import ProductCategoryApi from '../../api/goods/product-category-api'

const state_default = {
  product_categories: {},
  product_category_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getProductCategories(state){
    return state.product_categories
  },
  getProductCategoryAction(state) {
    return state.product_category_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setProductCategories(state, product_categories){
    state.product_categories = product_categories
  },
  setProductCategoryAction(state, product_category_action){
    state.product_category_action = product_category_action
  },
  updateProductCategory(state, product_category_edit){
    for(let key in state.product_categories.data.items){
      if(state.product_categories.data.items[key].id == product_category_edit.id){
        state.product_categories.data.items[key] = Object.assign(state.product_categories.data.items[key], product_category_edit)
      }
    }
  },
}

// actions
const actions = {
  async getProductCategoriesDataAsync({commit}, filter){
    try {
      let product_category_api = new ProductCategoryApi()
      let result = await product_category_api.getProductCategoriesAsync(filter)
      commit('setProductCategories', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setProductCategoryActionData({commit}, product_category_action){
    commit('setProductCategoryAction', product_category_action)
  },
  updateProductCategoriesData({commit}, product_category){
    commit('updateProductCategory', product_category)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
