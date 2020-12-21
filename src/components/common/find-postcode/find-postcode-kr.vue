<template>
  <div/>
</template>

<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script>

export default {
  created(){
    let daum_script = document.createElement('script')
    daum_script.setAttribute('src', 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
    document.head.appendChild(daum_script)
  },
  methods: {  
    onFindPostCodeKR() {
      const info = this
      new daum.Postcode({
        oncomplete: function(data) {
          var addr = '' 
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress
          }
          info.setPostCodeKR(data.zonecode, addr)
        }

      }).open()

    },	
    setPostCodeKR(postcode, address){
      this.$emit('update-address', postcode, address)
    }
  }
}
</script>