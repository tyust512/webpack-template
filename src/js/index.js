import '@/css/index.css'

const a = 123
const ele = document.createElement('p')
ele.innerHTML = 'hi index'

document.body.appendChild(ele)
import(/* webpackChunkName: "asy" */ './asy').then(module => console.log(module.default))
