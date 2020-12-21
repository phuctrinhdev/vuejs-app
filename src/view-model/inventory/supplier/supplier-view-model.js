import ViewModel             from './../../view-model.js'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
export default class SupplierViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      supplier_id    : 0, // this field will be have data when sucessfully adding.
      supplier_name  : '',
      representative : '',
      phone_number   : '',
      mobile_number  : '',
      fax            : '',
      email          : '',
      notes          : '',
      active         : 0,
      shop_id        : 0
    }
  }

  // functions
  isSupplierInActive(){
    return this.fields.active == inventory_options.supplier_status_enum.in_active
  }

  // Mapping
  mapFieldsFromApi(data){
    this.fields.supplier_id    = data.supplierId
    this.fields.supplier_name  = data.supplierName
    this.fields.representative = data.representative
    this.fields.phone_number   = data.phoneNumber
    this.fields.mobile_number  = data.mobileNumber
    this.fields.fax            = data.fax
    this.fields.email          = data.email
    this.fields.notes          = data.notes
    this.fields.active         = data.active
    this.fields.shop_id        = data.shopId
  }
  mapFieldsToApi(){
    return {
      supplierId     : this.fields.supplier_id,
      supplierName   : this.fields.supplier_name,
      representative : this.fields.representative,
      phoneNumber    : this.fields.phone_number,
      mobileNumber   : this.fields.mobile_number,
      fax            : this.fields.fax,
      email          : this.fields.email,
      notes          : this.fields.notes,
      active         : this.fields.active,
      shopId         : this.fields.shop_id,
    }
  }

  // Setters
  set supplier_id(value){
    this.fields.supplier_id = value
  }
  set supplier_name(value){
    this.fields.supplier_name = value
  }
  set representative(value){
    this.fields.representative = value
  }
  set phone_number(value){
    this.fields.phone_number = value
  }
  set mobile_number(value){
    this.fields.mobile_number = value
  }
  set fax(value){
    this.fields.fax = value
  }
  set email(value){
    this.fields.email = value
  }
  set notes(value){
    this.fields.notes = value
  }
  set active(value){
    this.fields.active = value
  }
  set shop_id(value){
    this.fields.shop_id = value
  }

  // Getters
  get supplier_id(){
    return this.fields.supplier_id
  }
  get supplier_name(){
    return this.fields.supplier_name
  }
  get representative(){
    return this.fields.representative
  }
  get phone_number(){
    return this.fields.phone_number
  }
  get mobile_number(){
    return this.fields.mobile_number
  }
  get fax(){
    return this.fields.fax
  }
  get email(){
    return this.fields.email
  }
  get notes(){
    return this.fields.notes
  }
  get active(){
    return this.fields.active
  }
  get shop_id(){
    return this.fields.shop_id
  }

  isValid(){
    let validations = {
      supplier_name : {
        rules : {
          require: '',
          maxLength: {
            max_value: 40
          }
        }
      },
      representative : {
        rules : {
          maxLength: {
            max_value: 40
          }
        }
      },
      mobile_number : {
        rules : {
          numeric: '',
          maxLength: {
            max_value: 12
          }
        }
      },
      phone_number : {
        rules : {
          numeric: '',
          maxLength: {
            max_value: 20
          }
        }
      },
      fax : {
        rules : {
          maxLength: {
            max_value: 20
          }
        }
      },
      notes: {
        rules: {
          maxLength: {
            max_value: 500
          }
        }
      },
      email: {
        rules: {
          email: '',
          maxLength: {
            max_value: 40
          }
        }
      }
    }
    return super.isValid(validations)
  }
}
