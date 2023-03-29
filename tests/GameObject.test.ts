import { GameObject } from "../src";

test("set name to GameObject", () => {
  const name = "test name";
  const o = new GameObject({ name });
  o.initialize();
  expect(o.name).toBe(name);
});
