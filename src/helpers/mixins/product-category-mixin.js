import { options } from '../../helpers/options'
import ProductCategoryApi from '../../api/goods/product-category-api'

export default {
  data() {
    return {
      product_category_api: new ProductCategoryApi()
    }
  },
  methods: {
    async getProductCategorysAsyncMixin(){
      let product_categorys_filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.all
      }

      let result = await this.product_category_api.getProductCategoriesAsync(product_categorys_filter)

      return result
    }
  }
}