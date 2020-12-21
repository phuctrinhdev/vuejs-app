import ViewModel from '../view-model.js'
import { USAGE_STATUS, GOODS_STATUS } from '../../config/constant'


export default class ProductViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id                    : 0,
      code                  : '',
      name                  : '',
      product_category_id   : '',
      product_category_name : '',
      bar_code              : '',
      specification         : '',
      supplier_price        : '',
      retail_price          : '',
      usage                 : USAGE_STATUS.SALES_AND_INTERNAL_USE,
      stock_safety          : 0,
      stock_on_hand         : 0,
      notes                 : '',
      status                : GOODS_STATUS.ACTIVE,
    }
  }
  getValidations(){
    let validations = {
      code: {
        label: 'products.product-code',
        rules: {
          require: '',
          maxLength: {
            max_value:30
          }
        }
      },
      name: {
        label: 'products.product-name',
        rules: {
          require: '',
          maxLength: {
            max_value:50
          }
        }
      },
      product_category_id: {
        label: 'products.category',
        rules: {
          require: ''
        }
      },
      bar_code: {
        label: 'products.bar-code',
        rules: {
          maxLength: {
            max_value:50
          }
        }
      },
      specification: {
        label: 'products.specification',
        rules: {
          maxLength: {
            max_value:50
          }
        }
      },
      supplier_price: {
        label: 'products.supplier-price',
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },
      retail_price: {
        label: 'products.retail-price',
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },
      stock_safety: {
        label: 'products.safety-stock',
        rules: {
          numeric: '',
          maxLength: {
            max_value: 6
          }
        }
      },
      usage: {
        label: 'products.usage',
        rules: {
          require: {
            message: 'validate_messages.usage'
          }
        }
      },
      notes: {
        label: 'products.notes',
        rules: {
          maxLength: {
            max_value:200
          }
        }
      },
    }
    
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}