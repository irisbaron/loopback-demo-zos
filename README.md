
# Node.js on z/OS Sample Application

## Create Rewards Program APIs and deploy on z/OS

In this developer journey we will build a Node.js backend application on z/OS. The application accesses information that resides on z/OS and provides an API that can later be consumed by frontend applications and services. This developer journey will highlight the benefits of hosting the Node.js application on z/OS and will provide an introduction to Node.js development for traditional z/OS developers.

Node.js is a very popular platform for developing scalable enterprise API tier. Built upon the JavaScript programming language, Node.js enables millions of developers to build and collaborate across frontend and backend aspects of an application. Furthermore, the Node.js community has and continue to develop a plethora of frameworks and modules to enable rich web applications.  In this developer journey, we will focus on one such open-source framework - LoopBack.  LoopBack is a highly-extensible, open-source framework, that allows you to create end-to-end REST APIs with minimum coding effort. It allows for agile development and quick iterations for expanding and growing an enterprise solution. As Node.js is platform neutral, the development can be done on any platform independent on the deployment. Node.js on z/OS is now a first-class enterprise offering, making it ideal for hosting backend applications which require access to z/OS assets while providing performance, scalability and security. In this developer journey we showcase the business challenges that a typical customer on IBM Z might experience. We share a case study about a fictitious _TorCC_ credit card company, and how they leverage the capabilities of the z/OS system.

The TorCC credit card company provides a complex reward system as incentive program for its customers. It allows members to share their reward points. The company wishes to create a backend application that provides an API to query the status of the reward program, based on the member name or set of names. The resulting API can then be used by web or mobile applications (the frontend) for members to query the status of their reward points, whether individually or shared. It can also be used by other frontend applications, for example, to create internal reports or use analytics to provide recommendations to the members.

The objective of this application is to enable a highly scalable set of APIs that can support large volumes of concurrent transactions, while ensuring that confidential information, such as user and credit card data, are never exposed to an external network or cloud.  Given the massive volume of data and transactions TorCC credit card company handles, they host the data on z/OS. To provide best security and performance, the company decides to host their backend application on the same system, the z/OS system, where the data resides.  Co-location of the application with the data allows TorCC credit card to take advantage of the high levels of performance, reliability, security and scalability that z/OS provides, while also benefiting from improved response time and throughput performance accessing the data.  With sensitive or confidential data hosted on z/OS, co-locating the application on the same platform reduces the risk of data breaches, and avoids the monetary costs of ETL'ing the data.  If the APIs are well designed, there will be no confidential communication exposed on the external network between the frontend and the backend.

In addition, having the backend application on the same system as the data will also reduce cost of power, footprint, cooling, and decrease system complexity and management efforts, compared to a solution on a remote or distributed system.

## Flow / Architecture

The backend server communicates with data assets on the z/OS system and generates 4 APIs to query and manage the reward program.

![FlowArchitectureDiagram](./media/FlowArchitecture.png?raw=true)

1. Create a Node.js rewards program application with LoopBack framework.
2. Deploy the Node.js application on z/OS to benefit from collocation advantages such as performance and security.
3. Expose the rewards program APIs. The credit card and customer info remains secure in the z/OS.
4. Explore, test and consume the APIs created.

## Featured Technologies

- [Node.js](https://nodejs.org/en/) - An asynchronous event driven JavaScript runtime, designed to build scalable applications
- [LoopBack](https://loopback.io/) - A popular open-source Node.js framework for creating APIs
- [npm](https://www.npmjs.com/) - package manager for the JavaScript programming language included with Node.js installation

## System Requirements

**Node.js**

Node.js is the server-side JavaScript platform. If you do not have Node.js installed, you can find the installer for your platform at [Node.js](https://nodejs.org/en/). For z/OS see [IBM SDK for Node.js on z/OS](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos). Please note, you can get a free trial version of Node.js on z/OS for testing at [free 90-day trial (SMP/E format)](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos/purchase) with installations instructions [here](https://www.ibm.com/support/knowledgecenter/SSTRRS_6.0.0/com.ibm.nodejs.zos.v6.doc/install.htm) or at [Node.js SDK on z/OS trial (pax format)](https://developer.ibm.com/node/sdk/ztp/) (downloads and instructions). Please follow the installation instructions provided, in particular for the pax format trial version. 

Verify installation with:

```bash
node --version
```

**LoopBack**

LoopBack is an open-source framework to rapidly build APIs in Node.js. To install LoopBack type the following:

```bash
npm install -g loopback-cli        # Install the Loopback Client
lb -v                              # Print Loopback version to validate client installation.
```

**Git**

Git is a distributed version control system. You can get [git for z/OS from Rocket Software.](http://www.rocketsoftware.com/zos-open-source/tools).

**cURL**

cURL is command line tool for transfer data in different protocols. You can get [cURL for z/OS from Rocket Software.](http://www.rocketsoftware.com/zos-open-source/tools).


## Application Walkthrough

This section provides introduction experience into Node.js, to showcase the ease of writing Node.js applications and to familiarize with LoopBack concepts and components. It provides a couple of paths of engagement designed for different levels of experience.

In our scenario, the TorCC credit card company holds data regarding the members, the credit cards and the reward programs. It provides a rewards program in which multiple members share the reward program. TorCC wants to expose APIs for frontend or mobile usage, to query and manage the reward program. In our example, we generate 4 APIs to deal with the rewards programs:

1. create a program
2. query the status
3. delete/close a program
4. claim points

These APIs cover the full spectrum of create, retrieve, update and delete (CRUD) functions.

![FlowArchitectureDiagram](./media/Models.png?raw=true)

While this developer journey targets z/OS users, you can create and run the application on any platform, in particular as our example data resides in memory, and is not tied to the platform. In practice z/OS customers probably have their data reside in DB2 or other asset on z/OS and thus will benefit from deploying the backend application on z/OS and collocating the application and the data.

The first part provides basic steps to run the application as is and get familiarized with the APIs. Deploying it on a z/OS system would demonstrate that Node.js on z/OS is a first class citizen and it behaves similarly to any other platforms. By the end of this part, you will have setup your environment and know how to run a Node.js application and how to explore its APIs.

The second part guides you through the steps to recreate our rewards application. It provides basic information about LoopBack concepts such as datasources, models and relations. By the end of this part you should have the knowledge to create your own simple LoopBack application.


## Steps ##
To experience with the rewards application, ether by running it or creating it yourself, you first need to clone the repository locally. 

```bash
git clone https://github.com/ibmruntimes/loopback-demo-zos
```
On z/OS run the following:

```bash
git clone git://github.com/ibmruntimes/loopback-demo-zos
```

Alternatively, download the developer journey code as a zip file from [here](https://github.com/ibmruntimes/loopback-demo-zos/archive/master.zip). On z/OS, use 'unzip -a' to unzip

### Part A: Deploy the Rewards Application

This part guides you through the steps to run the application and explore the APIs and test the application. By the end of the session you will understand the APIs and be able to explore and test the APIs created.
  
#### Run the Application

In the developer journey code directory, install the node module dependencies with `npm`, and run the application.

```bash
cd loopback-demo-zos
npm install
node .
```

The output shows the customers, credit cards and rewards program created. It will also include the following lines: 

```javascript
Web server listening at: http://0.0.0.0:3000
Browse your REST API at http://0.0.0.0:3000/explorer
```                             

#### Explore APIs and Test Application

The application launches a http server listening on the default port 3000. You can explore your REST APIs created at [http://localhost:3000/explorer](http://localhost:3000/explorer). This URL lists all the APIs exposed by the application and available for use.  In the explorer, you can expand the APIs by selecting `List Operations` to see its details and also test them.

To test a specific API from the web browser, append the API name followed by the parameters in JSON format to the base URL. In our example, the base URL is:   [http://localhost:3000/api/Rewards](http://localhost:3000/api/Rewards). Alternatively, use the `curl` command from the command-line in another shell/terminal. You can also invoke the API remotely by specifying the hostname instead of localhost.

In our example, we provided 4 APIs to handle the rewards program: getPoints, claimPoints, createProgram and closeProgram. The parameters for those API is list of members in JSON format. The table below provides description of the expected parameters and some examples to follow:

You can test these APIs as follows:

- createAccount

        curl -X POST -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/createAccount" 
        
- getPoints

        curl -X GET -d "Members[]=Monica&&Members[]=Chandler" "http://localhost:3000/api/Rewards/getPoints" 
You should see the amount of credit card rewards points that Monica and Chandler can redeem together:`{'TotalPoints';:11500}`

- claimPoints

        curl -X PUT -H "Content-type:application/json" -d '{"claimedPoints":[{"Name":"Monica","Points":"1000"},{"Name":"Chandler","Points":"100"}]}' "http://localhost:3000/api/Rewards/claimPoints" 
You should see the amount of credit card rewards points remaining in the program:
`{"Status":{"Status":"Success","RemainingPoints":10400}`

- closeAccount

        curl -X DELETE -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/closeAccount" 

### Part B: Do-it-yourself: Create the Rewards Application

For the steps to create your own Rewards application, please follow this link to [RewardsApplication.md](https://github.com/ibmruntimes/loopback-demo-zos/blob/master/RewardsApplication.md).
