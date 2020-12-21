import moment from 'moment'
import i18n from '../translate/translate'
import { options } from '../helpers/options'
import { cache_session } from '../helpers/cache-session'
import _ from 'lodash'
import store from '../store/store'

// mapPaging
export function mapPagingToApi(query) {
  return {
    pageSize: query.page_size,
    pageNumber: query.page_number,
    shopId: query.shop_id,
    status: query.status
  }
}

export function mapPagingFromApi(paging) {
  let total_page = 1
  if (paging && paging.totalItems > 0) {
    total_page = Math.ceil(paging.totalItems / paging.pageSize)
  }
  else {
    paging = {
      pageNumber: 1,
      pageSize: options.pagination.default,
      totalItems: options.pagination.zero
    }
  }
  return {
    page_number: paging.pageNumber,
    page_size: paging.pageSize,
    total_items: paging.totalItems,
    total_pages: total_page
  }
}

export function mapFileFromApi(file){
  return {
    file_attachment_id : file.fileAttachmentId,
    name               : file.originalFileName,
    storage_file_name  : file.storageFileName,
    size               : file.fileSize,
    board_code         : file.boardCode,
    related_id         : file.relatedId,
    related_type       : file.relatedType,
    order_no           : file.orderNo
  }
}

// check type & format data value
export function checkUndefined(value) {
  if (value === undefined) return true
}
export function checkNull(value) {
  if (value === null) return true
}
export function checkStringEmpty(value) {
  if (value === '') return true
}
export function checkNullAndEmpty(value) {
  if (value === '' || value === null) return true
}
export function checkNullAndEmptyAndUndefined(value) {
  if (value === '' || value === null || value == undefined) return true
}
export function formatMoney(num, decimal_count = 2) {
  if (num === undefined || num === null || num === '' || isNaN(Number(num))) return ''

  num = Number(num).toFixed(decimal_count)
  num = num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  return num
}
export function formatMoneyForReport(num, is_decimal) {
  let tmp = ''
  if(num == 0 || Math.abs(num) >= 50)
    tmp = formatMoney(num,0)
  else{
    if(is_decimal)
      tmp = formatMoney(num,2)
    else
      tmp = formatMoney(num,0)
  }
  return tmp
}

export function formatTime(time, str_format = '') {
  //time = new Date('08:00:00')
  if (time == undefined || time === null || time === '') return ''
  try {
    if (str_format == '') str_format = options.standard_hour_format.default
    let arr_time = time.split(':')
    let duration = ''
    if (arr_time.length == 3)
      duration = moment({ h: arr_time[0], m: arr_time[1], s: arr_time[2] }).format(str_format)
    else if (arr_time.length == 2)
      duration = moment({ h: arr_time[0], m: arr_time[1] }).format(str_format)
    return duration
  } catch (e) {
    return ''
  }
}
export function loadWeekOfMonth(weeks) {
  let arr_week = [
    { name: i18n.t('general.first'), value: options.repeated_weeks_options.first },
    { name: i18n.t('general.second'), value: options.repeated_weeks_options.second },
    { name: i18n.t('general.third'), value: options.repeated_weeks_options.third },
    { name: i18n.t('general.fourth'), value: options.repeated_weeks_options.fourth }
  ]

  let str_week = ''
  for (let week in weeks) {
    for (let index in arr_week) {
      if (weeks[week] == arr_week[index].value) {
        str_week += arr_week[index].name + ', '
      }
    }
  }

  return i18n.t('general.every') + ' ' + str_week.substr(0, str_week.length - 2) + ' ' + i18n.t('general.week')
}
export function loadDayOfWeek(days) {
  // [1, 2] -> Monday, Tuesday
  days = _.uniq(days)
  let arr_day = [
    i18n.t('general.sunday'),
    i18n.t('general.monday'),
    i18n.t('general.tuesday'),
    i18n.t('general.wednesday'),
    i18n.t('general.thursday'),
    i18n.t('general.friday'),
    i18n.t('general.saturday')
  ]

  let str_day = ''
  for (let index in days) {
    let day = arr_day[days[index]]
    if (index > 0) str_day = str_day + ', ' + day
    else str_day = day
  }
  return str_day
}
export function loadTextOfWeek(days) {
  // [1] -> general.monday
  let arr_day = [
    'general.sunday',
    'general.monday',
    'general.tuesday',
    'general.wednesday',
    'general.thursday',
    'general.friday',
    'general.saturday'
  ]

  let str_day = ''
  for (let index in days) {
    if (index > 0) str_day = str_day + ', ' + arr_day[days[index]]
    else str_day = arr_day[days[index]]
  }
  return str_day
}
export function convertTextToTime(text_time) {
  let date = new Date()
  let time = text_time.split(':')
  let hours = time[0]
  let minutes = time[1]

  if (text_time.substr(-2) == 'PM' && Number(hours) == 12) hours = Number(hours)
  else if (text_time.substr(-2) == 'PM') hours = Number(hours) + 12

  date.setHours(hours)
  date.setMinutes(minutes)
  return date
}

export function convertUTCToDate(utcs) {
  let dates = []
  if (utcs) dates = utcs.map(date => {
    let utc = moment(date).startOf('date').toDate()
    return utc
  })
  return dates
}

export function convertDateToUTC(dates) {
  let utcs = []
  if (dates) utcs = dates.map(date => {
    let utc = moment(date).format(options.standard_date_format.ymd)
    return utc
  })
  return utcs
}

export function convertHoursToMinutes(hours_string) {
  let temp = hours_string.split(':')
  let hour = Number(temp[0])
  let minute = Number(temp[1])
  return hour * 60 + minute
}

export function isOver24Hours(hours_string) {
  return (convertHoursToMinutes(hours_string) >= options.minutes_of_24h)
}

export function convertMinutesToHours(minutes, has_second = false, zero_in_hour = true) {
  let temp = minutes / 60
  let hour = Math.floor(temp)
  let minute = minutes - (hour * 60)
  if (zero_in_hour && hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute

  let time = hour + ':' + minute
  if (has_second) time += ':00'
  return time
}

export function calculateStartTime(booked_items, action, start_time_default, booking_time_slot) {
  let tmp_groups = _.groupBy(booked_items, 'booking_resource_setup_id')

  let groups = []
  for (let i in tmp_groups) {
    let group = {
      resource_id: tmp_groups[i][0].booking_resource_setup_id,
      start_time: '',
      booked_items: tmp_groups[i]
    }
    let last_item = {
      booking_resource_setup_id: null,
      start_time: '',
      estimated_time: 0,
      processing_time: 0,
      finishing_time: 0,
      is_next_day: false
    }
    // calculate start_time
    if (action == options.form_actions.add)
      last_item.start_time = start_time_default
    else if (action == options.form_actions.edit || action == options.form_actions.delete) {
      last_item.start_time = tmp_groups[i][0].start_time
      last_item.is_next_day = tmp_groups[i][0].is_next_day
    }
    if (last_item.start_time == undefined)
      last_item.start_time = start_time_default
    
    for(let ii in group.booked_items){
      let item = group.booked_items[ii]
      if (item.service_id > 0 && item.processing_time > 0){
        item.finishing_time = item.lead_time - (item.estimated_time + item.processing_time)
      }
      else
        item.estimated_time = item.lead_time

      let duration = last_item.estimated_time + last_item.processing_time + last_item.finishing_time
      let time_slot = booking_time_slot
      let duration_time_slots = Math.ceil(duration / time_slot)
      let calculated_duration = duration_time_slots * time_slot
      let is_start_time_out_of_range = !(duration === calculated_duration)
      
      let start_time_minutes = convertHoursToMinutes(last_item.start_time) +
        (is_start_time_out_of_range ? duration : calculated_duration)
      item.start_time = convertMinutesToHours(start_time_minutes)
      
      if (ii == 0) {
        group.start_time = convertHoursToMinutes(item.start_time)
        item.disabled = false
      }
      else
        item.disabled = true
      // last item
      last_item = item
    }
    groups.push(group)
  }

  // sortby start_time & view
  groups = _.sortBy(groups, ['start_time'])
  let list = []
  for (let i in groups) {
    list = list.concat(groups[i].booked_items)
  }
  for (let i in list) {
    list[i].order_number = i
  }
  return list
}

export function generateLeadTimeOptions(booked_item, estimated_time_options) {
  let lead_time_options = [...estimated_time_options]
  let lead_time_min = booked_item.estimated_time
  if (booked_item.processing_time > 0) {
    lead_time_min = booked_item.estimated_time + booked_item.processing_time + 5
    lead_time_options = lead_time_options.filter(option => option.time >= lead_time_min)
  }

  // add lead time min option
  let lead_time_min_option = lead_time_options.filter(option => option.time == lead_time_min)
  if (lead_time_min_option.length == 0) {
    let lead_time_min_option = {
      id: lead_time_min,
      time: lead_time_min
    }
    lead_time_options.unshift(lead_time_min_option)
  }

  // add lead time if it not in options
  let lead_time = booked_item.estimated_time + booked_item.processing_time + booked_item.finishing_time
  let lead_time_option = lead_time_options.filter(option => option.time == lead_time)
  if (lead_time_option.length == 0) {
    lead_time_option = {
      id: lead_time,
      time: lead_time
    }
    lead_time_options.unshift(lead_time_option)
  }

  booked_item.lead_time = lead_time
  booked_item.lead_time_options = lead_time_options
  return booked_item
}

export function getClientHeaderParameters() {
  let user = store.getters['user/getUser']
  let shop = store.getters['user/getShop']

  let header_parameters = []
  header_parameters.push('countryCode')
  header_parameters.push(shop.country)

  header_parameters.push('shopId')
  header_parameters.push(shop.shop_id)

  header_parameters.push('solutionId')
  header_parameters.push(shop.solution_id)

  header_parameters.push('userID')
  header_parameters.push(user.user_id)

  header_parameters.push('name')
  header_parameters.push(user.user_name)

  header_parameters.push('userRole')
  header_parameters.push(user.role)

  return header_parameters.join()
}

export function mapSecurityInfo(model) {
  let user = store.getters['user/getUser']
  let shop = store.getters['user/getShop']

  model.created_by_id   = user.user_id
  model.created_by_name = user.user_name
  model.session_token   = user.session_token
  model.shop_location   = shop.shop_location
  model.country         = shop.country

  return model
}

export function mapActionSecurityInfo(model, action) {
  let user = store.getters['user/getUser']
  let shop = store.getters['user/getShop']
  let tmp_date_time_ts = convertDateToTimeStamp(new Date(), true)
  
  if(action == options.form_actions.add){
    model.created_by_id        = user.user_id
    model.created_by_name      = user.user_name
    model.created_date_time_ts = tmp_date_time_ts
  }
  if(action == options.form_actions.edit){
    model.edited_by_id         = user.user_id
    model.edited_by_name      = user.user_name
    model.edited_date_time_ts  = tmp_date_time_ts
  }
  if(action == options.form_actions.delete){
    model.deleted_by_id        = user.user_id
    model.deleted_by_name      = user.user_name
    model.deleted_date_time_ts = tmp_date_time_ts
  }
  model.session_token = user.session_token
  model.shop_location = shop.shop_location
  model.shop_id       = shop.shop_id

  return model
}

export function convertDateToTimeStamp(date, is_convert_timezone, has_hours) {
  if (is_convert_timezone) date = convertDateToTimezone(date)

  let timestamp = ''
  if (has_hours) {
    timestamp = Date.parse(date) / 1000
  }
  else {
    if (moment(date).isValid()) {
      timestamp = moment(date).format(options.standard_date_format.ymd)
      timestamp = Date.parse(timestamp) / 1000
    }
  }
  return timestamp
}
export function convertTimeStampPlusLocalzone(timestamp) {
  let zone = new Date().getTimezoneOffset() * -1
  timestamp += zone * 60
  return timestamp
}
export function convertTimeStampMinusSettingzone(timestamp) {
  let zone = store.getters['user/getShop'].timezone
  zone = Number(zone.slice(0,3))
  timestamp -= zone * 3600
  return timestamp
}
export function convertTimeStampMinusLocalzone(timestamp) {
  let zone = new Date().getTimezoneOffset() * -1
  timestamp -= zone * 60
  return timestamp
}
export function convertTimeStampToUtcDate(timestamp){
  let tmp_date = ''
  if(timestamp == null || timestamp == ''){
    tmp_date = new Date()
    return tmp_date
  }
  else{
    tmp_date = new Date(timestamp * 1000)
    return new Date(tmp_date.getUTCFullYear(),tmp_date.getUTCMonth(),tmp_date.getUTCDate())
  }
}

export function convertDateFromTimezoneToTimestamp(d, zone_from, has_hours) {   
  if (!moment(d).isValid) return null
  if (zone_from == null) zone_from = store.getters['user/getShop'].timezone
  
  let s=''
  if(has_hours) s=moment(d).format('YYYY-MM-DDTHH:mm:ss') + zone_from  
  else s=moment(d).format('YYYY-MM-DDT00:00:00') + zone_from  

  return Date.parse(s) / 1000
}
export function convertTimeStampToDate(timestamp, is_convert_timezone) {
  let date = ''
  if (timestamp == null || timestamp == '') date = new Date()
  else date = new Date(timestamp * 1000)
  if (is_convert_timezone) date = convertDateToTimezone(date)
  return date
}
export function convertDateToTimezone(date_local) {
  let timezone = store.getters['user/getShop'].timezone
  let tmp = moment(date_local).utcOffset(timezone)
  let date_timezone = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second())
  return date_timezone
}
export function convertFirstDateToTimezone(date_local) {
  let timezone = store.getters['user/getShop'].timezone
  let tmp = moment(date_local).utcOffset(timezone)
  let date_timezone = new Date(tmp.year(), tmp.month(), 1, tmp.hour(), tmp.minute(), tmp.second())

  return date_timezone
}
export function convertDateFromUtcToTimezone(d, zone_to) {
  let tmp = moment.utc(d).utcOffset(zone_to)
  if (!tmp.isValid) return null
  let toD = new Date(tmp.year(), tmp.month(), tmp.date(), tmp.hour(), tmp.minute(), tmp.second())
  return toD   
}
export function convertHourToTimezone(date) {
  let date_settting = convertDateToTimezone(new Date())
  let hour_settting = new Date(
    date.getFullYear(), date.getMonth(), date.getDate(),
    date_settting.getHours(), date_settting.getMinutes(), date_settting.getSeconds()
  )
  return hour_settting
}

export function convertDateFromLocalToTimezone(date){
  let date_settting = convertDateToTimezone(date)
  return new Date(date_settting.getFullYear(),date_settting.getMonth(),date_settting.getDate())
}

export function guid() {
  return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export function differentObject(object_1, object_2) {
  return !_.isEqual(object_1, object_2)
}
export function showCommonAlert(vue, alerts, option = undefined) {

  vue.$store.dispatch('alert/setAlertsData', alerts)
  if (option != undefined)
    vue.$store.dispatch('alert/setOptionsData', Object.assign(option, { vue: vue }))
  vue.$root.$emit('bv::show::modal', 'alert-modal')
}

// todo - Change country setting
export function formatDateBySetting(date = new Date(), has_hours = false) {
  let tmp_shop_data = store.getters['user/getShop']
  if(has_hours)
    return moment(date).format(tmp_shop_data.format_date + ' HH:mm')
  else
    return moment(date).format(tmp_shop_data.format_date)
}
export function formatDate(date) {
  if (date != null) {
    let d = new Date(date)
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }
  else
    return null
}
export function formatDateByString(date, str_format = ''){
  if(date == undefined || date === null || date === '' ) return ''
  try{
    if(str_format == '') str_format = options.standard_date_format.default
    return moment(date).format(str_format)
  }catch(e){
    return ''
  }
}
export function formatHourShort(time) {
  if (time != null) {
    let arrTime = time.split(':')
    return [arrTime[0], arrTime[1]].join(':')
  } 
  else
    return ''
}

export function addDateZero(date) {
  if (!checkUndefined(date) && !checkNull(date)) {
    if (date.toString().length == 1)
      date = '0' + date
    return date
  }
  else {
    return null
  }
}

export function isNullObject(object) {
  if (object && object != null && object != undefined) {
    return false
  }
  else {
    return true
  }
}

export function convertHoursToRow(hours_string, booking_setup) {
  let booking_table_time_start = convertHoursToMinutes(_.head(_.sortBy(booking_setup.booking_opening_hours_setup.opening_hours, 'start_time')).start_time)
  let row = (convertHoursToMinutes(hours_string) - booking_table_time_start) / booking_setup.booking_calendar_setup.booking_time_slot
  return row > 0 ? row : 0
}

export { cache_session }

export function checkDuplicateViewGroup(group, booking_view_groups, blocked_time_view_groups) {
  let duplicated_groups = [group]
  let view_groups = [...booking_view_groups, ...blocked_time_view_groups]
  //get source blocks
  let total_source_blocks = []
  //only do it for view group of bookings because a view group has many blocks
  if (group.booking_id > 0)
    total_source_blocks = [...group.blocks]
  if (!isNullObject(group.resizable_block))
    total_source_blocks.push(group.resizable_block)

  // check same col group
  let same_col_view_groups = _.filter(view_groups, {
    booking_resource_setup_id: group.booking_resource_setup_id,
    calendar_date_ts: group.calendar_date_ts
  })

  //remove itself
  if (group.booking_id > 0) same_col_view_groups = _.reject(same_col_view_groups, ['booking_id', group.booking_id])
  else if (group.blocked_time_id > 0) same_col_view_groups = _.reject(same_col_view_groups, ['blocked_time_id', group.blocked_time_id])

  //get destination blocks
  let total_destination_view_groups = []
  if (same_col_view_groups.length > 0) {
    for (let i in same_col_view_groups) {
      let same_col_view_group = same_col_view_groups[i]
      let total_blocks = [...same_col_view_group.blocks]
      if (!isNullObject(same_col_view_group.resizable_block))
        total_blocks.push(same_col_view_group.resizable_block)
      total_destination_view_groups.push({ view_group: same_col_view_group, total_blocks: total_blocks })
    }
  }
  // check duplication for each block
  for (let i in total_source_blocks) {
    let source_block = total_source_blocks[i]
    for (let j in total_destination_view_groups) {
      let tmp_des_group = total_destination_view_groups[j]
      for (let k in tmp_des_group.total_blocks) {
        let block = tmp_des_group.total_blocks[k]
        let duplicated = !(source_block.row >= block.row_end || source_block.row_end <= block.row)
        if (duplicated) {
          duplicated_groups.push(tmp_des_group.view_group)
          break
        }
      }
    }
  }

  return duplicated_groups
}

export function setViewGroupStyle(cols) {
  for (let i in cols) {
    let col = cols[i]
    for (let ii in col.groups) {
      let group = col.groups[ii]
      group.width = 100 / cols.length
      if (col.col_number == 0) group.margin_left = 0
      else group.margin_left = group.width * col.col_number
    }
  }
}

export function getGroupBookingItem(booking) {
  let booking_groups = []

  for (let i in booking.booked_items) {
    let item = booking.booked_items[i]
    let group = {
      booking_resource_setup_id: item.booking_resource_setup_id,
      group_items: [item],
    }
    group = Object.assign(group, booking[booking])
    if (booking_groups.length == 0) {
      booking_groups.push(group)
    }
    else {
      let same_group = booking_groups.filter(g => g.booking_resource_setup_id == item.booking_resource_setup_id)
      if (same_group.length > 0) {
        same_group[0].group_items.push(item)
        same_group[0].group_services += ' / ' + item.service_name
      }
      else {
        booking_groups.push(group)
      }
    }
    for (let i in booking_groups) {
      let group_item = booking_groups[i].group_items[0]
      let duration = 0
      booking_groups[i].start_time = convertMinutesToHours(convertHoursToMinutes(group_item.start_time))
      booking_groups[i].row = this.convertHoursToRow(group_item.start_time)
      duration += group_item.estimated_time + group_item.processing_time + group_item.finishing_time
      booking_groups[i].end_time = convertMinutesToHours(convertHoursToMinutes(booking_groups[i].start_time) + duration)
      booking_groups[i].row_end = this.convertHoursToRow(booking_groups[i].end_time)
    }
  }
  return booking_groups
}

export function calculateMenuViewGroupPosition(group, e) {
  // 1. calculate menu position from convert click position
  // 2. calculate menu max position vs viewport / calendar
  // getBoundingClientRect: position / direct parent's viewport
  let table_object = document.getElementById('calendar-table')
  let table_rect = table_object.getBoundingClientRect()

  let el_clicked = e.target.closest('.calendar-cell-view-block')
  let el_object = document.getElementById(el_clicked.id)
  let menu_top = e.layerY + el_object.offsetTop
  let menu_left = e.layerX

  let menu_id = 'menu-' + group.getKey()
  let menu_object = document.querySelector('#' + menu_id + ' .dropdown-menu')
  let menu_right_max = Math.floor(e.pageX + menu_object.offsetWidth)
  let menu_bottom_max = Math.floor(e.pageY + menu_object.offsetHeight)

  // view menu at the right
  let calendar_right_max = Math.ceil(table_rect.left + table_rect.width - options.browser_scroll)
  if (menu_right_max > calendar_right_max) {
    menu_left = menu_left - (menu_right_max - calendar_right_max)
  }

  // view menu at the bottom
  let viewport_bottom_max = window.scrollY + window.innerHeight
  let calendar_bottom_max = (window.scrollY + table_rect.top) + table_rect.height

  //// viewport_bottom above calendar_bottom
  if (viewport_bottom_max < calendar_bottom_max) {
    if (menu_bottom_max > viewport_bottom_max) {
      menu_top = menu_top - (menu_bottom_max - viewport_bottom_max)
    }
  }
  //// calendar_bottom above viewport_bottom
  else {
    if (menu_bottom_max > calendar_bottom_max) {
      menu_top = menu_top - (menu_bottom_max - calendar_bottom_max)
    }
  }

  // cursor be in menu for easy ui
  menu_left -= 17
  menu_top  -= 17

  group.updateMenuPosition(menu_left, menu_top, menu_right_max, menu_bottom_max)
}

export async function generateWorkHourTimeSlot(date){
  let workhour_shop = {}
  let booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
  if(!isNullObject(booking_setup)){
    for(let i in booking_setup.booking_opening_hours_setup){
      let opening_hour = booking_setup.booking_opening_hours_setup[i]
      let days = opening_hour.opened_days_of_week
      let day_picker = Number(moment(date).format('d'))
      if (days.indexOf(day_picker) > -1) {
        workhour_shop.start_row = this.convertHoursToRow(opening_hour.start_time)
        workhour_shop.finish_row = this.convertHoursToRow(opening_hour.finish_time)
        break
      }
    }
  }
  return workhour_shop
}

export async function isBookingStartTimeExeedWorkHour(booking_date, booked_items){
  let tmp_shop_data = store.getters['user/getShop']
  let booking_setup = await cache_session.getBookingSetupCache(tmp_shop_data.shop_id)
  
  // one booking has many view-groups
  let tmp_groups = _.groupBy(booked_items, 'booking_resource_setup_id')
  for(let i in tmp_groups){
    let tmp_group = tmp_groups[i]
    let tmp_first_booked_item = _.cloneDeep(tmp_group[0])
    let tmp_first_booked_item_group = {
      row: 0,
      row_end: 0,
      booking_resource_setup_id: 0
    }

    let tmp_start_time = tmp_first_booked_item.is_next_day ? getTimeInclude24(tmp_first_booked_item.start_time) : tmp_first_booked_item.start_time
    tmp_first_booked_item_group.row = convertHoursToRow(tmp_start_time, booking_setup)
    tmp_first_booked_item_group.row_end = tmp_first_booked_item_group.row + 1
    tmp_first_booked_item_group.booking_resource_setup_id = tmp_first_booked_item.booking_resource_setup_id
    
    if(await exceedWorkHourViewGroup(booking_date, tmp_first_booked_item_group)){
      return true
    }
  }
  return false
}

export async function exceedWorkHourViewGroup(date, group) {
  let shop = store.getters['user/getShop']
  let booking_setup = await cache_session.getBookingSetupCache(shop.shop_id)
  let day_picker = Number(moment(date).format('d'))
  let date_picker = Number(moment(date).format('D'))
  let week_picker = Math.ceil(date_picker / 7)
  let date_format = moment(date).format(options.standard_date_format.ymd)
  let booking_opening_hours_setup = booking_setup.booking_opening_hours_setup
  let exceed = false
  
  if (!isNullObject(booking_setup) && !isNullObject(booking_opening_hours_setup) && !isNullObject(group)) {
    if (!isNullObject(date)) {
      // workhour_shop: repeat off days
      let repeated_off_days = booking_opening_hours_setup.repeated_off_days
      if (repeated_off_days.repeat_type == options.repeat_type.every_week) {
        if (repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
          exceed = true
          // console.log('workhour_shop: repeat off days & specific off days every_week')
        }
      }
      if(repeated_off_days.repeat_type == options.repeat_type.monthly){
        if(repeated_off_days.repeated_weeks.indexOf(week_picker) > -1){
          if(repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
            exceed = true
            // console.log('workhour_shop: repeat off days & specific off days monthly')
          }
        }
      }
      // workhour_shop: specific off days
      let specific_off_days = booking_opening_hours_setup.specific_off_days  
      for(let i in  specific_off_days){
        let off_day = specific_off_days[i]
        if (date_format == moment(off_day).format(options.standard_date_format.ymd)) {
          exceed = true
          // console.log(' workhour_shop:: specific_off_days')
        }
      }
      
      // workhour_shop: day in shop_opening_day
      let shop_opened_days = []
      let workhours_shop = []
      let opening_hours = booking_opening_hours_setup.opening_hours
      for (let i in opening_hours) {
        let opening_hour = opening_hours[i]
        let opened_days_of_week = opening_hour.opened_days_of_week

        if (opened_days_of_week.indexOf(day_picker) > -1) {
          let exceeds = []
          workhours_shop = generateWorkHourInDate(opening_hours, date, booking_setup)
          for (let ii in workhours_shop) {
            let workhour_shop = workhours_shop[ii]

            // console.log('workhour_shop: workhour in day', group.row, group.row_end,' | ', workhour_shop.start_row, workhour_shop.finish_row)
            if (group.row >= workhour_shop.start_row && group.row_end <= workhour_shop.finish_row) {
              exceeds.push(false)
            }
            else {
              exceeds.push(true)
            }
          }

          let exceeds_false = exceeds.filter(e => e == false)
          if (exceeds_false.length == 0) {
            exceed = true
            // console.log('workhour_shop: day in shop_opening_day', exceeds)
          }
        }
        shop_opened_days = shop_opened_days.concat(opened_days_of_week)
      }

      // workhour_shop: days not in shop_opened_days
      if (shop_opened_days.indexOf(day_picker) == -1) {
        exceed = true
        // console.log('workhour_shop: days not in shop_opened_days')
      }

      // workhour_resource
      let resources = booking_setup.booking_resources_setup.items.filter(r => r.id == group.booking_resource_setup_id)
      if (!isNullObject(resources) && resources.length > 0) {
        let resource = resources[0]

        // workhour_resource: specific off days
        for (let ii in resource.specific_off_days) {
          let resource_off_day = resource.specific_off_days[ii]
          let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
          if (date_format == resource_off_day_format) {
            exceed = true
            // console.log('workhour_resource: specific off days')
          }
        }

        // workhour_resource: day in shop_opening_day
        let resource_opened_days = []
        let workhours_resource = []
        let opening_hours = resource.opening_hours
        for (let ii in opening_hours) {
          let opening_hour = opening_hours[ii]
          let opened_days_of_week = opening_hour.opened_days_of_week

          if (opened_days_of_week.indexOf(day_picker) > -1) {
            let exceeds = []
            workhours_resource = generateWorkHourInDate(opening_hours, date, booking_setup)
            for (let iii in workhours_resource) {
              let workhour_resource = workhours_resource[iii]
              
              // console.log(group.row, group.row_end,' | ', workhour_resource.start_row, workhour_resource.finish_row)
              if (group.row >= workhour_resource.start_row && group.row_end <= workhour_resource.finish_row) {
                exceeds.push(false)
              }
              else {
                exceeds.push(true)
              }
            }
            let exceeds_false = exceeds.filter(e => e == false)
            if (exceeds_false.length == 0) {
              exceed = true
              // console.log('workhour_resource: day in shop_opening_day')
            }
          }
          resource_opened_days = resource_opened_days.concat(opened_days_of_week)
        }

        // workhour_resource: days not in resource_opened_days
        if (resource_opened_days.indexOf(day_picker) == -1) {
          exceed = true
          // console.log('workhour_resource: days not in resource_opened_days')
        }
      }
    }
    return exceed
  }
}

export function generateWorkHourInDate(opening_hours, date, booking_setup) {
  let workhours = []
  let day_of_calendar_date = Number(moment(date).format('d'))

  for (let i in opening_hours) {
    let opening_hour = opening_hours[i]
    let opened_days_of_week = opening_hour.opened_days_of_week
    if (opened_days_of_week.indexOf(day_of_calendar_date) > -1) {
      let tmp_finish_time = opening_hour.finish_time
      let tmp_finish_time_minutes = convertHoursToMinutes(tmp_finish_time)
      let tmp_start_time_minutes = convertHoursToMinutes(opening_hour.start_time)
      if (opening_hour.cross_date || tmp_finish_time_minutes < tmp_start_time_minutes) {
        tmp_finish_time = convertMinutesToHours(tmp_finish_time_minutes + options.minutes_of_24h)
      }
      let workhour = {
        start_row: convertHoursToRow(opening_hour.start_time, booking_setup),
        finish_row: convertHoursToRow(tmp_finish_time, booking_setup)
      }
      workhours.push(workhour)
    }
  }
  return workhours
}
export function generateWorkHourOfShop(opening_hours_setup) {
  let work_hours = {
    time_start: '00:00',
    time_finish: '00:00'
  }
  let time_finish_minutes = 0
  work_hours.time_start = _.head(_.sortBy(opening_hours_setup, 'start_time')).start_time
  let opening_cross_date = opening_hours_setup.filter(opening => opening.cross_date == true)
  if (opening_cross_date.length > 0) {
    time_finish_minutes = convertHoursToMinutes(_.last(_.sortBy(opening_cross_date, 'finish_time')).finish_time)
    time_finish_minutes += options.minutes_of_24h
  }
  else time_finish_minutes = (convertHoursToMinutes(_.last(_.sortBy(opening_hours_setup, 'finish_time')).finish_time))
  work_hours.time_finish = convertMinutesToHours(time_finish_minutes)
  return work_hours
}
export function getTimeOptionsByDate(date, resource_id, booking_setup) {
  let booking_opening_hours_setup     = booking_setup.booking_opening_hours_setup.opening_hours
  let day = Number(moment(date).format('d'))
  let opening_hours_by_day = []
  let work_hours = {}
  
  for(let i in booking_opening_hours_setup){
    let tmp_opening_hour = booking_opening_hours_setup[i]
    for(let j in tmp_opening_hour.opened_days_of_week){
      let tmp_day = tmp_opening_hour.opened_days_of_week[j]
      if(tmp_day == day){
        opening_hours_by_day.push(tmp_opening_hour)
      }
    }
  }
  if(opening_hours_by_day.length > 0)
    work_hours = generateWorkHourOfShop(opening_hours_by_day)
  return work_hours
}

export function getTimeInclude24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes < options.minutes_of_24h)
    to_time_minutes += options.minutes_of_24h
  return convertMinutesToHours(to_time_minutes)
}
export function getTimeSubtract24(time) {
  let to_time_minutes = convertHoursToMinutes(time)
  if (to_time_minutes >= options.minutes_of_24h)
    to_time_minutes -= options.minutes_of_24h
  return convertMinutesToHours(to_time_minutes)
}
export function isOffDateOfShop(date, booking_opening_hours_setup) {
  let is_off_date = false
  let day_picker = Number(moment(date).format('d'))
  let date_picker = Number(moment(date).format('D'))
  let week_picker = Math.ceil(date_picker / 7)
  let date_format = moment(date).format(options.standard_date_format.ymd)
  if (!isNullObject(booking_opening_hours_setup)) {
    let repeated_off_days = booking_opening_hours_setup.repeated_off_days
    if (repeated_off_days.repeat_type == options.repeat_type.every_week) {
      if (repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
        is_off_date = true
      }
    }
    if (repeated_off_days.repeat_type == options.repeat_type.monthly) {
      if (repeated_off_days.repeated_weeks.indexOf(week_picker) > -1) {
        if (repeated_off_days.repeated_days_of_week.indexOf(day_picker) > -1) {
          is_off_date = true
        }
      }
    }
    let specific_off_days = booking_opening_hours_setup.specific_off_days
    for (let i in specific_off_days) {
      let off_day = specific_off_days[i]
      if (date_format == moment(off_day).format(options.standard_date_format.ymd))
        is_off_date = true
    }
  }
  return is_off_date
}
export function isOffDay(date, resource_setup_id, booking_setup){
  let booking_opening_hours_setup     = booking_setup.booking_opening_hours_setup.opening_hours
  let booking_repeated_off_days_setup = booking_setup.booking_opening_hours_setup.repeated_off_days
  let booking_specific_off_days_setup = booking_setup.booking_opening_hours_setup.specific_off_days
  let booking_resources_setup         = booking_setup.booking_resources_setup.items
  
  let day_picker  = Number(moment(date).format('d'))
  let date_picker = Number(moment(date).format('D'))
  let date_formated = moment(date).format(options.standard_date_format.ymd)
  let week_picker = Math.ceil(date_picker/7)
  let is_off_day = false

  // shop: repeat off days
  if(booking_repeated_off_days_setup.repeat_type == options.repeat_type.every_week){
    if(booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
      is_off_day = true
      // console.log('shop: repeat off days - every_week')
    }
  }
  if(booking_repeated_off_days_setup.repeat_type == options.repeat_type.monthly){
    if(booking_repeated_off_days_setup.repeated_weeks.indexOf(week_picker) > -1){
      if(booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
        is_off_day = true
        // console.log('shop: repeat off days - monthly')
      }
    }
  }
  // shop: specific off days
  for(let i in booking_specific_off_days_setup){
    let off_day = booking_specific_off_days_setup[i]
    if(date_formated == moment(off_day).format(options.standard_date_format.ymd)) {
      is_off_day = true
      // console.log('shop: specific off days')
    }
  }

  // shop: workhour of day in shop_opening_day
  let shop_opened_days = []
  for(let i in booking_opening_hours_setup){
    let opening_hour = booking_opening_hours_setup[i]
    let opened_days_of_week = opening_hour.opened_days_of_week
    shop_opened_days = shop_opened_days.concat(opened_days_of_week)
  }

  // shop: days not in shop_opened_days
  if(shop_opened_days.indexOf(day_picker) == -1) {
    is_off_day = true
    // console.log('shop: days not in shop_opened_days')
  }
  
  // resource
  if(resource_setup_id != null && resource_setup_id != undefined && resource_setup_id != 0){
    for(let i in booking_resources_setup){
      let resource = booking_resources_setup[i]
      if(resource_setup_id === resource.id){
        // resource: specific off days
        for(let ii in resource.specific_off_days){
          let resource_off_day = resource.specific_off_days[ii]
          let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
          if(date_formated == resource_off_day_format) {
            is_off_day = true
            // console.log('resource: specific off days')
          }
        }
  
        // resource: workhour of day in shop_opening_day
        let resource_opened_days = []
        for(let ii in resource.opening_hours){
          let opening_hour = resource.opening_hours[ii]
          let opened_days_of_week = opening_hour.opened_days_of_week
          resource_opened_days = resource_opened_days.concat(opened_days_of_week)
        }
  
        // resource: days not in resource_opened_days
        if(resource_opened_days.indexOf(day_picker) == -1) {
          is_off_day = true
          // console.log('resource: days not in resource_opened_days')
        }
      }
    }
  }
  
  return is_off_day
}
export function isAmOrPm(total_minutes, zero_in_hour = true) {
  let minutes_of_half_day = 720
  let tmp_total_minutes = total_minutes

  if (tmp_total_minutes >= options.minutes_of_24h)
    tmp_total_minutes -= options.minutes_of_24h

  let total_half_day_minute = tmp_total_minutes
  if (tmp_total_minutes >= minutes_of_half_day + 60) {
    total_half_day_minute -= minutes_of_half_day
  }

  let time_text = convertMinutesToHours(total_half_day_minute, false, zero_in_hour)

  if (tmp_total_minutes < minutes_of_half_day) return time_text + ' AM'
  if (minutes_of_half_day <= tmp_total_minutes) return time_text + ' PM'
}
export function logTime() {
  let date = new Date()
  return date.getSeconds() + '.' + date.getMilliseconds()
}
export function getDatePickerMin(date_picked) {
  return moment(date_picked).subtract(1, 'month').toDate()
}
export function getDatePickerMax(date_picked) {
  return moment(date_picked).add(1, 'year').toDate()
}
export async function calculatePaymentMethodName(booking) {
  let payment_method_name = ''
  if (booking.fields.booking_deposit.deposit_type == options.deposit_type.paid) {
    let shop = store.getters['user/getShop']
    let payment_method_options = await cache_session.getPaymentMethodSetupCache(shop.shop_id)
    for (let i in payment_method_options) {
      if (payment_method_options[i].id == booking.fields.booking_deposit.payment_method_id) {
        payment_method_name = payment_method_options[i].name
        break
      }
    }
  }
  return payment_method_name
}

export function limitFinishingTimeOfBookedItem(booked_item) {
  if (booked_item.processing_time > 0 && booked_item.finishing_time < 5) booked_item.finishing_time = 5
  if (booked_item.processing_time == 0 && booked_item.finishing_time < 0) booked_item.finishing_time = 0
  return booked_item
}
export function isExceedMaxCalendarCols(dates_on_calendar, resources_by_date){
  let max_calendar_col = options.calendar_max_cols
  let tmp_calendar_col = dates_on_calendar * resources_by_date
  if(dates_on_calendar > 1 && tmp_calendar_col > max_calendar_col) 
    return true

  return false
}
export function getLastTimeSlotToBooking(work_hour_finish, booking_time_slot){
  return convertMinutesToHours(convertHoursToMinutes(work_hour_finish) - booking_time_slot)
}

export function emptyValue(value){
  let empty = false
  
  if(value === undefined || value === null || value === '' || value.match(/^ *$/) !== null) empty = true
  else if(typeof value == 'object' && value.length == 0) empty = true
  else empty = false

  return empty
}

/*
  Input  : array, value
  Output : text  
  Exp : arr = [
    {value :  1 , text : 'value 1'},
    {value :  2 , text : 'value 2'}
  ]
  (arr,1) => 'value 1'  
*/
export function getTypeNameOfArray(arr,value){
  let text = ''
  let type = _.find(arr,x => x.value == value)
  if (type != undefined){
    text = i18n.t(type.text)
  }
  return text
}

export function formatSize(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
}

export function cookieAction(vue, cookie_action, key, expiry_date = null, value = null) {
  if(cookie_action == options.cookie_action.exist)
    return vue.$cookies.isKey(key)
  else if(cookie_action == options.cookie_action.set)
    vue.$cookies.set(key, value, expiry_date)
  else if(cookie_action == options.cookie_action.remove)
    vue.$cookies.remove(key)
  else if(cookie_action == options.cookie_action.get)
    return vue.$cookies.get(key)
}

export function roundNumberByDecimal(number, decimal = 0) {
  let factor = Math.pow(10, decimal)
  let tmp_number = Math.round(number * factor) / factor
  return tmp_number
}

export function convertHtmlToTxt(html) { // mapFieldsFromApi
  let txt = html
  txt = txt.replace(/&#34/g, '"')
  return txt
}

export function convertTxtToHtml(txt) { // mapFieldsToApi
  let html = txt
  html = html.replace(/"/g, '&#34')
  return html
}

export function hideMobilePhone(number) {
  if(number == null || number.length <= 4) return number
  if(number.length>4) return '*******' + number.substring(number.length-4, number.length)
}

export function hiddenInformation()
{
  return '**********'
} 

export function getHideClientInfoPermission(contact_info_to_manager, contact_info_to_staff, registration_date) {
  let user = store.getters['user/getUser']
  let shop = store.getters['user/getShop']
  let is_hide = false

  if(user.user_role_code==options.user_roles.manager)
  {
    if(contact_info_to_manager==options.clients_enums.contact_info_hiding_type.hideall) is_hide = true

    if(contact_info_to_manager==options.clients_enums.contact_info_hiding_type.hide_except_registered_today) 
    {
      if(!isClientRegisteredToday(registration_date, shop.timezone)) is_hide = true
    }
  }
  if(user.user_role_code==options.user_roles.staff)
  {
    if(contact_info_to_staff==options.clients_enums.contact_info_hiding_type.hideall) is_hide = true
    
    if(contact_info_to_staff==options.clients_enums.contact_info_hiding_type.hide_except_registered_today)
    {
      if(!isClientRegisteredToday(registration_date, shop.timezone)) is_hide = true
    }
  }
  return is_hide
}

export function isClientRegisteredToday(registration_date, timezone)
{
  let is_registered_today = true
  let today_date = formatDate(convertDateFromUtcToTimezone(new Date(), timezone))
  let new_format_registration_date = formatDate(convertDateFromUtcToTimezone(registration_date, timezone))
  if(registration_date == undefined || today_date!=new_format_registration_date)
    is_registered_today = false
  return is_registered_today
} 

export function showUserRoles(user_role)
{
  if(user_role==options.user_roles.admin_master)
    return i18n.t('user-roles.admin-master')
  if(user_role==options.user_roles.master)
    return i18n.t('user-roles.master')
  if(user_role==options.user_roles.staff)
    return i18n.t('user-roles.staff')
  if(user_role==options.user_roles.manager)
    return i18n.t('user-roles.manager')
} 

export function calculateShopTotalMonthlyFee(shop_solution_amount, shop_total_extra_amount, shop_discount_amount, is_include_extra_fees=true) {
  let shop_total_monthly_fee = 0
  if(is_include_extra_fees)
    shop_total_monthly_fee = shop_solution_amount + shop_total_extra_amount - shop_discount_amount
  else shop_total_monthly_fee = shop_solution_amount - shop_discount_amount
  return shop_total_monthly_fee   
}

export function equalObject(object_1, object_2) {
  return _.isEqual(object_1, object_2)
}

export function isMobile(phoneNum) 
{ 
  var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/
  if(regExp.test(phoneNum))
  { 
    regExp.exec(phoneNum)
    return true
  } else return false 
}