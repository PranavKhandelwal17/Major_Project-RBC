import json

with open("7th_sem_mini_project.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

for cell_id in [173, 174, 175, 184, 185, 186, 187]:
    if cell_id < len(nb["cells"]):
        cell = nb["cells"][cell_id]
        print(f"=== CELL {cell_id} ===")
        print("".join(cell.get("source", [])).encode('ascii', errors='replace').decode('ascii'))
        print("--- OUTPUT ---")
        for out in cell.get("outputs", []):
            if "text" in out:
                print("".join(out["text"]).encode('ascii', errors='replace').decode('ascii')[:1000])
