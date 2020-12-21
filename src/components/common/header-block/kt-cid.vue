<template>
  <div style="position: absolute;">
    <object id="ahaMacCtrl" classid="CLSID:FDEC6389-11B2-4FC6-B7B9-FC6E05F92AB3" codebase="ahaMAC.cab#version=1,0,0,1" 
            style="width:100px;height:20px;"/>
    <object id="KTOpenAPIX" classid="CLSID:16AB1B2A-A22E-4FAC-92CB-84102DF5CE3D" />
  </div>
</template>

<script>
import component_base from '../../common/component-base/component-base'
import { mapMutations } from 'vuex'
export default {
  extends: component_base,
  props: {
    login_id: {
      type: String,
      default: ''
    },
    login_pw: {
      type: String,
      default: ''
    },
    set_mac_address:{
      type: String,
      default: ''
    }
  },
  data(){
    return {
      isSupportedActiveXBrowser: false,
      version: '',
      login_YN: 'N',
      ktcid_loginyn: false,
      mac_address: '',
    }
  },
  mounted() {
    if(this.isSupportedActivex())
    {
      this.checkMacAddress()
      this.initConnectEvent()
      this.initGetLoginEvent()
      this.initGetCallEvent()
      this.initSendCallEvent()
      //this.connec()

    }
    else this.sendLoginResult()
  },
  methods: {
    ...mapMutations('mac_address',[
      'setMacAddresses'
    ]),
    isSupportedActivex(){
      if(window.ActiveXObject || 'ActiveXObject' in window){
        this.isSupportedActiveXBrowser=true
        return true
      }else{
        this.isSupportedActiveXBrowser=false
        this.ktcid_loginyn = false
        return false
      }
    },
    initConnectEvent () {
      var scriptStr = document.createElement('script')
      scriptStr.setAttribute('for', 'KTOpenAPIX')
      scriptStr.event = 'EventConnect(nResult)'
      scriptStr.appendChild(document.createTextNode('activeXListener.connectEvent(nResult)'))
      document.body.appendChild(scriptStr)
      window.activeXListener = this
    },
    initGetLoginEvent () {
      var scriptStr = document.createElement('script')
      scriptStr.setAttribute('for', 'KTOpenAPIX')
      scriptStr.event = 'EventLogin(nResult)'
      scriptStr.appendChild(document.createTextNode('activeXListener.getLogin(nResult)'))
      document.body.appendChild(scriptStr)
      window.activeXListener = this
    },
    initGetCallEvent () {
      var scriptStr = document.createElement('script')
      scriptStr.setAttribute('for', 'KTOpenAPIX')
      scriptStr.event = 'EventCID(sCaller, sCallee, sResult, sDBID, sMiSeqno)'
      scriptStr.appendChild(document.createTextNode('activeXListener.phonecall(sCaller, sCallee, sResult, sDBID, sMiSeqno)'))
      document.body.appendChild(scriptStr)
      window.activeXListener = this
    },
    initSendCallEvent () {
      var scriptStr = document.createElement('script')
      scriptStr.setAttribute('for', 'KTOpenAPIX')
      scriptStr.event = 'EventCTC(sCaller, sCallee, sResult, sMiSeqno)'
      scriptStr.appendChild(document.createTextNode('activeXListener.sendCallEvent(sCaller, sCallee, sResult, sMiSeqno)'))
      document.body.appendChild(scriptStr)
      window.activeXListener = this
    },
    connectEvent(nResult){
      console.log(nResult)
      //alert('네트워크접속상태 통지 이벤트: ' + nResult)
    },
    getver(){
      this.version =  document.all.KTOpenAPIX.GetApiVer()
    },
    phonecall(sCaller, sCallee, sResult) {
      if (sResult == '201') {

        try {
          var cid_len = sCaller
          this.showPopup(cid_len)
        } catch (e) { alert(e) }
      }
    },
    //전화걸기(발신번호-shop의 phone number, 수신번호)
    sendCall(calling_num, send_call_num){
      if(this.isSupportedActivex())
      {
        var result = document.all.KTOpenAPIX.SendCTC(calling_num, send_call_num)
        switch (result) {
          case 2000: alert('로그인 되어있지 않습니다')
            break
          case 3000: alert('수신/발신 번호가 동일합니다')
            break
          case 3001: alert('수신번호 오류(자리수 최소 8자리)')
            break
          case 4002: alert('전화걸기를 할 수 있는 전화번호가 아닙니다')
            break
          case 4101: alert('핸드폰에 전화를 걸 권한이 없습니다')
            break
          case 4102: alert('국제전화를 걸 권한이 없습니다')
            break
          case 4103: alert('시내전화를 걸 권한이 없습니다')
            break
          case 4104: alert('시외전화를 걸 권한이 없습니다')
            break
          case 0: alert('로그인 되어있지 않습니다')
            break
        }
        //alert('전화걸기결과: '+ result)
      }
      else alert('전화걸기를 사용할수 없습니다')
         
    },
    sendCallEvent(sCaller, sCallee, sResult){
      // var CTC =''
      // CTC   =	'발신:'		+	sCaller		+' '+
      //       ', 수신:'	+	sCallee		+' '+
      //       ', 결과:'	+	sResult		+' '	+ '\n'
      if (sResult == '200' || sResult == '406') {
        //alert('전화걸기이벤트: '+ CTC)
        this.caller_close()
      } 
    },
    caller_close() {
      this.$emit('close-caller')
    }, 
    showPopup(cid_len){
      let routeData = {}
      routeData = this.$router.resolve({ name: 'cid-receive-call-popup', query: { cid_len: cid_len }})
      window.open(routeData.href, '_blank', ' left= 100' + ', top= 100' + ', width= 800px' + ', height=400px ' )
    },
    
    getLogin(nResult){
      if(nResult==200)
      {        
        this.ktcid_loginyn = true
        //alert('로그인 성공:' +  nResult)
      }
      else
      { 
        this.ktcid_loginyn = false    
        //alert('로그인 실패:' +  nResult)
        //300 로그아웃
      }
      this.sendLoginResult()
    },
    sendLoginResult(){
      this.$emit('result-login', this.ktcid_loginyn)
    },
    //로그아웃
    logout(){
      document.all.KTOpenAPIX.Logout()
      this.ktcid_loginyn = false  
      this.sendLoginResult()
    },
    //로그인
    connec()  {
      if(this.isSupportedActivex())
      {
        if(this.mac_address == this.set_mac_address || this.set_mac_address =='')
          // eslint-disable-next-line no-undef
          var result = document.all.KTOpenAPIX.Login(1, process.env.KT_CID_AUTHENTICATION_KEY, this.login_id, this.login_pw)

        else alert('연결가능한 자리가 아닙니다')
        switch (result)
        {
          case 301:alert('다른 위치에서 로그인') 
            break
          case 401:alert('미등록 아이디로 로그인')
            break 
          case 402:alert('비밀번호 오류 횟수 초과 (5회제한)') 
            break
          case 403: alert('임시비밀호 로그인')
            break
          case 404:alert('임시비밀번호 설정') 
            break
          case 405:alert('비밀번호 오류') 
            break
          case 407:alert('접속 IP 오류') 
            break
          case 408: alert('미등록 PC')
            break
          case 500: alert('기타(HTTPS/HTTP 요청 실패)')
            break
          case 1000: alert('이미 로그인중')
            break
          case 1001:alert('서버 타입 에러') 
            break
          case 1502:alert('협정 만료일이 지났음')
            break
          case 1503: alert('인증키 유효기간이 지났음')
            break
          case 1504:alert('인증키 비활성')
            break
          case 1505: alert('인증키 타입이 틀릴 경우')
            break
          case 1506: alert('개발 서버이나 상용 인증키, 상용 Flag일 경우')
            break
          case 1507: alert('상용 서버이나 개발 인증키, 개발 Flag일 경우')
            break
          case 1700: alert('API 환경 정보 얻지 못함(실행되는 경로)')
            break
          case 1701: alert('KTA_API.dat / KTD_API.dat등의 data 파일 초기화 에러 파일이 존재해야 함') 
            break 
          case 1702: alert('PC 메모리 부족(API 생성 에러)')
            break
          //default: alert(result);
        }
    

        // if (result == 200) {
        //   alert('연결성공')
        // }
        // else {
        //   alert('연결실패')
        // }
      }
    },
    findPassword(){
      //FindPasswdEx(nServer) - 1: 상용서버, 0: 개발서버
      document.all.KTOpenAPIX.FindPasswdEx('1')
    },
    getHelp(){
      //HelpEX(nServer) - 1: 상용서버, 0: 개발서버
      document.all.KTOpenAPIX.HelpEX('1')
    },
    lineJoin(){
      //신규 회선 청약: CP인증키
      // eslint-disable-next-line no-undef
      document.all.KTOpenAPIX.LineJoin(process.env.KT_CID_AUTHENTICATION_KEY)
    },
    setMyInfo(){
      document.all.KTOpenAPIX.SetMyInfo()
    },
    checkMacAddress() {      
      var ctrl = document.all.ahaMacCtrl
      ctrl.Message = ''
      var strmac = ctrl.Message
      this.mac_address = strmac
      this.setMacAddresses(this.mac_address)
    },
  }
}
</script>