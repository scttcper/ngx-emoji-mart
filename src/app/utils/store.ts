let NAMESPACE = 'emoji-mart';

const _JSON = JSON;

const isLocalStorageSupported =
  typeof window !== 'undefined' && 'localStorage' in window;

let getter;
let setter;

function setHandlers(handlers) {
  if (!handlers) {
    handlers = {};
  }

  getter = handlers.getter;
  setter = handlers.setter;
}

function setNamespace(namespace) {
  NAMESPACE = namespace;
}

function update(state) {
  for (const key of Object.keys(state)) {
    const value = state[key];
    set(key, value);
  }
}

function set(key, value) {
  if (setter) {
    setter(key, value);
  } else {
    if (!isLocalStorageSupported) {
      return;
    }
    try {
      window.localStorage[`${NAMESPACE}.${key}`] = _JSON.stringify(value);
    } catch (e) {}
  }
}

function get(key) {
  if (getter) {
    return getter(key);
  } else {
    let value;
    if (!isLocalStorageSupported) {
      return;
    }
    try {
      value = window.localStorage[`${NAMESPACE}.${key}`];
    } catch (e) {
      return;
    }

    if (value) {
      return JSON.parse(value);
    }
  }
}

export default { update, set, get, setNamespace, setHandlers };
