import json

with open("7th_sem_mini_project.ipynb", "r", encoding="utf-8") as f:
    nb = json.load(f)

for cell_id in range(188, len(nb["cells"])):
    cell = nb["cells"][cell_id]
    source = "".join(cell.get("source", []))
    lines = [line for line in source.split("\n") if line.strip() and not line.strip().startswith("#")]
    print(f"=== CELL {cell_id} ===")
    print("\n".join(lines[:8]).encode('ascii', errors='replace').decode('ascii'))
    outputs = cell.get("outputs", [])
    for out in outputs:
        if "text" in out:
            print("  OUT:", "".join(out["text"])[:300].encode('ascii', errors='replace').decode('ascii'))
