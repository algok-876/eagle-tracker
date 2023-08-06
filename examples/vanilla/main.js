import './style.css'
import instance from './eagle'
import './testPerformanceMark'
setTimeout(() => {
  console.log(instance.getPageRecord())

}, 1000)
instance.onCatchRSError((type, log) => {
  console.log('资源错误', type, log)
})
instance.onMergeConfig((config) => {
  console.log('哎呀配置被合并了，新配置为', config)
})
instance.beforeSendData((category, data) => {
  console.log('数据上报前')
  console.log(category, data)
})
document.querySelector('#app').innerHTML = `
<button id="p">触发Promise错误</button>
<button id="j">触发JS错误</button>
<button id="h">触发Http(xhr)错误</button>
<button id="f">触发Http(fetch)错误</button>
<button id="img">图片加载错误</button>
<div id="wrapper"></div>
`

// 触发Proise错误
function a () {
  b()
}
function b () {
  console.log(jjj)
}
// 触发ReferenceError

async function triggerPromiseError () {
  const promise = new Promise((resolve, rej) => {
    setTimeout(() => {
      rej('promise rej test')
    }, 2000)
  })
  await promise
  console.log('成功了')
}

function triggerJSError () {
  a()
}

document.querySelector('#p').addEventListener('click', () => {
  triggerPromiseError()
})
document.querySelector('#j').addEventListener('click', () => {
  console.log('触发js错误')
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

document.querySelector('#img').addEventListener('click', () => {
  const html = document.querySelector('#wrapper').innerHTML
  document.querySelector('#wrapper').innerHTML = html + "<img src='baid.com'/>"
})

// window.addEventListener("error", function (event) {
//   event.preventDefault()
//   const target = event.target
//   const tagName = target.tagName.toLowerCase()
//   const url = target.src || target.href

//   const lohhg = {
//     pageUrl: window.location.href,
//     pageTitle: document.title,
//     triggerTime: Date.now(),
//     url,
//     tagName,
//   }
//   console.log(lohhg)
// }, true)