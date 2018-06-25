# ecPoint-PyCal
ECMWF caliberation software in Python

### Installation

##### Install required packages from Ubuntu repositories

```sh
$ sudo apt update
$ sudo apt install python-dev python-numpy python-opengl libsdl-image1.2-dev \
    libsdl-mixer1.2-dev libsdl-ttf2.0-dev libsmpeg-dev libsdl1.2-dev \
    libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev libx11-6 \
    libtiff5-dev libx11-dev fluid-soundfont-gm timgm6mb-soundfont xfonts-base \
    xfonts-100dpi xfonts-75dpi xfonts-cyrillic fontconfig fonts-freefont-ttf
```

##### Install ecPoint-PyCal

First clone the source locally:
```sh
$ git clone https://github.com/onyb/ecPoint-PyCal
$ cd ecPoint-PyCal
```

then, create and activate a Python 2.7 virtual environment with `virtualenv`:
```sh
$ virtualenv -p python2 .env
$ source .env/bin/activate
```

then, install ecPoint-PyCal package with:
```sh
(env) $ pip install -e . -v
```
Optionally, you may install packages required for local development:

```sh
(env) $ pip install -r dev-requirements.txt
(env) $ pip install -r test-requirements.txt
```

##### Running the test suite

```sh
(env) $ py.test
```

##### Launching the ecPoint-PyCal UI

**Note:** Make sure the Python virtual environment is activated.

```sh
(env) $ npm install
(env) $ npm start
```
