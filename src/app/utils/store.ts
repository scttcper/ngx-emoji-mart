let NAMESPACE = 'emoji-mart';

export function setNamespace(namespace) {
  NAMESPACE = namespace;
}

export function update(state) {
  for (const key of Object.keys(state)) {
    const value = state[key];
    set(key, value);
  }
}

export function set(key, value) {
  try {
    window.localStorage[`${NAMESPACE}.${key}`] = JSON.stringify(value);
  } catch (e) {}
}

export function get(key) {
  let value;
  try {
    value = window.localStorage[`${NAMESPACE}.${key}`];
  } catch (e) {
    return;
  }

  if (value) {
    return JSON.parse(value);
  }
}
