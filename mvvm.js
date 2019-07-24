id = 0;
currentObs = null;

function observe(data){
  if(typeof(data)!=='object' && data===null) return;
  Object.keys(data).forEach( key => {
    let val = data[key];
    if(typeof(val) === 'object'){
      observe(val);
    }
    let subj = new Subject(key);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function(){
        if(currentObs){
          currentObs.subscribeTo(subj);
        }
        return val;
      },
      set: function(newVal){
        val = newVal;
        subj.notify();
      }
    })
  })
}

class Mvvm {
  constructor(opt){
    this.el = opt.el;
    this.data = opt.data;
    observe(this.data);
    this.compile();
  }
  compile(){
    var $el = document.querySelector(this.el);
    this.traverse($el);
  }
  traverse($el){
    if($el.nodeType === 1){
      $el.childNodes.forEach(child => {
        this.traverse(child);
      });   
    } else if($el.nodeType === 3){
      this.renderText($el);
    };
  }
  renderText(node) {
    let text = node.nodeValue;
    for(let reg = /{{(.+?)}}/; text.match(reg)!==null;){
      let match = reg.exec(text);
      if(match === null) {
        continue;
      }
      let key = match[1];
      let val = this.data[key];
      text = text.replace(match[0], val);
      node.nodeValue = text;
      new Observer(this, key, (value, newVal)=>{
        node.nodeValue = node.nodeValue.replace(value, newVal);
      });
    }
  }
}

class Subject {
  constructor(name){
    this.observers = [];
    this.id = ++id;
    this.name = name;
  }
  addObserver(observer){
    this.observers.push(observer);
  }
  removeObserver(obs){
    let index = this.observers.indexOf(obs);
    if(index > -1){
      this.observers.splice(index, 1);
    }
  }
  notify(){
    this.observers.forEach( obs => {
      obs.update();
    })
  }
}

class Observer {
  constructor(mvvm, key, callback){
    this.mvvm = mvvm;
    this.key = key;
    this.callback = callback;
    this.subjects = [];
    this.value = this.getValue();
  }
  subscribeTo(subject){
    if(!this.hasSubscribed(subject)){
      subject.addObserver(this);
      this.subjects.push(subject);
    }
  }
  hasSubscribed(subject){
    return this.subjects.indexOf(subject) > -1;
  }
  update(){
    let oldVal = this.value;
    let newVal = this.getValue();
    if(oldVal !== newVal){
      this.callback(oldVal, newVal);
      this.value = newVal;
    }
  }
  getValue(){
    currentObs = this;
    let val = this.mvvm.data[this.key];
    currentObs = null;
    return val;
  }
}


var vm = new Mvvm({
  el: "#info",
  data: {
    name: "evan",
    age: 20
  }
}) 


//test
setInterval(() => {
  vm.data.age++;
  dict = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  vm.data.name = dict[Math.floor(Math.random()*7)] + dict[Math.floor(Math.random()*7)] + dict[Math.floor(Math.random()*7)];
},2000)
