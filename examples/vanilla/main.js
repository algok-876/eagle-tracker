import { ErrorType } from '@eagle-tracker/core'
import './style.css'
import Eagle from '@eagle-tracker/core/index'

const instance = new Eagle({
  isTest: true
})
instance.start()
// 测试错误生命周期函数
instance.onCatchError((p1, p2) => {
  console.log(p1, p2)
})
instance.onMergeConfig((config) => {
  console.log('哎呀配置被合并了，新配置为', config)
})
document.querySelector('#app').innerHTML = `
<button id="p">触发Promise错误</button>
<button id="j">触发JS错误</button>
<button id="h">触发Http(xhr)错误</button>
<button id="f">触发Http(fetch)错误</button>
`

// 触发Proise错误
function a () {
  b()
}
function b () {
  console.log(jjj)
}
// 触发ReferenceError

function triggerPromiseError () {
  Promise.reject({
    a: 111
  })
}

function triggerJSError () {
  a()
}

document.querySelector('#p').addEventListener('click', () => {
  triggerPromiseError()
})
document.querySelector('#j').addEventListener('click', () => {
  triggerJSError()
})
document.querySelector('#h').addEventListener('click', () => {
  var xhr = new XMLHttpRequest()
  xhr.withCredentials = true

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText)
    }
  })

  xhr.open("GET", "http://jsonplaceholder.typicode.com/post")

  xhr.send()
})
document.querySelector('#f').addEventListener('click', () => {
  fetch('http://jsonplaceholder.typicode.com/post').then(response => {
    response.json().then(res => {
      console.log(res)
    })
  })
})
