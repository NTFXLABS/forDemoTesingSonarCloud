function a(b) {
  let c = [];
  for (let i = 0; i < b.length; i++) {
    if (b[i] % 2 === 0) c.push(b[i] * 2)
    else c.push(b[i] + 1);
  }
  return c
}

const result = a([1,2,3,4,5,6,7,8,9,10]);
console.log(result);
