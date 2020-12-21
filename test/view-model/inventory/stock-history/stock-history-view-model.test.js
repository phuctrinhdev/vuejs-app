import StockHistoryViewModel from '../../../../src/view-model/inventory/stock-history/stock-history-view-model'
// import TestHelper from '../../../helpers/tests-helper'
// import { inventory_options } from '../../../../src/helpers/options/inventory-options'
import { convertTimeStampToDate } from '../../../../src/helpers/common'

let stock_history_vm = {}
beforeEach(() => {
  stock_history_vm = new StockHistoryViewModel()
  stock_history_vm.setFields({
    action        : 1,
    action_reason : 1,
    product_code  : 'product_code',
    product_name  : 'product_name',
    stock_on_hand : 10,
    stock_before  : 20,
    adjusted_qty  : -10,
    notes         : 'notes',
    date_time     : convertTimeStampToDate(1592388511), // ui only
    date_time_ts  : 1592388511,
    user_id       : 'user_id',
    user_name     : 'user_name',
    shop_id       : 1
  })
})

describe('stock-history-view-model.js', () => {
  // mapFields
  it('mapFieldsFromApi, true', () => {
    let api_data = {
      action      : 1,
      actionReason: 1,
      productCode : 'productCode',
      productName : 'productName',
      stockOnHand : 10,
      stockBefore : 20,
      adjustedQty : -10,
      notes       : 'notes',
      dateTimeTS  : 1592388511,
      userId      : 'userId',
      userName    : 'userName',
      shopId      : 1,
    }
    stock_history_vm.mapFieldsFromApi(api_data)
    
    let error_counting = 0
    if(stock_history_vm.fields.action       != 1
    || stock_history_vm.fields.action_reason!= 1
    || stock_history_vm.fields.product_code != 'productCode'
    || stock_history_vm.fields.product_name != 'productName'
    || stock_history_vm.fields.stock_on_hand!= 10
    || stock_history_vm.fields.stock_before != 20
    || stock_history_vm.fields.adjusted_qty != -10
    || stock_history_vm.fields.notes        != 'notes'
    || stock_history_vm.fields.date_time_ts != 1592388511
    || stock_history_vm.fields.user_id      != 'userId'
    || stock_history_vm.fields.user_name    != 'userName'
    || stock_history_vm.fields.shop_id      != 1){
      error_counting = 1
    }
    expect(error_counting).toEqual(0)
  })
})