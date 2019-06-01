# ecPoint-PyCal

Meteorological software for calibration of model outputs, and conditional verification of short and medium range weather forecasts.

![CircleCI](https://img.shields.io/circleci/build/github/esowc/ecPoint-PyCal.svg)
[![codecov](https://codecov.io/gh/esowc/ecPoint-PyCal/branch/master/graph/badge.svg)](https://codecov.io/gh/esowc/ecPoint-PyCal)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python3.7-1f425f.svg)](https://www.python.org/)

### Requirements

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://docs.docker.com/compose/install)

### Setup

```sh
$ git clone git@github.com:esowc/ecPoint-PyCal.git
$ cd ecPoint-PyCal
$ docker-compose pull
```

At this point, you must configure the source of your dataset on the filesystem, and make it available to the Docker services using [volumes](https://docs.docker.com/storage/volumes). Normally, if the data lives on a removable media, such as an external HDD, you shouldn't need to do anything.

To configure a volume, simply add it to the two services (`core`, and `electron`) in the [`docker_compose.yml`](/docker-compose.yml) file.

```sh
$ ./go.sh
```


### Collaborators

| Name           | Position            | Affiliation    |
|----------------|---------------------|----------------|
| Anirudha Bose  | Software Engineer   | Ledger, Paris  |
| Fatima Pillosu | Scientist           | ECMWF, Reading |
| Timothy Hewson | Principal Scientist | ECMWF, Reading |
