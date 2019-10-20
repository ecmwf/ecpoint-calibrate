# ecPoint-Calibrate

[![CircleCI](https://circleci.com/gh/esowc/ecPoint-Calibrate.svg?style=svg)](https://circleci.com/gh/esowc/ecPoint-Calibrate)
[![codecov](https://codecov.io/gh/esowc/ecPoint-Calibrate/branch/master/graph/badge.svg)](https://codecov.io/gh/esowc/ecPoint-Calibrate)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python3.7-1f425f.svg)](https://www.python.org/)

ecPoint-Calibrate is a software that uses conditional verification tools to compare numerical weather prediction (NWP) model outputs against point observations and, in this way, anticipate sub-grid variability and identify variability and identify biases at grid scale. 
It provides a dynamic and user-friendly environment to post-process NWP model parameters (such as precipitation, wind, temperature, etc.) and produce probabilistic products for geographical locations (everywhere in the world, and up to medium-range forecasts).

The development of this project was sponsored by the project "ECMWF Summer of Weather Code (ESoWC)" 
[@esowc_ecmwf](https://twitter.com/esowc_ecmwf?lang=en)
[ECMWF](https://www.ecmwf.int).


### Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install)


### Setup

```sh
$ git clone https://github.com/esowc/ecPoint-Calibrate.git
$ cd ecPoint-Calibrate
```
At this point, the dataset source must be configured on the filesystem, and make it available to the Docker services using [volumes](https://docs.docker.com/storage/volumes). Normally, if the data lives on a removable media, such as an external HDD, you shouldn't need to do anything. To configure a volume, simply add the dataset source to the services `core`, `electron`, and `logger` in the [`docker_compose.yml`](/docker-compose.yml) file.

```sh
$ ./go.sh
```

### Access files create with Docker
```sh
$ docker ps
$ docker exec -it <container name> /bin/bash
```


### Software Architecture

![](/share/architecture.png)


### Collaborators

|      Name      |          Position         |               Affiliation               |
|----------------|---------------------------|-----------------------------------------|
| Anirudha Bose  |     Software Engineer     |          Ledger (Paris,France)          |
| Fatima Pillosu | Scientist & PhD Candidate | ECMWF & Reading University (Reading,UK) |
| Timothy Hewson |    Principal Scientist    |           ECMWF (Reading,UK)            |
