/*****************************
VALIDATION RULE FOR VIEW-MODEL
------------------------------
validations = {
  price: {
    label:'services.price',
    rules: {
      require: '',
      numeric: '',
      minValue: {
        min_value: 0
      },
      maxValue: {
        max_value: 9999999999
      }, 
    }
  },
  salary_sales: { 
    label:'services.salary-sales',
    rules: {
      numeric: '',
      customRule: {
        message: 'validate_messages.salary',
        process(model) {  
          if(model.salary_sales_type == SALARY_TYPE.PERCENT) {
            if(model.salary_sales < 0 || model.salary_sales > 100) return false
          }
          if(model.salary_sales_type == SALARY_TYPE.AMOUNT) {
            if(model.salary_sales < 0 || model.salary_sales > 9999999999) return false
          }
          return true
        }
      }
    }
  },
  items: {
    label:'packages.items',
    rules: {
      customRule: {
        message: [
          {
            key: [{ key1: 'packages.prepaid_card'', translate: true }, { key2: 1, translate: false }, ...],
            message: 'validate_messages.package_prepaid_card'
          },
          {
            key: [{ key1: 'packages.prepaid_service', translate: true }, { key2: 3, translate: false }, ...],
            message: 'validate_messages.package_prepaid_service'
          }
        ],
        process(model) {
          ...
        }
      }
    }
  }
}
*****************************/ 

import i18n from '../translate/translate.js'
import { COUNTRY } from '../config/constant'

function emptyValue(value){
  let empty = false
  
  if(value === undefined || value === null || value === '') empty = true
  else if(typeof value == 'object' && value.length == 0) empty = true
  else empty = false
  
  return empty
}

const rules = {
  errors: [],

  // define validate rules
  _default(f){
    this.getDynamicMessage(f, '_default')
  },
  require(f){
    if(emptyValue(f.value) || (f.rules.numeric != undefined && f.value == 0)) this.getDynamicMessage(f, 'require')
  },
  numeric(f){
    if(/^-?[0-9]{1,3}(,?[0-9]{3})*(\.?[0-9]{1,6})*$/.test(f.value) == false) this.getDynamicMessage(f, 'numeric')
  },
  numbers(f){
    if(/^[0-9+]*$/.test(f.value) == false) this.getDynamicMessage(f, 'number')
  },
  email(f){
    if(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(f.value) == false) this.getDynamicMessage(f, 'email')
  },
  engNumeric(f){
    if(/^[A-Za-z0-9+]*$/.test(f.value) == false) this.getDynamicMessage(f, 'engNumeric')
  },
  maxLength(f){
    if(typeof f.value == 'number') f.value = f.value.toString()
    if(f.value.length > Number(f.options.max_value)) this.getDynamicMessage(f, 'maxLength')
  },
  minLength(f){
    if(f.value.length < Number(f.options.min_value)) this.getDynamicMessage(f, 'minLength')
  },
  minValue(f){
    if(f.value < Number(f.options.min_value)) this.getDynamicMessage(f, 'minValue')
  },
  maxValue(f){
    if(f.value > Number(f.options.max_value)) this.getDynamicMessage(f, 'maxValue')
  },
  between(f){
    if(f.value < Number(f.options.min_value) || f.value > Number(f.options.max_value)) this.getDynamicMessage(f, 'between')
  },
  decimalLength(f){
    let decimal_length = String(f.value).substring(String(f.value).indexOf('.') + 1).length
    if(decimal_length > Number(f.options.decimal_value) && String(f.value).length != decimal_length) this.getDynamicMessage(f, 'decimalLength')
  },
  password(f){
    let flag = true

    if(f.value.length < 8 || f.value.length > 20) flag = false
    else if(f.value.length == 8 || f.value.length == 9){
      if(/(?=.*[a-zA-Z]{1,9})(?=.*\d{1,9})(?=.*[~`!@#$%^&*()-+=]{1,9}).{8,9}$/.test(f.value) == false) flag = false
    } else if (f.value.length >= 10 && f.value.length <= 20){
      if(/(?=.*[a-zA-Z]{1,20})(?=.*\d{1,20})(?=.*[~`!@#$%^&*()-+=]{0,20}).{10,20}$/.test(f.value) == false) flag = false
    }

    if(!flag) this.getDynamicMessage(Object.assign({}, f), 'password')
    if(f.value != f.options.equal_data && f.options.equal) this.getDynamicMessage(f, 'password-match')
  },
  userID(f){
    let flag = true

    if(f.value.length < 6 || f.value.length > 16) flag = false
    else {
      if(/^(?!\d+$)\w{6,16}$/.test(f.value) == false) flag = false
    } 
    if(!flag) this.getDynamicMessage(f, 'userID')
  },

  // tranform validate-message to dynamic
  getDynamicMessage(f, rule){
    let message = i18n.getLocaleMessage(i18n.locale).validate_messages[rule]
    if(f.label != undefined && f.label != null && f.label != '' ) f.label = i18n.t(f.label)
    else f.label = f.name.replace(/_/g, ' ')
    
    if(typeof f.options == 'object'){
      if(f.options.message) message = i18n.t(f.options.message)
      if(f.options.min_value || f.options.min_value === 0) message = message.replace(/{min_value}/g, f.options.min_value)
      if(f.options.max_value) message = message.replace(/{max_value}/g, f.options.max_value)
      if(f.options.decimal_value) message = message.replace(/{decimal_value}/g, f.options.decimal_value)
    }

    if(this.errors[f.name] == undefined)
      return this.errors[f.name] = message.replace(/{field}/g, '<span>' + f.label + '</span>')
    else
      return this.errors[f.name] += message.replace(/{field}/g, '<br><span>' + f.label + '</span>')
  },
  mobilePhone(f){
    if(f.options.country==COUNTRY.KR)
    {
      if(/^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/.test(f.value) == false) this.getDynamicMessage(f, 'mobile-number-kr')
    }
    else
    {
      if(/^\d{0,12}$/.test(f.value) == false) this.getDynamicMessage(f, 'mobile-number-other-country')
    }
  },
  phone(f){
    if(f.options.country == COUNTRY.KR)
    {
      if(/^(02|0[3-9]{1}[0-9]{1})[0-9]{3,4}[0-9]{4}$/.test(f.value) == false) this.getDynamicMessage(f, 'phone-number-kr')
    }
    else
    {
      if(/^\d{0,20}$/.test(f.value) == false) this.getDynamicMessage(f, 'phone-number-other-country')
    }
  },
  postcode(f){
    if(f.options.country== COUNTRY.KR)
    {
      if(/^\d{0,5}$/.test(f.value) == false) this.getDynamicMessage(f, 'postcode-kr')
    }
    else
    {
      if(f.value.length > 20 || /^[A-Za-z0-9+]*$/.test(f.value) == false) this.getDynamicMessage(f, 'postcode-other-country')
    }
  }
}

export default class Validator {
  constructor(){
    this.model = {}
    this.errors = []
  }
  
  setModel(data){
    for(let field in data){
      if(typeof data[field] == 'string') data[field] = data[field].trim()
      this.model[field] = data[field]
    }
  }
  validate(validations){
    rules.errors = []
    this.errors = []
    
    // field
    for(let field in validations){
      // not require & empty value then ignore
      if(validations[field].rules.require == undefined && emptyValue(this.model[field])) continue
      
      // field-rules-rule
      for(let rule in validations[field].rules){
        // defined-rule
        if(rules[rule] != undefined){
          // set field, label, options, value to create message
          let f = {
            name: field,
            label: validations[field].label,
            options: validations[field].rules[rule],
            value: this.model[field],
            model: this.model,
            rules: validations[field].rules
          }
          // require & empty value call require
          if(validations[field].rules.require != undefined && emptyValue(this.model[field])) {
            if(rule == 'require') rules.require(f)
            continue
          }
          else rules[rule](f)
        }
        // custom-rule
        else {
          let customRule = validations[field].rules[rule]
          // check custom rule & set field, label, options to create message
          let f = {
            name: field,
            label: validations[field].label,
            options: validations[field].rules[rule],
            rules: validations[field].rules
          }
          if(!customRule.process(this.model, this.model[field])) {
            if(!emptyValue(customRule.message)) {
              if(typeof customRule.message == 'object'){
                for(let m in customRule.message){
                  let tmp = i18n.t(customRule.message[m].message)
                  // generate message by {key}
                  if(typeof customRule.message[m].key == 'object') {
                    for(let k in customRule.message[m].key){
                      let mark = 'key' + (Number(k) + 1)
                      let mark_replace = customRule.message[m].key[k][mark]
                      if(customRule.message[m].key[k].translate) mark_replace = i18n.t(mark_replace)

                      tmp = tmp.replace('{' + mark + '}', mark_replace)
                    }
                  }
                  rules.errors[f.name] = tmp.replace(/{field}/g, '<span>' + i18n.t(validations[field].label) + '</span>')
                }
              }
              else rules.errors[f.name] = i18n.t(customRule.message).replace(/{field}/g, '<span>' + i18n.t(validations[field].label) + '</span>')
            }
            else rules._default(f)
          }
        }
      }
    }
    // error messages
    for(let message in rules.errors){
      this.errors.push(rules.errors[message])
    }
    return this.errors
  }
}