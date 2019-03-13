FROM alpine:3.9

RUN mkdir /projects
WORKDIR /projects
COPY ./scripts/ /projects/

RUN apk add --update nodejs nodejs-npm yarn

#compile all sub dir
RUN ["chmod", "+x", "./prod.sh"]
ENTRYPOINT [ "sh", "-c", "./prod.sh" ]

# RUN ["chmod", "+x", "./dev.sh"]
# ENTRYPOINT [ "sh", "-c", "./dev.sh" ]