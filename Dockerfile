FROM node:8.16-stretch

RUN apt-get update && apt-get install -y \
    cmake \
    fluid-soundfont-gm \
    fontconfig \
    fonts-freefont-ttf \
    gfortran \
    libasound2 \
    libavcodec-dev \
    libavformat-dev \
    libcanberra-gtk-module \
    libcanberra-gtk3-module \
    libgconf-2-4 \
    libgfortran3 \
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
    python-dev \
    python-numpy \
    python-opengl \
    python-pip \
    python-tk \
    timgm6mb-soundfont \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-base \
    xfonts-cyrillic \
    zlib1g-dev

COPY . /app
ENV WORKDIR /app
WORKDIR $WORKDIR

RUN pip install . -v
RUN bash /app/install_eccodes.sh

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]