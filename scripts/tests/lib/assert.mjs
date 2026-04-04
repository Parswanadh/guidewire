export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message} (expected: ${expected}, actual: ${actual})`);
  }
}

export function assertType(value, expectedType, label) {
  if (typeof value !== expectedType) {
    throw new Error(`${label} must be ${expectedType}, got ${typeof value}`);
  }
}

export function assertArray(value, label) {
  if (!Array.isArray(value)) {
    throw new Error(`${label} must be an array`);
  }
}

export function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
}

export function assertIncludes(collection, predicate, message) {
  const found = collection.some(predicate);
  if (!found) {
    throw new Error(message);
  }
}
