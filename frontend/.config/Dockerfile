FROM alpine:3.9

RUN mkdir /projects
WORKDIR /projects
COPY ./scripts/ /projects/

RUN apk add --update nodejs nodejs-npm yarn

#compile all sub dir
RUN ["chmod", "+x", "./build.sh"]
ENTRYPOINT [ "sh", "-c", "./build.sh" ]