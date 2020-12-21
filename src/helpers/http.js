import axios from 'axios'
import store from '../store/store'
import i18n  from '../translate/translate'
import { options } from '../helpers/options'
import { inventory_options } from '../helpers/options/inventory-options'

import moment from 'moment'

const esc = encodeURIComponent
const DEFAULT_HEADERS = { 
  'Content-Type': 'application/json',
  'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
  'Accept': 'application/json'
}

const tag_date = '#date'
const tag_resources = '#resources'
const tag_performances = '#performances'

export default class Http {
  getHeaders(header_parameters = {}) {
    let default_headers = DEFAULT_HEADERS
    let api_token = store.getters['user/getUser']['api_token']
    if(api_token) {
      default_headers = {
        'Authorization': `Bearer ${api_token}`,
        ...default_headers,
        ...header_parameters
      }
    }
    
    return default_headers
  }
  processAPIErrors(apiErrors) {
    let errors = {} 
    if(apiErrors) {
      for (let key of Object.keys(apiErrors)) {
        let err = apiErrors[key]

        errors[key] = err

        if (typeof err === Object || err.hasOwnProperty('length')) {
          errors[key] = apiErrors[key][0]
        }
      }
    }
    return errors
  } 
  qs(params) {
    return (
      Object
        .keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&')
    )
  } 
  post(uri, data, header_parameters) { 
    return axios.post(uri, data, {
      headers: this.getHeaders(header_parameters) 
    }).catch(e => this.setError(e) ) 
  }
  get(uri) { 
    return axios.get(uri, {
      responseType: 'blob',
      headers: this.getHeaders() 
    }).catch(e => this.setError(e) ) 
  }   
  donwload(uri, data) { 
    return axios.post(uri, data, {
      responseType: 'blob',
      headers: this.getHeaders() 
    }).catch(e => this.setError(e) ) 
  }   
  put(uri, data, header_parameters) {
    return axios.put(uri, data, {
      headers: this.getHeaders(header_parameters) 
    }).catch(e => this.setError(e)) 
  }  
  delete(uri, data, header_parameters) {
    return axios.delete(uri, {
      headers: this.getHeaders(header_parameters), 
      data:data
    }).catch(e => this.setError(e)) 
  }
  setError(error){
    let response = undefined
    if(error.response != undefined){
      response = error.response
      if(typeof response.data != 'object'){ // in cases header errors, not response data
        if(error.response.status == 401){
          window.location = '/#/login'
        }
        response.data = {
          data : null,
          errorMessages : [error],
          isOK : false 
        }
      }
    }
    else {
      response = { 
        data: {
          data : null,
          errorMessages : [error.message],
          isOK : false 
        }
      }
    }
    return response
  }
  // get(uri, data = {}) {
  //   if (Object.keys(data).length > 0) {
  //     uri = `${uri}?${this.qs(data)}`
  //   }
  //   return axios.get(uri, {
  //     headers: this.getHeaders() 
  //   })
  // }
  // upload(uri, data) {
  //   return fetch(uri, {
  //     headers: this.getHeaders(true),
  //     cors: true,
  //     method: 'POST',
  //     body: data
  //   })
  // }
  loadError(error){
    let e = {
      data : null,
      error_messages : [error.message],
      is_ok : false
    }
    return e
  }
  mapErrorsFromApi(api_errors){
    let error_messages = []

    if(api_errors){
      for(let api_error of api_errors){
        let error_message = ''
        if(api_error.errorCode)
          error_message = this.generateMessageBaseErrorCode(api_error)
        else
          error_message = api_error

        error_messages.push(error_message)
      }
    }
    return error_messages
  }
  generateMessageBaseErrorCode(api_error){
    let message = api_error.errorMessage
    let replace_tags = []
    
    // BOOKING SETUP
    if(api_error.errorCode == options.booking.booking_setup_error_codes.rs05c) {
      replace_tags = []
      message = this.getErrorMessage('booking-resources.staff-assigned-only-one-resource', replace_tags, api_error)
    }

    // BOOKING
    if(api_error.errorCode == options.booking.booking_error_codes.bk15c) {
      replace_tags = []
      message = this.getErrorMessage('bookings.resource-not-selected', replace_tags, api_error)
    }
    // reference from exceedWorkHourCalendarCell
    // workhour shop
    if(api_error.errorCode == options.booking.booking_error_codes.bk44c) { 
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk45c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk35c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk36c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.booking_error_codes.bk46c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk47c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk48c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.booking-exceed-resource-workhour', replace_tags, api_error)
    }
    // duplicate
    if(api_error.errorCode == options.booking.booking_error_codes.bk49c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.selected-time-had-5-duplicated-bookings', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk30c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-duplicate-with-another-bookings', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.booking_error_codes.bk31c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.booking-duplicate-with-blocked-time', replace_tags, api_error)
    }
    // moving multi-resources booking
    if(api_error.errorCode == options.booking.booking_error_codes.bk52c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.multi-resources-booking-can-not-moving-to-other-date', replace_tags, api_error)
    }
    // resource can not perform service BK43C
    if(api_error.errorCode == options.booking.booking_error_codes.bk43c){
      replace_tags = [tag_date, tag_performances]
      message = this.getErrorMessage('bookings.resources-can-not-perform-selected-services', replace_tags, api_error)
    }

    // WAITING
    // workhour shop
    if(api_error.errorCode == options.booking.waiting_error_codes.wt15c){
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt16c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt17c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt18c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.waiting-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.waiting_error_codes.wt19c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt20c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.waiting_error_codes.wt21c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.waiting-exceed-resource-workhour', replace_tags, api_error)
    }

    // BLOCKED TIME
    // workhour shop
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt11c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-shop-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt12c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-shop-repeated-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt13c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-selected-day-is-not-shop-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt14c) {
      replace_tags = [tag_date]
      message = this.getErrorMessage('bookings.blocked-time-exceed-shop-workhour', replace_tags, api_error)
    }
    // workhour resource
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt17c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-selected-date-is-resource-specific-off-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt18c){
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-selected-day-is-not-resource-working-day', replace_tags, api_error)
    }
    if(api_error.errorCode == options.booking.blocked_time_error_codes.bt19c) {
      replace_tags = [tag_date, tag_resources]
      message = this.getErrorMessage('bookings.blocked-time-exceed-resource-workhour', replace_tags, api_error)
    }

    // INVENTORY
    if(api_error.errorCode == inventory_options.error_codes.stock_adjustment.saj07c) {
      replace_tags = []
      message = this.getErrorMessage('stock-adjustment.stock-on-hand-not-lastest', replace_tags, api_error)
    }

    return message
  }
  getErrorMessage(error_message, replace_tags, api_error){
    let message = i18n.t(error_message)

    for(let i in replace_tags){
      let replace_tag = replace_tags[i]
      let replace_tag_value = ''
      for(let j in api_error.errorValues){
        let error_value = api_error.errorValues[j]
        let break_value_index = error_value.indexOf(':')
        let key_txt = error_value.substring(0, break_value_index)
        let content_txt = error_value.substring(break_value_index + 2, error_value.length)
        
        if(replace_tag == tag_date && (key_txt == 'dateTS' || key_txt == 'bookingDateTS')){
          replace_tag_value = this.getErrorDate(content_txt)
        }
        if(replace_tag == tag_resources && key_txt == 'resourceName'){
          replace_tag_value = this.getErrorResources(content_txt)
        }
        if(replace_tag == tag_performances && key_txt == 'performanceResources')
          replace_tag_value = this.getErrorPerformances(content_txt)
      }
      message = message.replace(replace_tag, replace_tag_value)
    }
    
    return message + '<span class="hide">' + api_error.errorCode + '</span>'
  }
  getErrorDate(content_txt){
    return moment(new Date(Number(content_txt) * 1000)).format(options.standard_date_format.ymd)
  }
  getErrorResources(content_txt){
    return this.addSpaceToListName(content_txt)
  }
  getErrorPerformances(content_txt){
    content_txt = content_txt.substring(0, content_txt.length - 4)
    let tmp_performances = content_txt.split('@--@')
    let txt_performances = []
    for(let i in tmp_performances){
      let tmp_performance = tmp_performances[i]

      if(i == 0){
        tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
        tmp_performance = this.addSpaceToListName(tmp_performance)
        txt_performances.push(tmp_performance)
      }
      else {
        let tmp_performance_array = tmp_performance.split('@:@')
        let tmp_resource_name = tmp_performance_array[0].trim()
        let tmp_services_name = tmp_performance_array[1]

        let last_performance   = txt_performances[txt_performances.length - 1]
        let last_resource_name = last_performance.split(' ➞ ')[0].trim()

        if(tmp_resource_name == last_resource_name){
          last_performance += ', ' + tmp_services_name
          txt_performances[txt_performances.length - 1] = last_performance
        }
        else {
          tmp_performance = tmp_performance.replace('@:@', ' ➞ ')
          tmp_performance = this.addSpaceToListName(tmp_performance)
          txt_performances.push(tmp_performance)
        }
      }
    }

    tmp_performances = []
    for(let i in txt_performances){
      let txt_performance = txt_performances[i]
      txt_performance = '<small><span>' + txt_performance + '</small>'
      txt_performance = txt_performance.replace(' ➞ ', ' </span>➞ ')
      tmp_performances.push(txt_performance)
    }
    return tmp_performances.join('')
  }
  addSpaceToListName(text){
    return text.replace(/,/g, ', ')
  }
}