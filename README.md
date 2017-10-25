# loopback-demo-zos

- [Overview](#Overview)
- [Running the app](#running-the-app)

## Overview

The project has a server which exposes a set of backend APIs for a credit card
rewards program


## Running the app

```
$ git clone https://github.com/mmallick-ca/loopback-demo-zos.git
$ cd loopback-demo-zos
$ npm install
$ node .
```
In another shell:
```
$ curl http://localhost:3000/api/n/getPoints?Members=Monica&&Members=Chandler

```
You should see the amount of credit card rewards points that are available
for Monica and Chandler to redeem together.
