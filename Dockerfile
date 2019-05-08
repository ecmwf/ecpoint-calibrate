FROM nikolaik/python-nodejs:python3.7-nodejs12

RUN apt-get update && apt-get install -y \
    fluid-soundfont-gm \
    fontconfig \
    fonts-freefont-ttf \
    libasound2 \
    libavcodec-dev \
    libavformat-dev \
    libcanberra-gtk-module \
    libcanberra-gtk3-module \
    libgconf-2-4 \
    libgtk-3-0 \
    libnss3 \
    libpng-dev \
    libportmidi-dev \
    libquadmath0 \
    libsdl-image1.2-dev \
    libsdl-mixer1.2-dev \
    libsdl-ttf2.0-dev \
    libsdl1.2-dev \
    libsmpeg-dev \
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
    python3.7-tk \
    timgm6mb-soundfont \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-base \
    xfonts-cyrillic \
    zlib1g-dev

RUN rm -rf /root/* /tmp/* /var/cache/apt/archives/*.deb

COPY . /app
ENV WORKDIR /app
WORKDIR $WORKDIR


ENV PYTHONPATH $WORKDIR
ENV ECCODES_DEFINITION_PATH /usr/share/eccodes/definitions

RUN pipenv install --system --deploy --ignore-pipfile
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
