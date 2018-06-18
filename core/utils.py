from datetime import timedelta

from multiprocessing import Pool, cpu_count
from contextlib import contextmanager


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


@contextmanager
def poolcontext():
    pool = Pool(cpu_count() // 2)
    yield pool
    pool.terminate()
