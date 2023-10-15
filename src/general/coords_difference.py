def coords_list_to_dict(coords_list: str) -> dict[str, int]:
  coords_dict: dict[str, int] = {}
  for coords in coords_list:
    if not coords in coords_dict:
      coords_dict[coords] = 1
    else:
      coords_dict[coords] += 1
  return coords_dict


def coords_difference(coords1: dict[str, any], coords2: dict[str, any]) -> list[str]:
  coords_difference_list: list[str] = []
  for coords in coords1:
    if not coords in coords2:
      coords_difference_list.append(coords)
  return coords_difference_list


if __name__ == "__main__":
  coords_sets: list[str] = []
  coords_sets.append(input("Enter first set of coords: ").split(" "))
  coords_sets.append(input("Enter second set of coords: ").split(" "))

  coords_dicts: list[dict[str, int]] = []
  coords_dicts.append(coords_list_to_dict(coords_sets[0]))
  coords_dicts.append(coords_list_to_dict(coords_sets[1]))

  coords_difference_list = coords_difference(coords_sets[0], coords_sets[1])
  print("\n".join(coords_difference_list))
