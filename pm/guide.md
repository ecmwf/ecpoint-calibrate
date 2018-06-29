**Note:** This guide assumes that you have installed the ecPoint-PyCal package. Installation instructions can be found in the [README.md](https://github.com/onyb/reobject/blob/master/README.md) file.

## Architectural overview

The UI for ecPoint-PyCal is powered by [Electron](https://electronjs.org). The Electron process renders the UI contents on the main window, and is responsible for spawning a child Python subprocess, and communicate with it.

We use ZeroRPC to connect to a ZeroMQ service over TCP for passing messages between the Electron process, and the Python subprocess.

The bulk of the operations like loading observation/forecast data and running computations is done on the main Python subprocess, however, some computationally expensive tasks are delegated to a multiprocessing pool of workers.

<p align="center"> 
  <img src="./architecture.png" />
</p>

## Usage information for the GUI

### Selecting the predictors and predictants

In this step of the GUI, we specify the paths in the local filesystem where the predictant and predictors are stored. The software has not been tested to work with remote filesystems.


#### Predictant

We can use the GUI to select a *single* directory that holds the observation data for the predictant we want to use in our computations. The expected format is specified below, where `selectedDirectory` is the directory chosen on the GUI.

**Expected database format for predictant data:**

```
<selectedDirectory>/<accumulation>/<date>/<predictant>_<accumulation>_<date>_<hour>.<dataType>

```

**Example:**

Here is a sample predictant file, where `selectedDirectory` is `/home/username/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/OBS/ECMWF/tp`:

```
/home/username/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/OBS/ECMWF/tp/Acc06h/20150601/tp_06_20150601_23.geo
```

The supported data type is Geopoint (`.geo`).

#### Predictors

We can use the GUI to select a *single* directory that holds all the forecast data for different predictors under it. The expected format is specified below, where `selectedDirectory` is the directory chosen on the GUI.

**Expected database format for predictor data:**

```
<selectedDirectory>/<predictor>/<date><hour>/<predictor>_<date>_<hour>_<step>.<dataType>
```

**Example:**

Here is a sample predictor file, where `selectedDirectory` is `/home/username/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/FC/ECMWF41r1_HRES16km_Global/`:

```
/home/username/ecmwf/dissemination.ecmwf.int/vol/ecpoint/ecPoint_DB/FC/ECMWF41r1_HRES16km_Global/cape/2015060100/cape_20150601_00_10.grib
```

Supported data types are GRIB (`.grib`) and NetCDF (`.nc`). You must specify the type of forecast data to load (GRIB, by default), however this will probably be automatically inferred in the future.

#### List of predictors


| Predictor | Short name | Computation | Unit |
| :-------: | :--------: | :---------: | :--: |
| Convective Precipitation Ratio | CPR | convective precipitation / total precipitation | - |
| Total Precipitation | TP | - | mm/h |
| Wind speed of steering winds (at 700 mbar) | WSPD700 | - | m/s |
| Convective Available Potential Energy | CAPE | - | J/kg |
| Daily accumulation of clear-sky Solar Radiation | SR24h | - | W/m2 |
| Local Solar Time | LST | - | h |


<p align="center">
  <img src="./page1.png" />
</p>


### Specifying the input parameters

In order to have flexibility, the software allows users to customize the values of the input parameters.

| Parameter | Remark | Example |
| :-------: | :----- | :-----: |
| Date Start | Must follow the `YYYYMMDD` format | 20150601 |


### Selecting the computations

<p align="center">
  <img src="./page2.png" />
</p>


### Step 3: Result

TBA

**Note:** Please check the console for tracking the progress of the computation. A next step would be to stream logs from the standard output to the Electron server using a ZeroRPC stream.
