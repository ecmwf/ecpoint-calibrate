# ecPoint-PyCal

Calibration Software in Python developed at ECMWF.

#### Installation using Snap

ecPoint-pyCal provides easy-to-install **snaps** powered by [Snapcraft](http://snapcraft.io). Snaps are completely self-contained, and run on all major Linux systems.

```sh
sudo snap install --beta ecpoint-pycal
```

**Note:** The `--beta` flag will not be necessary in future when the snap is released on
a `stable` channel.

Don't have `snapd`? [Get set up for snaps](https://docs.snapcraft.io/core/install).

###### Launching the ecPoint-pyCal

As a part of installation process, ecPoint-pyCal creates a desktop launcher for the GUI,
which can be found in the  [Application] menu depending upon the flavour of your operating
system.

However, the recommended way to launch ecPoint-pyCal is using the terminal:

```sh
$ ecpoint-pycal
```

Using the command-line not only gives you better control to exit the program, but is also more transparent
as you can see the logs in case something goes wrong.

#### Manual installation

###### Install required packages from Ubuntu repositories

```sh
$ sudo apt update
$ sudo apt install python-dev python-numpy python-opengl libsdl-image1.2-dev \
    libsdl-mixer1.2-dev libsdl-ttf2.0-dev libsmpeg-dev libsdl1.2-dev \
    libportmidi-dev libswscale-dev libavformat-dev libavcodec-dev libx11-6 \
    libtiff5-dev libx11-dev fluid-soundfont-gm timgm6mb-soundfont xfonts-base \
    xfonts-100dpi xfonts-75dpi xfonts-cyrillic fontconfig fonts-freefont-ttf
```
###### Install ecPoint-PyCal

```sh
$ git clone https://github.com/onyb/ecPoint-PyCal
$ cd ecPoint-PyCal
$ virtualenv -p python2 .env
$ source .env/bin/activate
(env) $ pip install . -v
(env) $ bash install_eccodes.sh
(env) $ npm install
(env) $ npm run build
```

###### Launching the ecPoint-PyCal UI

**Note:** Make sure the Python virtual environment is activated.

```sh
(env) $ npm start
```
