### Clean Promise chaining and coordination

There are many cases where you need to wait for multiple promises before doing something.
Sometimes you need to run them in series, sometimes in parallel, sometimes you need all the results at the end,
and sometimes you need each function to know about the results of the previous function.
Following are some of the examples we could think of =D
***
#### Sequence (Waterfall)
  output:
  ```
  1
  2
  3
  //return a promise that resolves to 4
  ```

##### Ugly Code:
```javascript
return foo(1).then(function foo(param1){
  console.info(param1);
  return promise.fufilled(2);
  }).then(function bar(param2){
    console.info(param2);
    return promise.fufilled(3);
    }).then(function qux(param3){
      console.info(param3);
      return promise.fufilled(4);
    });
```
##### Clean Code:
```javascript
function foo(param1) {
  console.info(param1);
  return promise.fufilled(2);
}

function bar(param2) {
  console.info(param2);
  return promise.fufilled(3);
}

function baz(param3) {
  console.info(param3);
  return promise.fufilled(4);
}

var funcs = [foo, bar, baz];

var result = promise.fufilled(1);
funcs.forEach(function (f) {
    result = result.then(f);
});
return result;
```
***

#### Combination (Parallel)
```javascript
promise.all([foo, bar, baz]).then(function(values) {
  // prints 1,2,3 (in no particular order)
  // values == [ 2, 3, 4 ];
});
```


>promise.filter and promise.map are also available when you want to perform logic on each array value before inserting it into the results array. There are also useful array methods in es5 like Array.prototype.reduce
