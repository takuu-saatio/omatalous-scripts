FROM ubuntu:14.04
RUN apt-get update
RUN apt-get install -y build-essential python curl git vim
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN git config --global user.email "vhalme@gmail.com"
RUN git config --global user.name "Vladimir Halme"
RUN mkdir /takuu-saatio
RUN cd /takuu-saatio && \
  git clone https://github.com/takuu-saatio/omatalous-scripts.git && \
  cd omatalous-scripts && \
  npm install
ADD assets/start.sh /
CMD /start.sh
