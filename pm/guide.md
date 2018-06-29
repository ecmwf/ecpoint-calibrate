**Note:** This guide assumes that you have installed the ecPoint-PyCal package. Installation instructions can be found in the [README.md](https://github.com/onyb/reobject/blob/master/README.md) file.

### Architectural overview

The UI for ecPoint-PyCal is powered by [Electron](https://electronjs.org). The Electron process renders the UI contents on the main window, and is responsible for spawning a child Python subprocess, and communicate with it.

We use ZeroRPC to connect to a ZeroMQ service over TCP for passing messages between the Electron process, and the Python subprocess.

<p align="center"> 
  <img src="./architecture.png" />
</p>

### Using the UI

#### Step 1: Select the predictors and predictants

##### List of predictors


|| Predictor || Short name || Computation || Unit ||
| Convective Precipitation Ratio | CPR | convective precipitation / total precipitation | - |
| Total Precipitation | TP | - | mm/h |
| Wind speed of steering winds (at 700 mbar) | WSPD700 | - | m/s |
| Convective Available Potential Energy | CAPE | - | J/kg |
| Daily accumulation of clear-sky solar radiation | SR24h | - W/m2 |
| Local Solar Time | LST | - | h



<p align="center">
  <img src="./page1.png" />
</p>


##### Step 2: Select computations

<p align="center">
  <img src="./page2.png" />
</p>


##### Step 3: Result

TBA

**Note:** Please check the console for tracking the progress of the computation. A next step would be to stream logs from the standard output to the Electron server using ZeroRPC streams.
