import ViewModel                from './../../view-model.js'
import ReceivingItemViewModel   from './receiving-item-view-model.js'
import _                        from 'lodash'
import i18n                     from '../../../translate/translate.js'
import {
  guid,
  convertTimeStampToDate,
  convertDateToTimeStamp}       from '../../../helpers/common.js'

export default class ReceivingViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      receiving_id      : 0,
      quantity          : 0, // total quantity of ReceivingItem
      amount            : 0, // total amount of ReceivingItem
      supplier_id       : 0,
      supplier_name     : '',
      receiving_date_ts : 0,
      notes             : '',
      user_id           : '',
      user_name         : '',
      shop_id           : 0,
      items             : [] // ReceivingItems
    }
  }

  // Mapper
  mapFieldsFromApi(data){
    if(!data.userName)
      data.userName = data.username
    this.fields.receiving_id      = data.receivingId
    this.fields.quantity          = data.quantity
    this.fields.amount            = data.amount
    this.fields.supplier_id       = data.supplierId
    this.fields.receiving_date_ts = data.receivingDateTS
    this.fields.notes             = data.notes
    this.fields.user_id           = data.userId
    this.fields.user_name         = data.userName
    this.fields.shop_id           = data.shopId
    this.fields.supplier_name     = data.supplierName

    if (data.items){
      for(let i in data.items){
        let tmp_receiving_item = new ReceivingItemViewModel()
        tmp_receiving_item.mapFieldsFromApi(data.items[i])
        tmp_receiving_item.shop_id      = data.shopId
        tmp_receiving_item.receiving_id = data.receivingId
        this.fields.items.push(tmp_receiving_item)
      }
    }
    if (!data.amount)   this.fields.amount   = _.sumBy(this.fields.items,x=>x.amount)
    if (!data.quantity) this.fields.quantity = _.sumBy(this.fields.items,x=>x.quantity)

  }
  mapFieldsFromUpdateReceivingApi(data){
    if(!data.userName)
      data.userName = data.username
    this.fields.supplier_id       = data.supplierId
    this.fields.receiving_date_ts = data.receivingDateTS
    this.fields.notes             = data.notes
    this.fields.user_id           = data.userId
    this.fields.user_name         = data.userName
    this.fields.shop_id           = data.shopId
  }
  mapFieldsToAddReceivingApi(){
    let model = {
      receivingId     : 0,
      supplierId      : this.fields.supplier_id,
      receivingDateTS : this.fields.receiving_date_ts,
      notes           : this.fields.notes,
      userId          : this.fields.user_id,
      userName        : this.fields.user_name,
      username        : this.fields.user_name,
      shopId          : this.fields.shop_id,
      items           : []
    }
    if(this.fields.items){
      for(let receiving_item of this.fields.items){
        let tmp_receiving_item = {
          receivingItemId: 0,
          productId           : receiving_item.product_id,
          productCode         : receiving_item.product_code,
          productName         : receiving_item.product_name,
          spec                : receiving_item.spec,
          productCategoryId   : receiving_item.product_category_id,
          productCategoryName : receiving_item.product_category_name,
          unitPrice           : receiving_item.unit_price,
          quantity            : receiving_item.quantity,
          amount              : receiving_item.amount
        }
        model.items.push(tmp_receiving_item)
      }
    }
    return model
  }
  mapFieldsToUpdateReceivingApi(){
    return {
      receivingId     : this.fields.receiving_id,
      supplierId      : this.fields.supplier_id,
      receivingDateTS : this.fields.receiving_date_ts,
      notes           : this.fields.notes,
      userId          : this.fields.user_id,
      userName        : this.fields.user_name,
      username        : this.fields.user_name,
      shopId          : this.fields.shop_id
    }
  }
  mapFieldsToAddReceivingItemsApi(){
    let model = {
      receivingId : this.fields.receiving_id,
      userId      : this.fields.user_id,
      userName    : this.fields.user_name,
      username    : this.fields.user_name,
      shopId      : this.fields.shop_id,
      items       : []
    }
    if(this.fields.items){
      for(let receiving_item of this.fields.items){
        let tmp_receiving_item = {
          receivingItemId     : 0,
          productId           : receiving_item.product_id,
          productCode         : receiving_item.product_code,
          productName         : receiving_item.product_name,
          spec                : receiving_item.spec,
          productCategoryId   : receiving_item.product_category_id,
          productCategoryName : receiving_item.product_category_name,
          unitPrice           : receiving_item.unit_price,
          quantity            : receiving_item.quantity,
          amount              : receiving_item.amount
        }
        model.items.push(tmp_receiving_item)
      }
    }
    return model
  }

  // ReceivingItem
  addReceivingItems(receiving_items){
    if(receiving_items){
      for(let receiving_item of receiving_items){
        receiving_item.receiving_item_guid_id = guid()
        this.fields.items.push(receiving_item)
      }
      this.refreshAmount()
      this.refreshQuantity()
    }
  }
  deleteReceivingItem(product_id){
    if(product_id){
      let index = this.fields.items.findIndex(x=>x.product_id == product_id)
      if( index != -1){
        this.fields.items.splice(index,1)
      }
      this.refreshAmount()
      this.refreshQuantity()
    }
  }
  updateReceivingItem(receiving_item){
    if(receiving_item){
      let index = this.fields.items.findIndex(x=>x.receiving_item_guid_id == receiving_item.receiving_item_guid_id)
      if( index != -1){
        this.fields.items.splice(index,1,receiving_item)
      }
      this.refreshAmount()
      this.refreshQuantity()
    }
  }

  // Getters
  get shop_id(){
    return this.fields.shop_id
  }
  get receiving_id(){
    return this.fields.receiving_id
  }
  get receiving_date_ts(){
    return this.fields.receiving_date_ts
  }
  get receiving_date(){
    return convertTimeStampToDate(this.fields.receiving_date_ts,false)
  }
  get supplier_name(){
    return this.fields.supplier_name
  }
  get supplier_id(){
    return this.fields.supplier_id
  }
  get quantity(){
    return this.fields.quantity
  }
  get amount(){
    return this.fields.amount
  }
  get notes(){
    return this.fields.notes
  }
  get receiving_items(){
    return this.fields.items
  }

  // Setters
  set supplier_name(value){
    this.fields.supplier_name = value
  }
  set supplier_id(value){
    this.fields.supplier_id = Number(value)
  }
  set notes(value){
    this.fields.notes = value
  }
  set user_id(value){
    this.fields.user_id = Number(value)
  }
  set user_name(value){
    this.fields.user_name = value
  }
  set shop_id(value){
    this.fields.shop_id = Number(value)
  }
  set receiving_date_ts(value){
    if(typeof value === 'object'){
      this.fields.receiving_date_ts = convertDateToTimeStamp(value,true,false)
    }else if(typeof value === 'number' || typeof value === 'string'){
      this.fields.receiving_date_ts = Number(value)
    }
  }
  set receiving_items(value){
    this.fields.items = value
  }

  // functions
  refreshAmount(){
    if(this.fields.items){
      this.fields.amount = _.sumBy(this.fields.items,x=>x.amount)
    }
  }
  refreshQuantity(){
    if(this.fields.items){
      this.fields.quantity = _.sumBy(this.fields.items,x=>x.quantity)
    }
  }

  // Validation
  isDeletingItemValid(){
    let errors = []
    if (this.fields.items.length == 1){
      errors.push(i18n.t('receivings.receiving-item-cannot-empty'))
    }
    return errors
  }
  isValid(){
    let errors = []
    let validation_rules = {
      notes: {
        rules: {
          maxLength: {
            max_value: 500
          }
        }
      },
      supplier_id : {
        label : '',
        rules : {
          customRule : {
            message : 'receivings.supplier-cannot-empty',
            process(model){
              if(!Number(model.supplier_id) > 0){
                return false
              }
              return true
            }
          }
        }
      }
    }
    if(this.fields.items.length == 0){
      errors.push(i18n.t('receivings.receiving-item-cannot-empty'))
    }
    else{
      let receiving_item_errors = []
      for(let item of this.fields.items){
        let error = item.isValid()
        receiving_item_errors = receiving_item_errors.concat(error)
      }
      errors = errors.concat(_.uniq(receiving_item_errors))
    }

    errors = [...super.isValid(validation_rules), ...errors]
    return errors
  }
}
