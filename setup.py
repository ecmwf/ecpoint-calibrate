import os
import sys
from codecs import open

from setuptools import find_packages, setup

here = os.path.abspath(os.path.dirname(__file__))


class PreCompileSmokeTests(object):
    class PreCompilationError(Exception):
        pass

    def __call__(self):
        if sys.version_info.major == 3:
            raise self.PreCompilationError("Python 3 is not supported.")


PreCompileSmokeTests()


# Get the long description from the README file
with open(os.path.join(here, "README.md"), encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="ecpoint-cal",
    version="0.1.6",
    description="foo bar",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/onyb/ecPoint-PyCal",
    author="Anirudha Bose",
    author_email="anirudha.bose@alumni.cern",
    classifiers=[
        "Development Status :: 2 - Alpha",
        "Intended Audience :: Science/Research",
        "Topic :: Scientific/Engineering :: Atmospheric Science",
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 2.7",
    ],
    keywords="ecmwf ecpoint weather forecast",
    packages=find_packages(),
    install_requires=[
        "attrs>=18.1.0",
        "numpy>=1.14.3",
        "flask>=1.0.2",
        "pandas==0.24.2",
        "matplotlib>=2.2.3",
    ],
    extras_require={"dev": ["check-manifest"], "test": ["coverage", "pytest"]},
    project_urls={
        "Bug Reports": "https://github.com/onyb/ecPoint-PyCal/issues",
        "Source": "https://github.com/onyb/ecPoint-PyCal/",
        "ECMWF": "https://www.ecmwf.int",
    },
)
