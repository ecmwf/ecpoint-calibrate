import subprocess
import sys

if sys.version_info.major == 2:
    raise RuntimeError("Python 2 is not supported.")

status = subprocess.check_call(["python", "-m", "metview", "selfcheck"])
if status != 0:
    raise RuntimeError("metview package is not installed.")
