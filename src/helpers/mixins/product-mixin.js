import ProductApi from '../../api/goods/product-api'

export default {
  data() {
    return {
      product_api: new ProductApi()
    }
  },
  methods: {
    async getProductsAsyncMixin(filter){
      let result = await this.product_api.getProductsAsync(filter)
      return result
    },
    async getProductsWithStockAsyncMixin(filter){
      let result = await this.product_api.getProductsWithStockAsync(filter)
      return result
    },
    async getProductsWithStockAndTotalValuationAsyncMixin(filter){
      let result = await this.product_api.getProductsWithStockAndTotalValuationAsync(filter)
      return result
    }
  }
}