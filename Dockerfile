FROM node:12-stretch-slim

WORKDIR /usr/src/hfxeventstash

RUN wget --progress=dot:mega https://artifacts.elastic.co/downloads/logstash/logstash-7.3.0.tar.gz && \
	tar -xvzf logstash-7.3.0.tar.gz && \
	rm -rf logstash-7.3.0.tar.gz && \
	mv logstash-7.3.0 logstash && \
	apt-get update -y && \
	mkdir -p /usr/share/man/man1 && \
	apt-get install python2.7 default-jre -y

COPY package*.json ./

RUN npm install --loglevel verbose

COPY . .

RUN npm run build

CMD [ "node", "build/index.js" ]