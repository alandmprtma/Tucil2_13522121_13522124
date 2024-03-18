// utils/divnconquer.js


// Fungsi untuk melakukan kalkulasi modpoint atau titik tengah
const midpoint = (p1, p2) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2
});

// Fungsi untuk melakukan reduksi titik menggunakan algoritma divide and conquer
export const divncon = (arr, left, right, iter, iterations, setBezierPoint) => {
  let leftArr = [arr[0]];
  let rightArr = [arr[arr.length - 1]];

  while (arr.length > 1) {
    let newArr = [];
    for (let i = 0; i < arr.length - 1; i++) {
      newArr.push(midpoint(arr[i], arr[i + 1]));
    }

    leftArr = leftArr.concat([newArr[0]]);
    rightArr = [newArr[newArr.length - 1]].concat(rightArr);
    arr = newArr;
  }

  if (iter === iterations - 1) {
    setBezierPoint(arr);
    return arr;
  } else {
    iter += 1;
    return divncon(
      leftArr.concat(arr),
      left,
      arr,
      iter,
      iterations,
      setBezierPoint
    ).concat(arr).concat(
      divncon(arr.concat(rightArr), [], right, iter, iterations, setBezierPoint)
    );
  }
};