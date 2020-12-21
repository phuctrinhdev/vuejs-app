import SupplierViewModel from '../../../../src/view-model/inventory/supplier/supplier-view-model'
import { options } from '../../../../src/helpers/options'
import TestHelper from '../../../helpers/tests-helper'

let supplier_vm = {}
beforeEach(() => {
  supplier_vm = new SupplierViewModel()
  supplier_vm.setFields({
    supplier_id    : 1,
    supplier_name  : 'supplier_name',
    representative : 'representative',
    phone_number   : 123456,
    mobile_number  : 234567,
    fax            : 'fax',
    email          : 'supplier@gmail.com',
    notes          : 'notes',
    active         : options.good_status.active,
    shop_id        : 1,
  })
})

describe('supplier-view-model.js', () => {
  // supplier_name
  it('supplier_name is null, false', () => {
    supplier_vm.fields.supplier_name = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('supplier_name is undefined, false', () => {
    supplier_vm.fields.supplier_name = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('supplier_name is empty, false', () => {
    supplier_vm.fields.supplier_name = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('supplier_name has 40 characters, true', () => {
    supplier_vm.fields.supplier_name = TestHelper.generateMaxLength(40,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('supplier_name has more than 40 characters, false', () => {
    supplier_vm.fields.supplier_name = TestHelper.generateMaxLength(41,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  
  // representative
  it('representative is null, true', () => {
    supplier_vm.fields.representative = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('representative is undefined, true', () => {
    supplier_vm.fields.representative = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('representative is empty, true', () => {
    supplier_vm.fields.representative = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('representative has 40 characters, true', () => {
    supplier_vm.fields.representative = TestHelper.generateMaxLength(40,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('representative has more than 40 characters, false', () => {
    supplier_vm.fields.representative = TestHelper.generateMaxLength(41,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // phone_number
  it('phone_number is null, true', () => {
    supplier_vm.fields.phone_number = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('phone_number is undefined, true', () => {
    supplier_vm.fields.phone_number = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('phone_number is empty, true', () => {
    supplier_vm.fields.phone_number = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('phone_number not number, false', () => {
    supplier_vm.fields.phone_number = 'a'
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('phone_number is number & has 20 characters, true', () => {
    supplier_vm.fields.phone_number = '12345678911111111111' // 20
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('phone_number is number & has more than 20 characters, false', () => {
    supplier_vm.fields.phone_number = '123456789111111111111' // 21
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // mobile_number
  it('mobile_number is null, true', () => {
    supplier_vm.fields.mobile_number = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('mobile_number is undefined, true', () => {
    supplier_vm.fields.mobile_number = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('mobile_number is empty, true', () => {
    supplier_vm.fields.mobile_number = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('mobile_number not number, false', () => {
    supplier_vm.fields.mobile_number = 'a'
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('mobile_number has 12 characters, true', () => {
    supplier_vm.fields.mobile_number = '123456789111' // 12
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('mobile_number has more than 12 characters, false', () => {
    supplier_vm.fields.mobile_number = '1234567891111' // 13
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // fax
  it('fax is null, true', () => {
    supplier_vm.fields.fax = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('fax is undefined, true', () => {
    supplier_vm.fields.fax = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('fax is empty, true', () => {
    supplier_vm.fields.fax = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('fax has 20 characters, true', () => {
    supplier_vm.fields.fax = TestHelper.generateMaxLength(20,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('fax has more than 20 characters, false', () => {
    supplier_vm.fields.fax = TestHelper.generateMaxLength(21,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  
  // notes
  it('notes is null, true', () => {
    supplier_vm.fields.notes = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is undefined, true', () => {
    supplier_vm.fields.notes = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes is empty, true', () => {
    supplier_vm.fields.notes = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has 500 characters, true', () => {
    supplier_vm.fields.notes = TestHelper.generateMaxLength(500,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('notes has more than 500 characters, false', () => {
    supplier_vm.fields.notes = TestHelper.generateMaxLength(501,'a')
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // email
  it('email is null, true', () => {
    supplier_vm.fields.email = null
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('email is undefined, true', () => {
    supplier_vm.fields.email = undefined
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('email is empty, true', () => {
    supplier_vm.fields.email = ''
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('email is not standard format, false', () => {
    supplier_vm.fields.email = 'aaa@gmail-com'
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })
  it('email has 40 characters, true', () => {
    supplier_vm.fields.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com' // 40
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(0)
  })
  it('email has more than 40 characters, false', () => {
    supplier_vm.fields.email = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com' // 41
    let errors = supplier_vm.isValid()
    expect(errors.length).toEqual(1)
  })

  // mapFields
  it('mapFieldsFromApi, true', () => {
    let api_data = {
      supplierId     : 1,
      supplierName   : 'supplier_name',
      representative : 'representative',
      phoneNumber    : 123456,
      mobileNumber   : 234567,
      fax            : 'fax',
      email          : 'supplier@gmail.com',
      notes          : 'notes',
      active         : options.good_status.active,
      shopId         : 1,
    }
    supplier_vm.mapFieldsFromApi(api_data)
    
    let error_counting = 0
    if(supplier_vm.fields.supplier_id     != 1
    || supplier_vm.fields.supplier_name   != 'supplier_name'
    || supplier_vm.fields.representative  != 'representative'
    || supplier_vm.fields.phone_number    != 123456
    || supplier_vm.fields.mobile_number   != 234567
    || supplier_vm.fields.fax             != 'fax'
    || supplier_vm.fields.email           != 'supplier@gmail.com'
    || supplier_vm.fields.notes           != 'notes'
    || supplier_vm.fields.active          != options.good_status.active
    || supplier_vm.fields.shop_id         != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
  it('mapFieldsToApi, true', () => {
    let api_data = supplier_vm.mapFieldsToApi()
    
    let error_counting = 0
    if(api_data.supplierId      != 1
    || api_data.supplierName    != 'supplier_name'
    || api_data.representative  != 'representative'
    || api_data.phoneNumber     != 123456
    || api_data.mobileNumber    != 234567
    || api_data.fax             != 'fax'
    || api_data.email           != 'supplier@gmail.com'
    || api_data.notes           != 'notes'
    || api_data.active          != options.good_status.active
    || api_data.shopId          != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})