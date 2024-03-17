import numpy as np
import matplotlib.pyplot as plt

def kurva_bruteforce(t, koordinat):
    # Menghitung titik yang ada pada kurva bezier menggunakan pendekatan brute force
    n = len(koordinat) - 1
    point = np.zeros(2)
    for i in range(n+1):
        point += koefisien(n,i) * (t ** i) * ((1 - t) ** (n - i)) * koordinat[i]
    return point

num_points = int(input("Masukkan jumlah titik kontrol: ")) #ini gua masukin diluar
def input_koordinat():
    points = []
    for i in range(num_points):
        x, y = map(float, input(f"Masukkan titik ke-{i+1} (format: x y): ").split())
        points.append([x, y])
    return np.array(points)

def koefisien(n, k):
    if k < 0 or k > n:
        return 0
    if k == 0 or k == n:
        return 1
    k = min(k, n - k)
    c = 1
    for i in range(k):
        c = c * (n - i) // (i + 1)
    return c

user_contpt = input_koordinat()
iterasi = ((int(input("Masukkan jumlah iterasi: "))) * (num_points-1)) 

#Menghitung titik dengan brute force
curve_points_user = []
for i in range(iterasi + 2): #gua ganti disini land
    t = i / (iterasi + 1) 
    curve_points_user.append(kurva_bruteforce(t, user_contpt))

for i in range(iterasi + 2) :
    print(curve_points_user[i])
curve_points_user = np.array(curve_points_user)

plt.figure(figsize=(8, 5))
plt.plot(curve_points_user[:, 0], curve_points_user[:, 1], label="Bezier Curve (Brute Force)")
plt.scatter(user_contpt[:, 0], user_contpt[:, 1], color='red', label="Control Points")
plt.plot(user_contpt[:, 0], user_contpt[:, 1], color='grey', linestyle='--', label="Control Polygon")
plt.title("Bezier Curve with Brute Force Method")
plt.xlabel("X")
plt.ylabel("Y")
plt.legend()
plt.grid(True)
plt.show()
