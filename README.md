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
$ curl -X POST -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/createAccount" (CREATE)
$ curl -X GET -d 'Members[]=Monica&&Members[]=Chandler' 'http://localhost:3000/api/Rewards/getPoints'  (READ)
$ curl -X PUT -H "Content-type:application/json" -d '{"claimedPoints":[{"Name":"Monica","Points":"1000"},{"Name":"Chandler","Points":"100"}]}' "http://localhost:3000/api/Rewards/claimPoints" (UPDATE)
$ curl -X DELETE -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/closeAccount" (DELETE)
```
Or use your browser and pass the following url:
```
http://localhost:3000/api/Rewards/getPoints?Members=Monica&&Members=Chandler

```

You should see the amount of credit card rewards points that Monica and Chandler can 
redeem together.
