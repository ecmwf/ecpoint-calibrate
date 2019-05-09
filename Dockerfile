FROM ubuntu:19.04

RUN apt-get update && \
    apt-get install -yqq apt-transport-https wget gnupg2

# Install Node 12.x
RUN \
  echo "deb https://deb.nodesource.com/node_12.x disco main" > /etc/apt/sources.list.d/nodesource.list && \
  wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
  apt-get update && \
  apt-get install -yqq nodejs && \
  npm i -g npm@^6

ENV PATH /usr/local/bin:$PATH
ENV LANG C.UTF-8
ENV WORKDIR /app
ENV PYTHONPATH $WORKDIR
ENV ECCODES_DEFINITION_PATH /usr/share/eccodes/definitions
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y  --no-install-recommends \
    fontconfig \
    fonts-freefont-ttf \
    libcanberra-gtk-module \
    libcanberra-gtk3-module \
    libgconf-2-4 \
    libgtk-3-0 \
    libmetview-dev \
    libnss3 \
    libpng-dev \
    libquadmath0 \
    libsdl-image1.2-dev \
    libsdl-mixer1.2-dev \
    libsdl-ttf2.0-dev \
    libsdl1.2-dev \
    libswscale-dev \
    libtiff5-dev \
    libx11-6 \
    libx11-dev \
    libxau6 \
    libxcb1 \
    libxdmcp6 \
    libxext6 \
    libxss1 \
    libxtst6 \
    metview \
    python3 \
    python3-dev \
    python3-pip \
    python3-tk \
    zlib1g-dev

RUN rm -rf /root/* /tmp/* /var/cache/apt/archives/*.deb /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.7 1
RUN update-alternatives --set python /usr/bin/python3.7
RUN ln -s /usr/lib/x86_64-linux-gnu/libMv* /usr/lib/
RUN ln -s /usr/lib/x86_64-linux-gnu/libMetview* /usr/lib/

RUN pip3 install -U pip pipenv

COPY . $WORKDIR
WORKDIR $WORKDIR

RUN pipenv install --system --deploy --ignore-pipfile
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
