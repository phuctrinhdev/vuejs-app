import { GOODS_STATUS, PAGINATION } from '../../config/constant'

export const common_options = {
  yes_no: {
    yes: true,
    no: false
  },
  good_status: {
    all: GOODS_STATUS.ALL,
    active: GOODS_STATUS.ACTIVE,
    inactive: GOODS_STATUS.INACTIVE,
    list_default: GOODS_STATUS.LIST_DEFAULT,
  },
  environment_setup_session: {
    key: 'environment_setup',
    expire_time: 30
  },
  form_actions: {
    add: 1,
    edit: 2,
    delete: 3,
    view: 4,
    create: 5,
    part: 6,
    re_add: 7
  },
  pagination: {
    zero: PAGINATION.ZERO,
    small: PAGINATION.SMALL,
    default: PAGINATION.DEFAULT,
    big: PAGINATION.BIG,
    max: PAGINATION.MAX,
    notification: PAGINATION.NOTIFICATION,
  },
  standard_date_format: {
    default: 'DD-MM-YYYY',
    dmy    : 'DD-MM-YYYY',
    dmyh   : 'DD-MM-YYYY HH:mm',
    dymd   : 'dddd, YYYY-MM-DD',
    ymd    : 'YYYY-MM-DD',
    ymdh   : 'YYYY-MM-DD HH:mm',
    mdy    : 'MM-DD-YYYY',
    utc    : 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  },
  standard_hour_format : {
    default: 'HH:mm',
    h12: 'hh:mm A',
    h24: 'HH:mm',
    h24_seconds: 'HH:mm:ss'
  },
  date_type : {
    date       : 1,
    month      : 2,
    date_range : 3 
  }
}