import ReceivingViewModel from '../../../../src/view-model/inventory/receivings/receiving-view-model'
import ReceivingItemViewModel from '../../../../src/view-model/inventory/receivings/receiving-item-view-model'
import TestHelper from '../../../helpers/tests-helper'

let receiving_vm = {}
let api_data = {}
let error_counting = 0
beforeEach(() => {
  receiving_vm = new ReceivingViewModel()
  receiving_vm.setFields({
    receiving_id      : 1,
    quantity          : 2,
    amount            : 20000,
    items             : [],
    supplier_id       : 1,
    supplier_name     : 'supplier_name',
    notes             : 'notes',
    receiving_date_ts : 0,
    user_id           : 1,
    user_name         : 'user_name',
    shop_id           : 1
  })
  let receiving_item_vm = new ReceivingItemViewModel()
  receiving_item_vm.setFields({
    receiving_id           : 1,
    receiving_item_id      : 1,
    receiving_item_guid_id : 'aaa', // This field used to add the sames product_id
    product_id             : 1,
    product_code           : 'p001',
    product_name           : 'product_name',
    spec                   : '',
    product_category_id    : 1,
    product_category_name  : 'product_category_name',
    unit_price             : 10000,
    quantity               : 2,
    amount                 : 20000,
    shop_id                : 1,
    stock_on_hand          : 10,
    user_id                : 1,
    user_name              : 'user_name'
  })
  receiving_vm.fields.items.push(receiving_item_vm)

  api_data = {
    receivingId       : 1,
    quantity          : 2,
    amount            : 20000,
    items             : [],
    supplierId        : 1,
    supplierName      : 'supplier_name',
    notes             : 'notes',
    receivingDateTS   : 100,
    userId            : 1,
    username          : 'user_name',
    shopId            : 1
  }
  api_data.items = [{
    receivingId           : 1,
    receivingItemId       : 1,
    receivingItemGuidId   : 'aaa',
    productId             : 1,
    productCode           : 'p001',
    productName           : 'product_name',
    spec                  : 'spec',
    productCategoryId     : 1,
    productCategoryName   : 'product_category_name',
    unitPrice             : 10000,
    quantity              : 2,
    amount                : 20000,
    shopId                : 1,
    stockOnHand           : 10,
    userId                : 1,
    userName              : 'user_name'
  }]
})

describe('receiving-view-model.js', () => {
  // notes
  it('notes is null, true', () => {
    receiving_vm.fields.notes = null
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is undefined, true', () => {
    receiving_vm.fields.notes = undefined
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is empty, true', () => {
    receiving_vm.fields.notes = ''
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has 500 characters, true', () => {
    receiving_vm.fields.notes = TestHelper.generateMaxLength(500,'a')
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has more than 501 characters, false', () => {
    receiving_vm.fields.notes = TestHelper.generateMaxLength(501,'a')
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // supplier_id
  it('supplier_id is null, true', () => {
    receiving_vm.fields.supplier_id = null // not process in customRule
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('supplier_id is undefined, true', () => {
    receiving_vm.fields.supplier_id = undefined // not process in customRule
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('supplier_id is empty, true', () => {
    receiving_vm.fields.supplier_id = '' // not process in customRule
    let errors = receiving_vm.isValid()
    expect(errors.length).toEqual(0)
  })

  // mapFields
  it('mapFieldsFromApi, true', () => {
    let receiving_vm = new ReceivingViewModel()
    receiving_vm.mapFieldsFromApi(api_data)
    // console.log('receiving_vm', receiving_vm.fields)
    if(receiving_vm.fields.receiving_id     != 1
    || receiving_vm.fields.quantity         != 2
    || receiving_vm.fields.amount           != 20000
    || receiving_vm.fields.items.length     != 1
    || receiving_vm.fields.supplier_id      != 1
    || receiving_vm.fields.supplier_name    != 'supplier_name'
    || receiving_vm.fields.notes            != 'notes'
    || receiving_vm.fields.receiving_date_ts!= 100
    || receiving_vm.fields.user_id          != 1
    || receiving_vm.fields.user_name        != 'user_name'
    || receiving_vm.fields.shop_id          != 1)
    {
      error_counting = 1
    }

    let item = receiving_vm.fields.items[0].fields
    // console.log('item', item)
    if(item.receiving_id            != 1
    || item.receiving_item_id       != 1
    || item.product_id              != 1
    || item.product_code            != 'p001'
    || item.product_name            != 'product_name'
    || item.spec                    != 'spec'
    || item.product_category_id     != 1
    || item.product_category_name   != 'product_category_name'
    || item.unit_price              != 10000
    || item.quantity                != 2
    || item.amount                  != 20000
    || item.shop_id                 != 1
    || item.stock_on_hand           != 10)
    {
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})