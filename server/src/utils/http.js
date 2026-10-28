export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function isValidDate(value) {
  return value && !Number.isNaN(new Date(value).getTime());
}
