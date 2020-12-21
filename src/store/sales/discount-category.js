import _ from 'lodash'
import DiscountCategoryViewModel  from '../../view-model/sales/discount-category-view-model'

const state_default = {
  discount_categorys: {
    items: [],
    pagination: {}
  },
  discount_category_action: {
    action: 0,
    data: new DiscountCategoryViewModel().fields
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getDiscountCategorys(state){
    return state.discount_categorys
  },
  getDiscountCategoryAction(state){
    return state.discount_category_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setDiscountCategorys(state, discount_categorys){
    state.discount_categorys = discount_categorys
  },
  setDiscountCategoryAction(state, discount_category_action){
    state.discount_category_action = discount_category_action
  },
  updateDiscountCategory(state, discount_category){
    for(let i in state.discount_categorys.items){
      if(state.discount_categorys.items[i].id == discount_category.id){
        state.discount_categorys.items[i] = Object.assign(state.discount_categorys.items[i], discount_category)
      }
    }
  },
  deleteDiscountCategory(state, discount_category){
    let index = _.findIndex(state.discount_categorys.items, ['id', discount_category.id])
    state.discount_categorys.items.splice(index, 1)
  },
}

// actions
const actions = {
  setDiscountCategorysData({commit}, discount_categorys){
    commit('setDiscountCategorys', discount_categorys)
  },
  setDiscountCategoryActionData({commit}, discount_category_action){
    commit('setDiscountCategoryAction', discount_category_action)
  },
  updateDiscountCategoryData({commit}, discount_category){
    commit('updateDiscountCategory', discount_category)
  },
  deleteDiscountCategoryData({commit}, discount_category){
    commit('deleteDiscountCategory', discount_category)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}