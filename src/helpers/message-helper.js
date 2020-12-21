import { options }       from '../helpers/options'

export default class MessageHelper {
  constructor(message_type, max_bytes) {
    this.message_type = message_type
    this.max_bytes = max_bytes

    this.is_long_text = (this.message_type == options.messages_enums.message_type.lms || this.message_type == options.messages_enums.message_type.mms) ? true : false 
  }

  //insert characters
  insertAtCaret(obj, string) { 
    obj.focus()
    if (typeof (document.selection) != 'undefined') {
      var range = document.selection.createRange()
      if (range.parentElement() != obj) return
      range.text = string
      range.select()
    } else if (typeof (obj.selectionStart) != 'undefined') {
      var start = obj.selectionStart
      obj.value = obj.value.substr(0, start)
        + string
        + obj.value.substr(obj.selectionEnd, obj.value.length)
  
      start += string.length
      obj.setSelectionRange(start, start)
    } else {
      obj.value += string
    }
    
    obj.focus()  
    return obj.value
  }

  //check length 
  check_len(area, fn_SmsToLms) {
    let sInputStr = area.value
    let nStrLen = this.calculate_byte(sInputStr)    
    let maxLen = this.max_bytes
    let tmpStr=''

    if ( nStrLen > maxLen ) {
      tmpStr = this.cut_str(sInputStr,maxLen)
      //console.log ('check_len..', this.is_long_text, maxLen)

      if (this.is_long_text) {
        window.alert( // todo kkh : translate 
          //'장문 전송가능 글자수가 초과되었습니다 (최대 한글 1000자, 영문 2000자)'
          `Maximum number of characters exceeded(${parseInt(maxLen / 2, 10)}, Englinsh ${maxLen})`
        )
      } else if (typeof (fn_SmsToLms) == 'function') { // if there as function (from Short(SMS) => to Long(LSM) :  단문->장문 전환 함수가 있을경우
        if (confirm(
          //'단문 발송 가능 건수(최대 한글42자, 영문85자)를 초과해서 무료수신번호를 삽입할 수 없습니다.\n\n' +
          //'장문서비스(LMS)를 사용하시겠습니까?("한글 최대 1000자" 까지 가능)'
          `Short text exceeded the possible numbre of characters(${parseInt(maxLen / 2, 10)}, Englinsh ${maxLen}). So can not insert toll free number.\n\n` +
          'Do you want to use [Long message system(LMS)]?' //(capable of maximum Korean ${parseInt(maxLen / 2, 10)}, Englinsh ${maxLen} characters)?
        )) {
          let options = { msg: sInputStr, size: nStrLen, area: area }
          fn_SmsToLms(options)
          return
        }
      } else {
        window.alert(
          //'단문 발송 가능 건수(최대 한글42자, 영문85자)를 초과해서 무료수신번호를 삽입할 수 없습니다.\n\n' +
          //'장문의 글자를 입력, 전송하시려면 "한글 최대 1000자" 까지 입력할 수\n' +
          //'있는 [장문보내기(LMS)] 서비스를 이용하여 주십시오!'
          `Short text exceeded the possible numbre of characters(${parseInt(maxLen / 2, 10)}, Englinsh ${maxLen}). So can not insert toll free number.\n\n` +
          'If you want to send long text, please use [Long message system(LMS)]!' //that is capable of maximum Korean 1000 characters
        )
      }

      nStrLen = this.calculate_byte(tmpStr)
    } else {
      tmpStr = area.value
    }
    return {value: tmpStr, length: nStrLen }
  }

  //
  calculate_byte( sTargetStr ) {
    let sTmpStr= new String(sTargetStr)
    let nOriginLen = sTmpStr.length    
    let sTmpChar=''    
    let nStrLength = 0

    for ( let i=0 ; i < nOriginLen ; i++ ) {
      sTmpChar = sTmpStr.charAt(i)

      if (escape(sTmpChar).length > 4) {
        nStrLength += 2
      } else if (sTmpChar != '\r') {  //  don't count CR  (if CR+LF (IE)  -> count onl LF)
        nStrLength ++
      }      
    }	
    return nStrLength
  }

  //cut string by bytes
  cut_str(sTargetStr, nMaxLen) {
    let sTmpStr=new String(sTargetStr)
    let nOriginLen = sTmpStr.length
    
    let sTmpChar=''    
    let nStrLength = 0
    
    //3179: 광고성문자표기의무사항 검사 2015-08-17
    if (sTmpStr.search('무료수신거부') > -1) {
      sTmpStr = sTmpStr.substring(0, sTmpStr.search('무료수신거부'))
    }

    let i=0
    for (i = 0; i < nOriginLen; i++) {
      sTmpChar = sTmpStr.charAt(i)

      if (escape(sTmpChar).length > 4) { //if korean 
        nStrLength += 2
      } else if (sTmpChar != '\r') {  // don't count CR  (if CR+LF (IE)  -> count only LF)
        nStrLength ++
      }

      if (nStrLength > nMaxLen) {  // exceed maximun length       
        if (
          (sTmpStr.charAt(i - 1) == '\r' && sTmpStr.charAt(i) == '\n') // if exceed with CR+LF로(\r\n)
        ) {                
          i = i - 1 
        }            
        break
      }
    }
    return sTmpStr.substring(0, i)
  }
}