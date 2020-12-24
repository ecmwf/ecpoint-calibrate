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


### Requirements

- [Docker](https://docs.docker.com/install/)

### Usage

1. Download the latest release (AppImage file) from the [Releases](https://github.com/esowc/ecPoint-Calibrate/releases) page. Currently, only Linux is supported.
2. Navigate to the folder where the package was downloaded.
3. Run it like: `./ecPoint-Calibrate-0.9.0.AppImage`
4. Wait for the GUI window to launch.

### Software Architecture  (OUTDATED!)

![](/share/architecture.png)


### Collaborators

|      Name      |          Position         |               Affiliation               |
|----------------|---------------------------|-----------------------------------------|
| Anirudha Bose  |     Software Engineer     |          Ledger (Paris, France)         |
| Fatima Pillosu | Scientist & PhD Candidate | ECMWF & Reading University (Reading, UK)|
| Timothy Hewson |    Principal Scientist    |           ECMWF (Reading, UK)           |
