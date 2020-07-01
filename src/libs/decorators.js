// import { createDecorator } from 'vue-class-component'
 
// export const NoCache = createDecorator((options, key) => {
//   // component options should be passed to the callback
//   // and update for the options object affect the component
//   options.computed[key].cache = false
// })
Function.prototype.before = function (beforefn) {
  let _self = this;
  return function () {
    beforefn.apply(this, arguments);
    return _self.apply(this, arguments);
  };
};
Function.prototype.after = function (afterfn) {
  let _self = this;
  return function () {
    let ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};
Function.prototype.around = function (beforefn, afterfn) {
  let _self = this;
  return function () {
    beforefn.apply(this, arguments);
    let ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};

export const before = function (...args) {
  return function (target, key, descriptor) {
    descriptor.value = descriptor.value.before(() => {
      // console.log(`Action-${key} 触发埋点!`);
    });
  };
};
export const after = function (...args) {
  return function (target, key, descriptor) {
    descriptor.value = descriptor.value.after(() => {
      // console.log(`Action-${key} 触发埋点!`);
    });
  };
};
export const around = function (...args) {
  return function (target, key, descriptor) {
    descriptor.value = descriptor.value.around(() => {
      // console.log(`Action-${key} 触发埋点before!`);
    }, () => {
      // console.log(`Action-${key} 触发埋点after!`);
    });
  };
};
