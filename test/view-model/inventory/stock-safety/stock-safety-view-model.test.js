import StockSafetyViewModel from '../../../../src/view-model/inventory/stock-safety/stock-safety-view-model'
// import TestHelper from '../../../helpers/tests-helper'
// import { inventory_options } from '../../../../src/helpers/options/inventory-options'

let stock_safety_vm = {}
beforeEach(() => {
  stock_safety_vm = new StockSafetyViewModel()
  stock_safety_vm.setFields({
    product_id    : 1,
    product_code  : 'product_code',
    product_name  : 'product_name',
    stock_safety  : 10,
    shop_id       : 1
  })
})

describe('stock-safety-view-model.js', () => {
  // stock_safety
  it('stock_safety is null, true', () => {
    stock_safety_vm.fields.stock_safety = null // not process in customRule
    let errors = stock_safety_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('stock_safety is undefined, true', () => {
    stock_safety_vm.fields.stock_safety = undefined // not process in customRule
    let errors = stock_safety_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('stock_safety is empty, true', () => {
    stock_safety_vm.fields.stock_safety = '' // not process in customRule
    let errors = stock_safety_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('stock_safety has 6 characters, true', () => {
    stock_safety_vm.fields.stock_safety = 123456
    let errors = stock_safety_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('stock_safety has more than 6 characters, false', () => {
    stock_safety_vm.fields.stock_safety = 1234567
    let errors = stock_safety_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // mapFields
  it('mapFieldsFromApi, true', () => {
    let api_data = {
      productId     : 1,
      productCode   : 'productCode',
      productName   : 'productName',
      safetyStock   : 10,
      shopId        : 1,
    }
    stock_safety_vm.mapFieldsFromApi(api_data)
    
    let error_counting = 0
    if(stock_safety_vm.fields.product_id    != 1
    || stock_safety_vm.fields.product_code  != 'productCode'
    || stock_safety_vm.fields.product_name  != 'productName'
    || stock_safety_vm.fields.stock_safety  != 10
    || stock_safety_vm.fields.shop_id       != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
  it('mapFieldsToApi, true', () => {
    let api_data = stock_safety_vm.mapFieldsToApi()
    
    let error_counting = 0
    if(api_data.productId    != 1
    || api_data.productCode  != 'product_code'
    || api_data.productName  != 'product_name'
    || api_data.safetyStock  != 10
    || api_data.shopId       != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})