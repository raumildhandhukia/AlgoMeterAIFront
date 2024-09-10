const examples = {
  recursive_fibonacci:
    "function fibonacci(n) {\n  if (n <= 1) { \n    return n; \n  }\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",

  binary_search:
    "function binary_search(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) {\n      return mid;\n    } else if (arr[mid] < target) {\n      left = mid + 1;\n    } else {\n      right = mid - 1;\n    }\n  }\n  return -1;\n}",

  quick_sort:
    "function quick_sort(arr) {\n  if (arr.length <= 1) {\n    return arr;\n  }\n\n  let pivot = arr[Math.floor(arr.length / 2)];\n  let left = [];\n  let right = [];\n\n  for (let i = 0; i < arr.length; i++) {\n    if (i === Math.floor(arr.length / 2)) {\n      continue;\n    }\n    if (arr[i] < pivot) {\n      left.push(arr[i]);\n    } else {\n      right.push(arr[i]);\n    }\n  }\n\n  return [...quick_sort(left), pivot, ...quick_sort(right)];\n}",

  bubble_sort:
    "function bubble_sort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}",

  linear_search:
    "function linear_search(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) {\n      return i;\n    }\n  }\n  return -1;\n}",
};

export default examples;
