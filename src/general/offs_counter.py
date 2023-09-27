import os
import re
import csv

DIRPATH = "/Users/szary/action"


def initialize_dict(d, key1, key2, key3):
  if not d.get(key1):
    d[key1] = {}
  if not d.get(key2):
    d[key1][key2] = {}
  if not d.get(key3):
    d[key1][key2][key3] = 0


if __name__ == "__main__":
  offs_per_player = {}

  for filename in os.listdir(DIRPATH):
    if not re.search(r"\.csv$", filename):
      continue

    with open(os.path.join(DIRPATH, filename)) as csv_file:
      print(filename)
      reader = csv.reader(csv_file)
      for row in reader:
        try:
          if len(row) < 8:
            continue
          axe_number = int(row[3])
          cav_number = max(int(row[4]), int(row[5]))
          off_strength = axe_number + cav_number * 4
          if off_strength > 10000:
            print(off_strength)
          match = re.search(r"\(([0-9]{3}\|[0-9]{3})\)", row[0])
          if not match:
            continue
          coords = match.group(1)
          # print(coords, off_strength)
          if 10000 <= off_strength < 15000:
            initialize_dict(offs_per_player, filename, coords, "1/2")
            offs_per_player[filename][coords]["1/2"] += 1
          elif 15000 <= off_strength < 19000:
            initialize_dict(offs_per_player, filename, coords, "3/4")
            offs_per_player[filename][coords]["3/4"] += 1
          elif off_strength >= 19000:
            initialize_dict(offs_per_player, filename, coords, "1/1")
            offs_per_player[filename][coords]["1/1"] += 1
        except:
          pass

  print(offs_per_player)

