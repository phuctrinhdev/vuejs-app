import StockDecreaseViewModel from '../../../../src/view-model/inventory/stock-status/stock-decrease-view-model'
// import TestHelper from '../../../helpers/tests-helper'
import { inventory_options } from '../../../../src/helpers/options/inventory-options'

let stock_decrease_vm = {}
beforeEach(() => {
  stock_decrease_vm = new StockDecreaseViewModel()
  stock_decrease_vm.setFields({
    product_id    : 1,
    product_code  : 'product_code',
    product_name  : 'product_name',
    quantity      : 1,
    action_reason : inventory_options.action_reason_for_decrease_stock.damaged,
    notes         : 'notes',
    user_id       : 'user_id',
    user_name     : 'user_name',
    shop_id       : 1
  })
})

describe('stock-decrease-view-model.js', () => {
  // quantity
  it('quantity is null, false', () => {
    stock_decrease_vm.fields.quantity = null
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('quantity is undefined, false', () => {
    stock_decrease_vm.fields.quantity = undefined
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('quantity is empty, false', () => {
    stock_decrease_vm.fields.quantity = ''
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // action_reason
  it('action_reason is null, false', () => {
    stock_decrease_vm.fields.action_reason = null
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('action_reason is undefined, false', () => {
    stock_decrease_vm.fields.action_reason = undefined
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('action_reason is empty, false', () => {
    stock_decrease_vm.fields.action_reason = ''
    let errors = stock_decrease_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // mapFields
  it('mapFieldsFromApi, true', () => {
    let api_data = {
      productId     : 2,
      productCode   : 'productCode',
      productName   : 'productName',
      quantity      : 2,
      actionReason  : 2,
      notes         : 'notes',
      userId        : 'userId',
      username      : 'username',
      shopId        : 1
    }
    stock_decrease_vm.mapFieldsFromApi(api_data)
    
    let error_counting = 0
    if(stock_decrease_vm.fields.product_id    != 2
    || stock_decrease_vm.fields.product_code  != 'productCode'
    || stock_decrease_vm.fields.product_name  != 'productName'
    || stock_decrease_vm.fields.quantity      != 2
    || stock_decrease_vm.fields.action_reason != 2
    || stock_decrease_vm.fields.notes         != 'notes'
    || stock_decrease_vm.fields.user_id       != 'userId'
    || stock_decrease_vm.fields.user_name     != 'username'
    || stock_decrease_vm.fields.shop_id       != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
  it('mapFieldsToApi, true', () => {
    let api_data = stock_decrease_vm.mapFieldsToApi()
    
    let error_counting = 0
    if(api_data.productId    != 1
    || api_data.productCode  != 'product_code'
    || api_data.productName  != 'product_name'
    || api_data.quantity     != 1
    || api_data.actionReason != inventory_options.action_reason_for_decrease_stock.damaged
    || api_data.notes        != 'notes'
    || api_data.userId       != 'user_id'
    || api_data.username     != 'user_name'
    || api_data.shopId       != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
  it('mapFieldsFromProduct, true', () => {
    let product_data = {
      id  : 1,
      code: 'product_code',
      name: 'product_name'
    }
    stock_decrease_vm.mapFieldsFromProduct(product_data)
    
    let error_counting = 0
    if(stock_decrease_vm.fields.product_id    != 1
    || stock_decrease_vm.fields.product_code  != 'product_code'
    || stock_decrease_vm.fields.product_name  != 'product_name'){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})