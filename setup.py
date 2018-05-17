from setuptools import setup, find_packages
from setuptools.command.develop import develop
from setuptools.command.install import install

# To use a consistent encoding
from codecs import open
from os import path
import subprocess, shlex

from core.smoke import compile_time_smoke_tests

here = path.abspath(path.dirname(__file__))
compile_time_smoke_tests()


def get_cmd_cls(base):
    class Cmd(base):
        def run(self):
            # Install eccodes
            if not path.exists(path.join(here, 'vendor', 'eccodes')):
                cmd = shlex.split('bash install_eccodes.sh')
                subprocess.Popen(args=cmd, cwd=here)

            base.run(self)
    return Cmd


# Get the long description from the README file
with open(path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()


setup(
    name='ecpoint-cal',
    version='0.0.1',
    description='foo bar',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://github.com/onyb/ecPoint-PyCal',
    author='Anirudha Bose',
    author_email='ani07nov@gmail.com',
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Intended Audience :: Science/Research',
        'Topic :: Scientific/Engineering :: Atmospheric Science',
        'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
    ],
    keywords='ecmwf ecpoint weather forecast',
    packages=find_packages(),
    cmdclass={
        'develop': get_cmd_cls(develop),
        'install': get_cmd_cls(install),
    },
    install_requires=[
        'attrs>=18.1.0',
        'numpy>=1.14.3',
        'kivy',
    ],
    dependency_links=[
        "https://github.com/onyb/kivy/archive/fix-setupconfig-bug.zip#egg=kivy",
    ],
    extras_require={
        'dev': ['check-manifest'],
        'test': ['coverage', 'pytest'],
    },
    project_urls={
        'Bug Reports': 'https://github.com/onyb/ecPoint-PyCal/issues',
        'Source': 'https://github.com/onyb/ecPoint-PyCal/',
        'ECMWF': 'https://www.ecmwf.int'
    },
)
