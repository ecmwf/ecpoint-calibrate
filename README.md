# ecPoint-PyCal

Calibration Software in Python developed at ECMWF.

#### Installation

ecPoint-pyCal provides easy-to-install **snaps** powered by [Snapcraft](http://snapcraft.io). Snaps are completely self-contained, and run on all major Linux systems.

```sh
sudo snap install --beta ecpoint-pycal
```

**Note:** The `--beta` flag will not be necessary in future when the snap is released on
a `stable` channel.

Don't have `snapd`? [Get set up for snaps](https://docs.snapcraft.io/core/install).

#### Launching the ecPoint-pyCal

As a part of installation process, ecPoint-pyCal creates a desktop launcher for the GUI,
which can be found in the  [Application] menu depending upon the flavour of your operating
system.

However, the recommended way to launch ecPoint-pyCal is using the terminal:

```sh
$ ecpoint-pycal
```

Using the command-line not only gives you better control to exit the program, but is also more transparent
as you can see the logs in case something goes wrong.
