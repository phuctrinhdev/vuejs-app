import ViewModel from '../view-model.js'
import { CLIENTS_ENUMS } from '../../config/constant'


export default class RecommendationPointSetupViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      recommendation_point_setup_id: 0,
      status: CLIENTS_ENUMS.APPLY_RECOMMENDATION_POINT_TYPE.ON,
      recommender : 0,
      recommended_client : 0,
      shop_id: 0,
    }
  }
  mapFieldFromApi(api_data){
    if(api_data == null) return

    this.fields.recommendation_point_setup_id = api_data.recommendationPointSetupId
    this.fields.status                        = api_data.status
    this.fields.recommender                   = api_data.recommender
    this.fields.recommended_client            = api_data.recommendedClient
    this.fields.shop_id                       = api_data.shopId
  }
  mapFieldToApi(){
    return {
      recommendationPointSetupId: this.recommendation_point_setup_id,
      status                    : this.fields.status,
      recommender               : this.fields.recommender,
      recommendedClient         : this.fields.recommended_client,
      shopId                    : this.fields.shop_id
    }
  }
  
  getValidations(){
    let validations = {
      recommender: {
        label:'loyalty-points-setup.recommender',
        rules: {
          numeric: '',
          decimalLength: {
            decimal_value: 1
          },
          maxValue: {
            max_value: 9999999999.9
          },
          minValue: {
            min_value: 0
          }
        }
      },
      recommended_client: {
        label:'loyalty-points-setup.recommended-client',
        rules: {
          numeric: '',
          decimalLength: {
            decimal_value: 1
          },
          maxValue: {
            max_value: 9999999999.9
          },
          minValue: {
            min_value: 0
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