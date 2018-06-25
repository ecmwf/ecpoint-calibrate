from contextlib import contextmanager
from multiprocessing import Pool, cpu_count


@contextmanager
def poolcontext():
    pool = Pool(cpu_count() // 2)
    yield pool
    pool.terminate()
