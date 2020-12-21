  
 
import PackageViewModel from '../../../src/view-model/goods/package-view-model.js' 
import { options } from '../../../src/helpers/options'
import TestHelper from '../../helpers/tests-helper.js'

let item = {}
let package_vm = {} 
beforeEach(() => { 
  package_vm = new PackageViewModel()  
  item = {
    id       : 1, 
    goods_id : 1,
    item_type: options.sales_enum.goods_type.service,
    price    : 1000
  }
  package_vm.setFields({
    id          : 1, 
    name        : 'name', 
    total_amount: 0,
    status      : options.good_status.active,
    items       : [item],
    is_delete   : false,
    shared      : true,
    shop_id     : 0
  })
})
describe('package-view-model.js', () => {
  it('package_name is null', () => {
    package_vm.fields.name = null
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package_name name is undefined', () => {
    package_vm.fields.name = undefined
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package_name is empty', () => {
    package_vm.fields.name = ''
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package_name has 40 characters', () => {
    package_vm.fields.name = TestHelper.generateMaxLength(40,'a')
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('package_name has 41 characters', () => {
    package_vm.fields.name = TestHelper.generateMaxLength(41,'a')
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package not has item', () => {
    // package_vm.fields.items = []
    // let errors = package_vm.isValid()
    // expect(errors.length).toEqual(1)
  })
  it('package has 6 products', () => {
    item.item_type = options.sales_enum.goods_type.product
    package_vm.fields.items = []
    for (let i = 1; i <= 6; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('package has more than 6 products', () => {
    item.item_type = options.sales_enum.goods_type.product
    package_vm.fields.items = []
    for (let i = 1; i <= 7; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package has 6 services', () => {  
    item.item_type = options.sales_enum.goods_type.service
    package_vm.fields.items = []
    for (let i = 1; i <= 6; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('package has more than 6 services', () => {
    item.item_type = options.sales_enum.goods_type.service
    package_vm.fields.items = []
    for (let i = 1; i <= 7; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package has 1 prepaid card', () => {
    item.item_type = options.sales_enum.goods_type.prepaid_card
    package_vm.fields.items = []
    for (let i = 1; i <= 1; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('package has more than 1 prepaid card', () => {
    item.item_type = options.sales_enum.goods_type.prepaid_card
    package_vm.fields.items = []
    for (let i = 1; i <= 2; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('package has 8 prepaid services', () => {
    item.item_type = options.sales_enum.goods_type.prepaid_service
    package_vm.fields.items = []
    for (let i = 1; i <= 8; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('package has more than 8 prepaid services', () => {
    item.item_type = options.sales_enum.goods_type.prepaid_service
    package_vm.fields.items = []
    for (let i = 1; i <= 9; i++) {
      item.id = i
      package_vm.fields.items.push(item)
    }
    let errors = package_vm.isValid()
    expect(errors.length).toEqual(1)
  })


  // mapFieldsFromApi


  // mapFieldsToApi


})