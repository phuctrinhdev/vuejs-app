import MenuApi from '../../api/menu/menu-api'
import { options }    from '../../helpers/options'
import _ from 'lodash'

const state_default = {
  menu_pc: {
  },
  menu_permission: [],
  menu_data: {
    sales: {
      text: 'sales',
      link: '',
      code: 'SA_SAL_01',
      submenu: {
        sales_report: {
          text: 'sales-report',
          link: '',
          code: 'SA_SAL_02',
          submenu: {
            sales_total: {
              text: 'sales-total',
              link: '/sales-total',
              code: 'SA_SAL_03'
            },
            sales_by_staff: {
              text: 'sales-by-staff',
              link: '/sales-by-staff',
              code: 'SA_SAL_04'
            },
            sales_by_item: {
              text: 'sales-by-item',
              link: '/sales-by-item',
              code: 'SA_SAL_05'
            }
          }
        },
        sales_history: {
          text: 'sales-history',
          link: '',
          code: 'SA_SAL_06',
          submenu: {
            invoices: {
              text: 'sales-history',
              link: '/sales-history',
              code: 'SA_SAL_07'
            },
            bookings: {
              text: 'booking-calendar',
              link: '/calendar',
              code: 'SA_SAL_08'
            },
            receivables: {
              text: 'outstanding',
              link: '/outstanding',
              code: 'SA_SAL_09'
            }
          }
        },
        point_balance: {
          text: 'edit-and-delete-history',
          link: '',
          code: 'SA_SAL_10',
          submenu: {
            point_balance: {
              text: 'edit-and-delete-history',
              link: '/sales-edit-delete-history',
              code: 'SA_SAL_11'
            }
          }
        }
      }
    },
    clients: {
      text: 'clients',
      link: '',
      code: 'SA_CLN_01',
      submenu: {
        clients: {
          text: 'clients',
          link: '',
          code: 'SA_CLN_02',
          submenu: {
            sales_total: {
              text: 'clients',
              link: '/clients',
              code: 'SA_CLN_03'
            },
            sales_by_staff: {
              text: 'duplicated-clients',
              link: '/duplicated-clients',
              code: 'SA_CLN_04'
            },
            sales_by_item: {
              text: 'deleted-clients',
              link: '/deleted-clients',
              code: 'SA_CLN_05'
            }
          }
        },
        client_management: {
          text: 'client-management',
          link: '',
          code: 'SA_CLN_06',
          submenu: {
            client_management: {
              text: 'client-management',
              link: '/client-management',
              code: 'SA_CLN_07'
            },
            campaign_management: {
              text: 'campaign-management',
              link: '/campaign-management',
              code: 'SA_CLN_08'
            }
          }
        },
        messages: {
          text: 'messages',
          link: '',
          code: 'SA_CLN_09',
          submenu: {
            messaging_history: {
              text: 'messages-history',
              link: '/send-message-histories',
              code: 'SA_CLN_10'
            },
            setup_automatic_messaging: {
              text: 'setup-automatic-messaging',
              link: '/setup-automatic-messaging',
              code: 'SA_CLN_11'
            },
            message_sender_numbers: {
              text: 'sender-number-setup',
              link: '/message-sender-numbers',
              code: 'SA_CLN_12'
            }
          }
        }
      }
    },
    staff: {
      text: 'staff',
      link: '',
      code: 'SA_STF_01',
      submenu: {
        staff: {
          text: '',
          link: '',
          code: 'SA_STF_02',
          submenu: {
            time_clock: {
              text: 'time-clock',
              link: '/time-clock',
              code: 'SA_STF_03'
            },
            staff_goal: {
              text: 'staff-goal',
              link: '/staff-goal-management',
              code: 'SA_STF_04'
            },
            payroll: {
              text: 'payroll',
              link: '/payroll-statement',
              code: 'SA_STF_05'
            },
            staffs: {
              text: 'staffs',
              link: '/staffs',
              code: 'SA_STF_06'
            }
          }
        }
      }
    },
    inventory: {
      text: 'inventory',
      link: '',
      code: 'SA_INT_01',
      submenu: {
        stock_management: {
          text: 'stock-management',
          link: '',
          code: 'SA_INT_02',
          submenu: {
            receivings: {
              text: 'receivings',
              link: '/receivings',
              code: 'SA_INT_03'
            },
            internal_user: {
              text: 'stock-internal-use',
              link: '/stock-internal-use',
              code: 'SA_INT_04'
            },
            stock_adjustment: {
              text: 'stock-adjustment',
              link: '/stock-adjustment',
              code: 'SA_INT_05'
            },
            stock_history: {
              text: 'stock-history',
              link: '/stock-history',
              code: 'SA_INT_06'
            },
            stock_status: {
              text: 'stock-status',
              link: '/stock-status',
              code: 'SA_INT_07'
            }
          }
        },
        suppliers: {
          text: 'suppliers',
          link: '',
          code: 'SA_INT_08',
          submenu: {
            suppliers: {
              text: 'suppliers',
              link: '/suppliers',
              code: 'SA_INT_09'
            }
          }
        }
      }
    },
    expenditure: {
      text: 'expenditure',
      link: '',
      code: 'SA_EXP_01',
      submenu: {
        expenditure: {
          text: '',
          link: '',
          code: 'SA_EXP_02',
          submenu: {
            // add_expenditure: {
            //   text: 'add-expenditure',
            //   link: '/expenditure-history#add-expenditure',
            //   code: 'SA_EXP_03
            // },
            expenditure_history: {
              text: 'expenditure-history',
              link: '/expenditure-history',
              code: 'SA_EXP_04'
            },
            expenditure_summary: {
              text: 'expenditure-summary',
              link: '/expenditure-summary',
              code: 'SA_EXP_05'
            },
            expenditure_items: {
              text: 'expenditure-items',
              link: '/expenditure-items',
              code: 'SA_EXP_06'
            }
          }
        }
      }
    },
    report: {
      text: 'report',
      link: '',
      code: 'SA_REP_01',
      submenu: {
        report: {
          text: '',
          link: '',
          code: 'SA_REP_02',
          submenu: {
            show_menu: {
              text: 'show-menu',
              link: '/report-menu',
              code: 'SA_REP_03'
            }
          }
        }
      }
    },
    setup: {
      text: 'setup',
      link: '',
      code: 'SA_SET_01',
      submenu: {
        services_and_products: {
          text: 'service-and-product',
          link: '',
          code: 'SA_SET_02',
          submenu: {
            services: {
              text: 'services',
              link: '/services',
              code: 'SA_SET_03'
            },
            prepaid_cards: {
              text: 'prepaid-cards',
              link: '/prepaid-cards',
              code: 'SA_SET_04'
            },
            packages: {
              text: 'packages',
              link: '/packages',
              code: 'SA_SET_05'
            },
            products: {
              text: 'products',
              link: '/products',
              code: 'SA_SET_06'
            },
            product_categories: {
              text: 'product-categories',
              link: '/product-categories',
              code: 'SA_SET_07'
            }
          }
        },
        basic_setup: {
          text: 'basic-setup',
          link: '',
          code: 'SA_SET_08',
          submenu: {
            misc_codes: {
              text: 'misc-codes',
              link: '/misc-codes',
              code: 'SA_SET_09'
            },
            loyalty_points_setup: {
              text: 'loyalty-points-setup',
              link: '/loyalty-points-setup',
              code: 'SA_SET_10'
            },
            environment_setup: {
              text: 'environment-setup',
              link: '/environment-setup',
              code: 'SA_SET_11'
            }
          }
        },
        device_interface: {
          text: 'device-interface',
          link: '',
          code: 'SA_SET_12',
          submenu: {
            cid_setup: {
              text: 'caller-id-setup',
              link: '/cid-setup',
              code: 'SA_SET_13'
            }
          }
        }
      }
    },
    account: {
      text: 'account',
      link: '',
      code: 'SA_ACC_01',
      submenu: {
        account: {
          text: 'account',
          link: '',
          code: 'SA_ACC_02',
          submenu: {
            user_account: {
              text: 'user-account',
              link: '/user-accounts',
              code: 'SA_ACC_03'
            },
            shop_information: {
              text: 'shop-information',
              link: '/shop-information',
              code: 'SA_ACC_04'
            }
          }
        },
        payment: {
          text: 'payment',
          link: '',
          code: 'SA_ACC_05',
          submenu: {
            payments: {
              text: 'payments',
              link: '/payments',
              code: 'SA_ACC_06'
            },
            payment_history: {
              text: 'payment-history',
              link: '/payment-history',
              code: 'SA_ACC_07'
            },
            netmoney_history: {
              text: 'netmoney-history',
              link: '/netmoney-history',
              code: 'SA_ACC_08'
            },
            extension_expiry_date: {
              text: 'extension-expiry-date',
              link: '/extension-expiry-date',
              code: 'SA_ACC_09'
            }
          }
        }
      }
    },
    support: {
      text: 'support',
      link: '',
      code: 'SA_SUP_01',
      submenu: {
        support: {
          text: '',
          link: '',
          code: 'SA_SUP_02',
          submenu: {
            notices: {
              text: 'notices',
              link: '/boards/SYSNOTICE',
              code: 'SA_SUP_03'
            },
            headquarter_notice: {
              text: 'headquarter-notice',
              link: '/boards/CHNNOTICE',
              code: 'SA_SUP_04'
            },
            branch_board: {
              text: 'branch-board',
              link: '/boards/CHNBOARD',
              code: 'SA_SUP_05'
            },
            system_qna: {
              text: 'system-qna',
              link: '/boards/SYSBOARD',
              code: 'SA_SUP_06'
            },
            manual: {
              text: 'manual',
              link: '/manuals',
              code: 'SA_SUP_07'
            },
            solution_information: {
              text: 'solution-information',
              link: '/solution-information',
              code: 'SA_SUP_08'
            }
          }
        }
      }
    }
  },
  menu_data_flat: [],
  show_menu_pc:{
    is_show: true
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getMenuPc: (state) => {
    return state.menu_pc
  },
  getMenuPermission: (state) => {
    return state.menu_permission
  },
  getMenu: (state) => {
    return state.menu_data
  },
  getMenuDataFlat: (state) => {
    return state.menu_data_flat
  },
  getShowMenuPc: (state) => {
    return state.show_menu_pc
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setMenuPc(state, menu_pc){
    state.menu_pc = menu_pc
  },
  setMenuPermission(state, menu_permission){
    state.menu_permission = menu_permission
  },
  setMenuDataFlat(state){
    let tmp_1_menus = _.flatMapDeep(state.menu_data)
    let tmp_2_menus = []
    for(let tmp_1_menu of tmp_1_menus){
      tmp_2_menus = [...tmp_2_menus, ..._.flatMapDeep(tmp_1_menu.submenu)]
    }
    let tmp_3_menus = []
    for(let tmp_2_menu of tmp_2_menus){
      tmp_3_menus = [...tmp_3_menus, ..._.flatMapDeep(tmp_2_menu.submenu)]
    }
    state.menu_data_flat = [...tmp_1_menus, ...tmp_2_menus, ...tmp_3_menus]
  },
  setShowMenuPc(state, show_menu_pc){
    state.show_menu_pc = show_menu_pc
  }
}

// actions
const actions = {
  setShowMenuPcData({commit}, show_menu_pc){
    commit('setShowMenuPc', show_menu_pc)
  },
  async getUseMenuDataAsync({commit}, menu_pc){
    try {
      let menu_api = new MenuApi()
      let result = await menu_api.getUseMenuDataAsync(menu_pc)
      if(menu_pc.chain_id==0) result.data.items.splice(_.findIndex(result.data.items, x=>x=='SA_SUP_04'), 1)
      if(menu_pc.chain_id==0 || menu_pc.chain_board_type == options.boards_enum.branch_board_type.none) result.data.items.splice(_.findIndex(result.data.items, x=>x=='SA_SUP_05'), 1)
      commit('setMenuDataFlat')
      commit('setMenuPc', result)
      if(result.is_ok)
        commit('setMenuPermission', result.data.items)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
