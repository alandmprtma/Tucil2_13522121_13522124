import matplotlib.pyplot as plt
from typing import List

# Defining the Point class
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

    def __truediv__(self, other: float):
        return Point(self.x / other, self.y / other)

    def __str__(self):
        return f"({self.x}, {self.y})"

class BezierCurve:
    def __init__(self, control_points: List[Point], iterations: int):
        self.control_points = control_points
        self.iterations = iterations
        self.iterationsList = [[] for _ in range(iterations)]

    def midpoint(self, p1: Point, p2: Point) -> Point:
        return (p1 + p2) / 2

    def reduce(self, arr: List[Point], left: List[Point], right: List[Point], iter: int) -> List[Point]:
        left_arr: List[Point] = [arr[0]]
        right_arr: List[Point] = [arr[-1]]

        while len(arr) > 1:
            new_arr: List[Point] = []
            for i in range(len(arr) - 1):
                new_arr.append(self.midpoint(arr[i], arr[i + 1]))

            left_arr += [new_arr[0]]
            right_arr = [new_arr[-1]] + right_arr
            arr = new_arr

        self.iterationsList[iter] += left + arr + right
        if iter == self.iterations - 1:
            return arr
        else:
            iter += 1
            return self.reduce(left_arr + arr, left, arr, iter) + arr + self.reduce(arr + right_arr, [], right, iter)

    def draw_curve(self):
        final_points = self.reduce(self.control_points, [], [], 0)

        for iter_points in self.iterationsList:
            if iter_points:
                x_vals, y_vals = zip(*[(p.x, p.y) for p in iter_points])
                plt.plot(x_vals, y_vals, marker='o')

        # Draw the final curve
        x_vals, y_vals = zip(*[(p.x, p.y) for p in [self.control_points[0]] + final_points + [self.control_points[-1]]])
        plt.plot(x_vals, y_vals, color='black')

        # Set up plot
        plt.title("Bezier Curve menggunakan Divide and Conquer")
        plt.xlabel("x")
        plt.ylabel("y")
        plt.grid(True)
        plt.show()

        # Output the number of points and their coordinates
        print(f"Jumlah titik pada kurva : {len(final_points) + 2}")  # Adding 2 for start and end points
        print("Start Point:", self.control_points[0])  # Output start point
        for i, point in enumerate(final_points):
            print(f"Point {i+1}: {point}")
        print("End Point:", self.control_points[-1])  # Output end point


# Function to get control points from user input
def get_control_points():
    points = []
    num_points = int(input("Enter the number of control points: "))
    for i in range(num_points):
        x = float(input(f"Masukkan x untuk titik ke {i+1}: "))
        y = float(input(f"Masukkan y untuk titik ke {i+1}: "))
        points.append(Point(x, y))
    return points

# Get user input for control points and iterations
control_points = get_control_points()
iterations = int(input("Masukkan jumlah iterasi : "))

# Create and draw the Bezier curve
bezier = BezierCurve(control_points, iterations)
bezier.draw_curve()
