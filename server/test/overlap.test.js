import test from "node:test";
import assert from "node:assert/strict";

function overlaps(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB);
}

test("overlapping time intervals are detected", () => {
  assert.equal(overlaps("2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z", "2030-01-01T10:30:00Z", "2030-01-01T11:30:00Z"), true);
});

test("back-to-back intervals do not overlap", () => {
  assert.equal(overlaps("2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z", "2030-01-01T11:00:00Z", "2030-01-01T12:00:00Z"), false);
});

test("a reservation fully inside another overlaps", () => {
  assert.equal(overlaps("2030-01-01T09:00:00Z", "2030-01-01T12:00:00Z", "2030-01-01T10:00:00Z", "2030-01-01T11:00:00Z"), true);
});
