// utils/BezierUtils.js

export const bruteForceBezierCurve = (t, controlPoints) => {
    // Menghitung titik yang ada pada kurva bezier menggunakan pendekatan brute force
    const n = controlPoints.length - 1;
    console.log("controlPoints");
    console.log(controlPoints[0]);
    let point = [0, 0];
    const binomialCoefficient = (n, k) => {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        k = Math.min(k, n - k);
        let c = 1;
        for (let i = 0; i < k; i++) {
            c = c * (n - i) / (i + 1);
        }
        return c;
    };
    for (let i = 0; i <= n; i++) {
        const { x, y } = controlPoints[i];
        console.log("Nilai x", x);
        console.log("Nilai y", x);
        const binomialCoefficientValue = binomialCoefficient(n, i);
        point[0] += binomialCoefficientValue * (t ** i) * ((1 - t) ** (n - i)) * x;
        point[1] += binomialCoefficientValue * (t ** i) * ((1 - t) ** (n - i)) * y;
    }
    console.log("Bezier");
    console.log(point);
    return point;
};
