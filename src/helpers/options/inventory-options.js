/*
    This file just contains enum, options, contains for Inventory Part.
    Please follow naming convention :
    - Enum type :  <name>_<enum>.
    - Constants :  <uppercase_name>.
    - Session : <name>_<session>
 */

export const inventory_options = {
  supplier_status_enum : {
    all      : 0,
    active   : 1,
    in_active: 2
  },
  stock_history_action: {
    all             : 0,
    sales           : 1,
    refund          : 2,
    receiving       : 3,
    internal_use    : 4,
    stock_adjustment: 5,
    decrease_stock  : 6
  },
  action_reason_for_sales: {
    sales         : 1,
    sales_modified: 2,
    sales_deleted : 3
  },
  action_reason_for_refund: {
    refund         : 1,
    refund_modified: 2,
    refund_deleted : 3
  },
  action_reason_for_receiving: {
    receiving         : 1,
    receiving_modified: 2,
    receiving_deleted : 3
  },
  action_reason_for_internal_use: {
    internal_use         : 1,
    internal_use_modified: 2,
    internal_use_deleted : 3
  },
  action_reason_for_stock_adjustment: {
    stock_adjustment : 1
  },
  action_reason_for_decrease_stock: {
    damaged    : 1,
    lost       : 2,
    out_of_date: 3,
    return     : 4,
    etc        : 5
  },
  error_codes: {
    stock_adjustment: {
      saj07c: 'SAJ07C'
    }
  }
}
