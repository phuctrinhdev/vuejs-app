// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { mapPagingFromApi }    from '../../helpers/common'
import SupplierViewModel       from '../../view-model/inventory/supplier/supplier-view-model.js'

const url_cmd  = getServiceUrl(SERVICE_TYPES.SUPPLIER_CMD, 1)
const url_read = getServiceUrl(SERVICE_TYPES.SUPPLIER_READ, 1)
const url_read_suppliers = url_read + '/List'

export default class SupplierApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  setResult(response, handleMapFieldsFromAPI) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if (response.data.isOK) {
      handleMapFieldsFromAPI()
    }
  }

  async getSuppliersAsync(query){
    let params = {
      status   : query.status,
      keywords : query.keywords,
      pageSize : query.page_size,
      pageNumber : query.page_number,
      shopId     : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_suppliers,params)
      this.setResult(response,()=>{
        let suppliers = []
        for(let item of response.data.result.items){
          let supplier = new SupplierViewModel()
          supplier.mapFieldsFromApi(item)
          suppliers.push(supplier)
        }
        this.result.data = {
          items      : suppliers,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addSupplierAsync(supplier_vm = new SupplierViewModel()){
    try{
      let model    = supplier_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd, model)
      this.setResult(response,()=>{
        let supplier = new SupplierViewModel()
        supplier.mapFieldsFromApi(response.data.result)
        this.result.data = supplier
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateSupplierAsync(supplier_vm = new SupplierViewModel()){
    try{
      let model    = supplier_vm.mapFieldsToApi()
      let response = await this.http.put(url_cmd, model)
      this.setResult(response,()=>{
        let supplier = new SupplierViewModel()
        supplier.mapFieldsFromApi(response.data.result)
        this.result.data = supplier
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
