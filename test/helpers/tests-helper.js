export default class TestHelper {
  
  static generateMaxLength(length,  strChar) {
    var str =''
    if (strChar == undefined) return str
    for (var i = 0; i < length; i++) {
      str = str + strChar
    }
    return str
  }

  static generateMaxLengthHasBeforeAndAfter(length, strChar, strBefore, strAfter) {
    var str = strBefore

    if (strChar == undefined) return str
    for (var i = 0; i < length; i++) {
      str = str + strChar
    }
    return str + strAfter
  }
}