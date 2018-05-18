import os
import shlex
import subprocess
import sys
from codecs import open

from setuptools import setup, find_packages
from setuptools.command.develop import develop
from setuptools.command.install import install

here = os.path.abspath(os.path.dirname(__file__))


class PreCompileSmokeTests(object):
    class PreCompilationError(Exception):
        pass

    def __call__(self):
        if sys.version_info.major == 3:
            raise self.PreCompilationError(
                'Python 3 is not supported.'
            )

        if 'VIRTUAL_ENV' not in os.environ:
            raise self.PreCompilationError(
                'You need to activate a Python 2 virtualenv.'
            )


def precompile_steps():
    cmd = shlex.split('pip install -r build-requirements.txt')
    subprocess.Popen(args=cmd, cwd=here)


def extra_install_steps():
    # Install eccodes
    # [TODO] - Rewrite the install_eccodes.sh script in Python
    cmd = shlex.split('bash install_eccodes.sh')
    subprocess.Popen(args=cmd, cwd=here)


PreCompileSmokeTests()
precompile_steps()


def get_cmd_cls(base):
    class Cmd(base):
        def run(self):
            extra_install_steps()
            base.run(self)

    return Cmd


# Get the long description from the README file
with open(os.path.join(here, 'README.md'), encoding='utf-8') as f:
    long_description = f.read()

cmd = shlex.split('pip install -r build-requirements.txt')
subprocess.Popen(args=cmd, cwd=here)

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
        'kivy>=1.10.0',
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
