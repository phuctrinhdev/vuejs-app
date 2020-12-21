import StockAdjustmentViewModel from '../../../../src/view-model/inventory/stock-adjustment/stock-adjustment-view-model'
import TestHelper from '../../../helpers/tests-helper'

let stock_adjustment_vm = {}
beforeEach(() => {
  stock_adjustment_vm = new StockAdjustmentViewModel()
  stock_adjustment_vm.setFields({
    items         : [],
    notes         : 'notes',
    user_id       : 'user_id',
    user_name     : 'user_name',
    shop_id       : 1
  })
  stock_adjustment_vm.fields.items.push({
    product_id  : 1,
    product_code: 'product_code',
    product_name: 'product_name',
    stock_before: 20,
    stock_after : 10,
  })
})

describe('stock-safety-view-model.js', () => {
  // notes
  it('notes is null, true', () => {
    stock_adjustment_vm.fields.notes = null
    let errors = stock_adjustment_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is undefined, true', () => {
    stock_adjustment_vm.fields.notes = undefined
    let errors = stock_adjustment_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is empty, true', () => {
    stock_adjustment_vm.fields.notes = ''
    let errors = stock_adjustment_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has 100 characters, true', () => {
    stock_adjustment_vm.fields.notes = TestHelper.generateMaxLength(100,'a')
    let errors = stock_adjustment_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has more than 100 characters, false', () => {
    stock_adjustment_vm.fields.notes = TestHelper.generateMaxLength(101,'a')
    let errors = stock_adjustment_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // mapFields
  it('mapFieldsFromProducts, true', () => {
    let products_data = [{
      id          : 1,
      code        : 'product_code',
      name        : 'product_name',
      stock_before: 20,
      stock_after : 10,
    }]
    stock_adjustment_vm.mapFieldsFromProducts(products_data)
    
    let error_counting = 0
    if(stock_adjustment_vm.fields.items[0].product_id   != 1
    || stock_adjustment_vm.fields.items[0].product_code != 'product_code'
    || stock_adjustment_vm.fields.items[0].product_name != 'product_name'
    || stock_adjustment_vm.fields.items[0].stock_before != 20
    || stock_adjustment_vm.fields.items[0].stock_after  != 10){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
  it('mapFieldsToApi, true', () => {
    let api_data = stock_adjustment_vm.mapFieldsToApi()
    
    let error_counting = 0
    if(api_data.items[0].productId  != 1
    || api_data.items[0].productCode!= 'product_code'
    || api_data.items[0].productName!= 'product_name'
    || api_data.items[0].stockBefore!= 20
    || api_data.items[0].stockAfter != 10
    || api_data.notes               != 'notes'
    || api_data.userId              != 'user_id'
    || api_data.userName            != 'user_name'
    || api_data.shopId              != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})