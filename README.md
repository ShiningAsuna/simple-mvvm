# simple-mvvm
一个简易的mvvm框架

### 实现原理
- Object.defineProperty()
用于实现数据的监听

用法：Object.defineProperty(obj, prop, descriptor)
* obj
  * 要处理的目标对象
* prop
  * 要定义或修改的属性的名称
* descriptor
  * 将被定义或修改的属性描述符

```
Object.defineProperty(obj, 'age', {
  configurable: true,            // 是否可编辑
  enumerable: true,              // 是否可枚举
  get: function(){
      console.log('get age...')
      return age
  },
  set: function(val){
      console.log('set age...')
      age = val
  }
})
```
这样即可以通过get和set实现对数据变化和读取时的监听


- 发布订阅模式（观察者模式）
例如用户在一个网站订阅主题
* 多个用户(观察者，Observer)都可以订阅某个主题(Subject)
* 当主题内容更新时订阅该主题的用户都能收到通知

在框架中，元数据为主题，view中的各个数据展示处为观察者，当元数据中的数据改变时，通知view中的各个观察者也更新它的值
而在可输入的表单中，自己也为观察者，通过绑定oninput事件，修改元数据的值，会触发元数据主题的notify()方法，这样自己作为观察者，表单中的值也随之改变，实现双向绑定