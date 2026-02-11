# ss = [9, 9, 8, 11, -11, -5, -10, 4, 8]
# tt = [9, 10,  5, 6, 10, 9, 10, 5, 6]
# for i in range(len(ss)):
#   s = ss[i]
#   t = tt[i]
#   if s < 9 or t < 9:
#       print("YES")
#   else:
#       print("NO")

def func(s, t):
  
  if s < 9 or t < 9:
    print("YES")
  else:
    print("NO")

data = ((9, 9), (9, 10), (8, 5), (11, 6), (-11, 10), (-5, 9), (-10, 10), (4, 5), (8, 6))

for point in data:
  func(point[0], point[1])