const _Object = Object;

export default _Object.assign ||
  function(target) {
    for (let i = 1; i < arguments.length; i++) {
      let source = arguments[i];

      for (let key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
