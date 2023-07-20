# ecPoint-Calibrate

![Core unit tests](https://github.com/esowc/ecPoint-Calibrate/workflows/Core%20unit%20tests/badge.svg)
![Release Core](https://github.com/esowc/ecPoint-Calibrate/workflows/Release%20Core/badge.svg)
![Release Electron](https://github.com/esowc/ecPoint-Calibrate/workflows/Release%20Electron/badge.svg)
[![codecov](https://codecov.io/gh/esowc/ecPoint-Calibrate/branch/master/graph/badge.svg?token=x1SGIykSpy)](https://codecov.io/gh/esowc/ecPoint-Calibrate)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python3.8-1f425f.svg)](https://www.python.org/)

ecPoint-Calibrate is a software that uses conditional verification tools to compare numerical weather prediction (NWP) model outputs against point observations and, in this way, anticipate sub-grid variability and identify biases at grid scale.
It provides a dynamic and user-friendly environment to post-process NWP model parameters (such as precipitation, wind, temperature, etc.) and produce probabilistic products for geographical locations (everywhere in the world, and up to medium-range forecasts).

The development of this project was sponsored by the project "ECMWF Summer of Weather Code (ESoWC)"
[@esowc_ecmwf](https://twitter.com/esowc_ecmwf?lang=en)
[ECMWF](https://www.ecmwf.int).

## Build with Docker

```
docker build -f Dockerfile.core -t ecmwf/ecpoint-calibrate-core:dev .
```

## Deploy new versions of the Docker containers

```
./deploy.sh
```

## Create a production AppImage

```
yarn dist
```

The appimage won't work on modern machines without manually adding the `--no-sandbox` electron
option and re-packaging.

### Install `appimagetool`

```
sudo wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O /usr/local/bin/appimagetool
sudo chmod +x /usr/local/bin/appimagetool
```

### Repackage the AppImage

```
cd pkg
./ecPoint-Calibrate-0.30.0.AppImage --appimage-extract
```

This will extract the image into the `squashfs-root` directory.
Open `squashfs-root/AppRun` and change the `exec` lines to have the `--no-sandbox` argument.
e.g. `exec "$BIN" --no-sandbox`

Then repackage:
```
appimagetool squashfs-root ecPoint-Calibrate-0.30.0.AppImage
```

## Python Backend

We need `metview-batch` from conda-forge so unfortunately need to use `conda` with `poetry`.

### Creating the environment

```
conda create --name ecpoint_calibrate_env --file conda-linux-64.lock
conda activate ecpoint_calibrate_env
poetry install
```

### Activating the environment

```
conda activate ecpoint_calibrate_env
```

### Updating the environment

#### Poetry (strongly preferred)

Installing a new package with poetry will update the poetry lockfile.

```
poetry install $DEP
```

#### Conda

You should very rarely need to add a new conda dep.

```
conda-lock -k explicit --conda mamba
mamba update --file conda-linux-64.lock
poetry update
```


### Run tests

First activate the conda env, then run `pytest`.

## Electron Frontend

You'll need node v 14.5.0.

### Installing deps

```
yarn
```

### Run the app

```
yarn start
```

### Run tests

```
npm run test
```
