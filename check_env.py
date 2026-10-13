import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"
import sys
print("Python version:", sys.version)

packages = [
    'torch', 'torchvision', 'tensorflow', 'keras', 'fastapi', 
    'uvicorn', 'cv2', 'PIL', 'matplotlib', 'seaborn', 
    'reportlab', 'fpdf2', 'sklearn', 'scipy', 'numpy', 'pydantic'
]

for pkg in packages:
    try:
        m = __import__(pkg)
        print(f"{pkg}: {getattr(m, '__version__', 'available')}")
    except Exception as e:
        print(f"{pkg}: NOT available ({e})")

try:
    import torch
    print("PyTorch CUDA available:", torch.cuda.is_available())
    if torch.cuda.is_available():
        print("Device name:", torch.cuda.get_device_name(0))
except Exception as e:
    print("Torch check error:", e)
