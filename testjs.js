let o = new Object;
let x = 1
o[1] = "one"
o[2] = "two"
o[(x)] = o[(x+1)]
o[(x+1)] = o[(x+2)]
console.log(o)