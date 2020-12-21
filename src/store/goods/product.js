import ProductApi from '../../api/goods/product-api'

const state_default = {
  products: {},
  product_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getProducts(state){
    return state.products
  },
  getProductAction(state){
    return state.product_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setProducts(state, products){
    state.products = products
  },
  setProductAction(state, product_action){
    state.product_action = product_action
  },
  updateProduct(state, product){
    for(let key in state.products.data.items){
      if(state.products.data.items[key].id == product.id){
        state.products.data.items[key] = Object.assign(state.products.data.items[key], product)
      }
    }
  }
}

// actions
const actions = {
  async getProductsDataAsync({commit}, filter){
    try {
      let product_api = new ProductApi()
      let result = await product_api.getProductsAsync(filter)
      
      commit('setProducts', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setProductActionData({commit}, product_action){
    commit('setProductAction', product_action)
  },
  updateProductData({commit}, product){
    commit('updateProduct', product)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
