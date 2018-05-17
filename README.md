# ecPoint-PyCal
ECMWF caliberation software in Python

### Installation

#### Install required packages from Ubuntu repositories

```sh
$ sudo apt update
$ sudo apt install python-dev python-numpy python-opengl libsdl-image1.2-dev \
    libsdl-mixer1.2-dev libsdl-ttf2.0-dev libsmpeg-dev libsdl1.2-dev \
    libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev libx11-6 \
    libtiff5-dev libx11-dev fluid-soundfont-gm timgm6mb-soundfont xfonts-base \
    xfonts-100dpi xfonts-75dpi xfonts-cyrillic fontconfig fonts-freefont-ttf
```
#### Create and activate a Python 2.7 virtual environment with `virtualenv`

```sh
$ virtualenv -p python2 ~/env
$ source ~/env/bin/activate
```

#### Install ecPoint-PyCal build requirements

You must have the source cloned locally.

```sh
$ pip install -r build-requirements.txt
```

#### Install ecPoint-PyCal

```sh
$ pip install -e . -vv
```
