import ProductCategoryViewModel from '../../../src/view-model/goods/product-category-view-model.js'
import { options } from '../../../src/helpers/options'
import TestHelper from '../../helpers/tests-helper'

var product_category_vm = {}
beforeEach(() => {
  product_category_vm = new ProductCategoryViewModel()  
  product_category_vm.setFields({
    id      : 1, 
    name    : 'name',
    status  : options.good_status.active,
    shop_id : 1
  })
})

describe('product-category-view-model.js', () => {
  // product_category_name
  it('product_category_name is null', () => {
    product_category_vm.fields.name = null
    var errors = product_category_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('product_category_name is undefined', () => {
    product_category_vm.fields.name = undefined
    var errors = product_category_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('product_category_name is empty', () => {
    product_category_vm.fields.name = ''
    var errors = product_category_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('product_category_name has 40 characters', () => {
    product_category_vm.fields.name = TestHelper.generateMaxLength(40,'a')
    var errors = product_category_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('product_category_name has more than 40 characters', () => {
    product_category_vm.fields.name = TestHelper.generateMaxLength(41,'a')
    var errors = product_category_vm.isValid()
    expect(errors.length).toEqual(1)
  })


  // mapFieldsFromApi


  // mapFieldsToApi


})