# ecPoint-PyCal
ECMWF caliberation software in Python

### Installation

#### Install required packages from Ubuntu repositories

```sh
$ sudo apt update
$ sudo apt install libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev \
    libsdl2-dev libsdl2-ttf-dev libsdl2-image-dev libsdl2-mixer-dev
```
#### Create and activate a Python 3.6 virtual environment with `virtualenv`

```sh
$ virtualenv -p python3 ~/env
$ source ~/env/bin/activate
```

#### Install ecPoint-PyCal build requirements

```sh
$ pip install -I Cython==0.25.2
$ pip install pygame
```
or, do the following if you already have the source cloned locally.

```sh
$ pip install -r build-requirements.txt
```

#### Install ecPoint-PyCal

```sh
$ python setup.py install
```
