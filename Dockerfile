# In a hurry- need to change this to ubuntu:18.10 or ubuntu:19.04 later
# This one works for now. - RC
FROM ruby:2.6.1

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs libleveldb-dev
RUN apt-get install -y libc6 libcurl3 zlib1g libtool autoconf libsodium-dev

WORKDIR /easy_ssb_pub
