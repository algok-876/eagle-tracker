import eagle from './eagle'
console.log(eagle)
const p = eagle.performance
p.markStart('test')
setTimeout(() => {
  p.markEnd('test')
  p.measure('test')
  console.log('第一次打点', p.getMeasure('test'))
  p.clearEndMark('test')
  p.clearMeasure('test')
}, 2000)
setTimeout(() => {
  p.markEnd('test')
  p.measure('test')
  console.log('第二次打点', p.getMeasure('test'))
}, 4000)
// console.log(p.getMarks('tete'))