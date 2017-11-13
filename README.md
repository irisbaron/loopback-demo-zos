
# Node.js on z/OS – Create Rewards Program APIs and deploy it on z/OS

## Overview

In this tutorial, we will build a Node.js backend application on z/OS. The application accesses information that resides on z/OS and provides an API that can later be consumed by frontend applications and services. This tutorial will highlight the benefits of hosting the Node.js application on z/OS and will provide an introduction to Node.js development for traditional z/OS developers.

Node.js is a very popular platform for developing scalable enterprise API tier. Built upon the JavaScript programming language, Node.js enables millions of developers to build and collaborate across frontend and backend aspects of an application. Furthermore, the Node.js community have and continue to develop a plethora of frameworks and modules to enable rich web applications.  In this tutorial, we will focus on one such open-source framework - LoopBack.  LoopBack is a highly-extensible, open-source framework, that allows you to create end-to-end REST APIs with minimum coding effort. It allows for agile development and quick iterations for expanding and growing the enterprise solution. As Node.js is platform neutral, the development can be done on any platform independent on the deployment. Node.js on z/OS is now a first-class enterprise offering, making it ideal for hosting backend applications which require access to z/OS assets while providing performance, scalability and security. In this tutorial we showcase the business challenges that a typical customer on IBM Z might experience. We share a case study about a fictitious _TorCC_ credit card company, and how they leverage the capabilities of the z/OS system.

The TorCC credit card company provides a complex reward system as incentive program for its customers. It allows members to share their reward points. The company wishes to create a backend application that provides an API to query the status of the reward program, based on the member name or set of names. The resulting API can then be used by web or mobile applications (the frontend) for members to query the status of their reward points, whether individually or shared. It can also be used by other frontend applications, for example, to create internal reports or use analytics to provide recommendations to the members.

The objective of this application is to enable a highly scalable set of APIs that can support large volumes of concurrent transactions, while ensuring that confidential information, such as user and credit card data are never exposed to an external network or cloud.  Given the massive volume of data and transactions TorCC Credit Card handle, they host the data on z/OS. To provide best security and performance, the company decides to host their back-end application on the same system, the z/OS system, where the data resides.  Co-location of the application with the data allows TorCC Credit Card to take advantage of the high of levels of performance, reliability, security and scalability that z/OS provides, while also benefiting from improved response time and throughput performance accessing the data.  With sensitive or confidential data hosted on z/OS, co-locating the application on the same platform reduces the risk of data breaches, and avoids the monetary costs of ETL&#39;ing the data.  If the APIs are well designed, there will be no confidential communication exposed on the external network between the frontend and the backend.

In addition, having the backend application on the same system as the data will also reduce cost of power, footprint, and cooling and decrease system complexity and management efforts, compared to a solution on a remote or distributed system.

## Flow/Architecture

The backend server communicates with data assets on the z/OS system and generates 4 APIs to query and manage the reward program.

![Alt text](./media/FlowArchitecture.png?raw=true)

 1.Create a Node.js rewards program application with LoopBack framework.
 2.Deploy the Node.js application on z/OS to benefit from collocation advantages such as performance and security.
 3.Expose the rewards program APIs. The Credit card and customer info remains secure in the z/OS.
 4.Explore, test and consume the APIs created.

## Featured technologies

- [Node.js](https://nodejs.org/en/) - An asynchronous event driven JavaScript runtime, designed to build scalable applications
- [LoopBack](https://loopback.io/) - A popular open-source Node.js framework for creating API
- [npm](https://www.npmjs.com/) - package manager for the JavaScript programming language. Included with Node.js installation

## Application Walkthrough

This section provides introduction experience into Node.js, to showcase the ease of writing Node.js applications and to familiarize with LoopBack concepts and components. It provides a couple of paths of engagement designed for different levels of experience.

In our scenario, the TorCC credit card company holds data regarding the members, the credit cards and the reward programs. It provides rewards program in which multiple members share the reward program. TorCC CC wants to expose APIs for frontend or mobile usage, to query and manage the reward program. In our example, we generate 4 APIs to deal with the rewards programs:

1. create a program
2. query the status
3. delete/close a program
4. claim points

These APIs cover the full spectrum of create, retrieve, update and delete (CRUD) functions

While this tutorial targets z/OS users, you can create and run the application on any platform, in particular as our example data resides in memory, and is not tight to the platform. In practice z/OS customers probably have their data resides in DB2 or other asset on z/OS and thus will benefit from deploying the backend application on z/OS and collocating the application and the data.

The first part provides basic steps to run the application as is and get familiarize with the APIs. Deploying it on z/OS system would demonstrate that Node.js on z/OS is a first class citizen and it behaves similarly to any other platform. By the end of this part, you should setup your environment and know how to run a Node.js application and how to explore its APIs.

The second part guides you through the steps to recreate our rewards application. It provides basic information about LoopBack concepts such as datasources, models and relations. By the end of this part you should have the knowledge to create your own simple LoopBack application.

## System requirements

**Node.js**
Node.js is the server-side JavaScript platform. If you do not have Node.js installed, you can find the installer for your platform at [Node.js](https://nodejs.org/en/). For z/OS see [IBM SDK for Node.js on z/OS](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos). Please note, you can get a free trial version of Node.js on z/OS for testing at [free 90-day trial (SMP/E format)](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos/purchase) with installations instructions [here](https://www.ibm.com/support/knowledgecenter/SSTRRS_6.0.0/com.ibm.nodejs.zos.v6.doc/install.htm) or at [Node.js SDK on z/OS trial (pax format)](https://developer.ibm.com/node/sdk/ztp/) (downloads and instructions).

Verify installation:

```
node -v
```

**LoopBack**
LoopBack is an open-source framework to rapidly build APIs in Node.js. To install LoopBack type the following:

```
npm install -g loopback-cli

lb -v
```

## Part A: Deploy the Rewards Application

This part guides you through the steps to deploy the rewards program application. By the end of the session you will understand the APIs and be able to explore and test the APIs created.

1. [Clone the repo](#clone-the-repo)
2. [Run the Application](#run-the-application)
3. [Explore APIs and test application](#explore-apis-and-test-application)

## Part B: Do-it-yourself: Create the Rewards Application

This scenario guides you through the steps to create the 4 APIs for the TorCC Credit Card to use and the backend application. By the end of the session, you&#39;ll know how to create and deploy the APIs.

1. [Project Setup](#project-setup)
2. [Linking a Datasource](#linking-a-datasource)
3. [Generating Model Objects](#generating-model-objects)
4. [Relating your Model Objects](#relating-your-model-objects)
5. [Application Initialization](#application-initialization)
6. [Creating Application Logic](#creating-application-logic)
7. [Explore Your API](#explore-your-api)

Part A: Deploy the Rewards Application

### 1. Clone the repo

Clone the repo locally. In a terminal, run:
git clone https://github.com/ibmruntimes/loopback-demo-zos

### 2. Run the Application

```
cd loopback-demo-zos

npm install

node .
```

The output will be:

```
Customer created:  { Name: 'Ross', programId: null, id: 1 }
Customer created: { Name: 'Rachel', programId: null, id: 2 }
rewardsProgram created:  { id: 1 }
rewardsProgram created:  { id: 2 }
CreditCard created:  { AccountNumber: 2,
  Points: 1000,
  AccountType: 'Silver',
  customerId: 1,
  id: 1 }
Creditcard created:  { AccountNumber: 6,
  Points: 30000,
  AccountType: 'Platnium',
  customerId: 2,
  id: 2 }
Customer created  { Name: 'Joey', programId: 1, id: 3 }
Customer created  { Name: 'Phoebe', programId: 1, id: 4 }
Customer created:  { Name: 'Chandler', programId: 2, id: 5 }
Customer created:  { Name: 'Monica', programId: 2, id: 6 }
Web server listening at: http://0.0.0.0:3000
Browse your REST API at http://0.0.0.0:3000/explorer
CreditCard created:  { AccountNumber: 4,
  Points: 20000,
  AccountType: 'Platinum',
  customerId: 3,
  id: 3 }
CreditCard created:  { AccountNumber: 3,
  Points: 10000,
  AccountType: 'Platinum',
  customerId: 4,
  id: 4 }
CreditCard created:  { AccountNumber: 1,
  Points: 1500,
  AccountType: 'Gold',
  customerId: 5,
  id: 5 }
CreditCard created:  { AccountNumber: 5,
  Points: 10000,
  AccountType: 'Platnium',
  customerId: 6,
  id: 6 }
```                             

### 3. Explore APIs and Test Application

Once the application is running, there is a http server listens on port 3000, which is the default port. You can explore your REST APIs created at [http://0.0.0.0:3000/explorer](http://0.0.0.0:3000/explorer). This URL will list all the APIs exposed by the application and available to use by the frontend.
In the explorer, you can expend the API to see its details and also test it.

To test specific API from the web browser, append the API name followed by the parameters in JSON format to the base URL. In our example the base URL is:   [http://localhost:3000/api/Rewards](http://localhost:3000/api/Rewards). Alternatively, use the curl command from the commanline in another shell.

In our example we provided 4 APIs to handle the rewards program: getPoints, claimPoints, createProgram and closeProgram. The parameters for those API is list of members in JSON format. The table below provides description of the expected parameters and some examples to follow:

You can test these APIs as follows:

- createAccount
```
$ curl -X POST -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/createAccount" 
```
- getPoints
```
curl -X GET -d "Members[]=Monica&&Members[]=Chandler" "http://localhost:3000/api/Rewards/getPoints" 
```
You should see the amount of credit card rewards points that Monica and Chandler can redeem together:{&quot;TotalPoints&quot;:11500}

- claimPoints
```
$ curl -X PUT -H "Content-type:application/json" -d '{"claimedPoints":[{"Name":"Monica","Points":"1000"},{"Name":"Chandler","Points":"100"}]}' "http://localhost:3000/api/Rewards/claimPoints" 
```
You should see the amount of credit card rewards points remaining in the program:
{"Status":{"Status":"Success","RemainingPoints":10400}

- closeAccount
```
$ curl -X DELETE -d "Members[]=Ross&&Members[]=Rachel" "http://localhost:3000/api/Rewards/closeAccount" 
```

## Part B: Do-it-yourself: Create the Rewards application

### 1. Project setup

In this step we setup the environment for development.  This step is also called API scaffolding.

Navigate to an empty folder using your command line and type:

```
lb
```

It will start the Yeoman generator, and allow you to make selections about your API using the command line. To recreate our Rewards application, select the following options:

```
? What's the name of your application? RewardsDemo
? Enter name of the directory to contain the project: (RewardsDemo)
? Which version of LoopBack would you like to use? 3.x (current)
? **What kind of application do you have in mind?** empty-server (An empty LoopBack
API, without any configured models or datasources)
```

If you just hit Enter on the name of the application., you will default to the folder you are currently in. In our case LoopBack will create a new folder called RewardsDemo for you.

Once you made all choices, npm install will run automatically and pull down all the project dependencies for you. For an explanation of all the files and directories that the tool creates, see [Project layout reference (LoopBack documentation)](http://loopback.io/doc/en/lb3/Project-layout-reference.html).

Now you have all the relevant parts for your development and can start building your API.

### 2. Linking a Datasource

In this step we set up one or more datasource for the application. Datasources represent backend systems such as databases, external REST APIs, SOAP web services, and storage serviceFor more information, see [Defining data sources (LoopBack documentation)](http://loopback.io/doc/en/lb3/Connecting-models-to-data-sources).

For our example we generate three datasources: customers, credit cards and rewards programs. This might be the case in a real production environment where data is split across several databases.

To create a datasource, make sure you are in your project directory at the root folder. If you followed the step 1, type:

```
cd RewardsDemo
```
Type the following into your command line:
```
lb datasource
```
Just like the previous step, LoopBack will walk you through the necessary configuration steps. We will first create the customer datasource. For this select the following options:

```
?Enter the datasource name:customerRecords
?Select the connector for customerRecords:In-memory db (supported by StrongLoop)
?window.localStorage key to use for persistence (browser only):
?Full path to file for persistence (server only):

For our example, we use the local in-memory datasource. We chose this option for simplicity, eliminating the need to control and manage a real data store. The in-memory datasource is built in to LoopBack and suitable for development and testing. LoopBack also provides several custom connectors for realistic back-end data store, such as DB2. Once under production you would choose the datasource that properly fit your setup.

The tool updates the applications OpenAPI (Swagger 2.0) definition file and the server/datasources.json file with settings for the new datasource. Here is the resulting declaration of the customerDB

{
 "customerRecords": {
  "name": "customerRecords",
  "localStorage": "",
  "file": "",
  "connector": "memory"
  }
}
```

datasource.json

We showed steps to create the customer datasource. Similarly, repeat this step to generate the credit-card and rewards program datasources, named creditCardRecords and rewardsProgramRecords, respectively.

### 3. Generating Model Objects

In this step we add models to the project. A _LoopBack model is_ a JavaScript object that represents backend data such as databases. They are stored in JSON format and specify properties and other characteristics of the API. Models are connected to backend systems via data sources. Every LoopBack application has a set of default models, which you can extend to suit your application&#39;s requirements. You can also define custom models. For more information on models, see [Defining models (LoopBack documentation)](http://loopback.io/doc/en/lb3/Defining-models.html).

In our example we have three models: customer, credit-card and rewards. Each of these models has its own properties and connects to its respective datasource.

Here are the steps to generate the customer model.

Still in the project directory at the root folder, type the following:

```
lb model
```

Just like before, you&#39;ll be walked through the process of making a model object, all from the command line. Select the following options:

```
?Enter the model name:Customer

?Select the datasource to attach Customer to:customerRecords (memory)

?Select model's base classPersistedModel

?Expose Customer via the REST API? No

?Common model or server only? common

Let's add some Customer properties now.

Enter an empty property name when done.

?Property name:name

invoke   loopback:property

?Property type:string

?Required?Yes

?Default value[leave blank for none]:

Let's add another Customer property.

Enter an empty property name when done.

?Property name:
```

After you get prompted to add another property, hit Enter to end the model creation dialog.

The result is two new files under common/model directory. The first is customer.json which keeps all model data in JSON format, and the other is customer.js which is javascript initial code.

```
{
  "name": "Customer",
  "base": "PersistedModel",
  "idInjection": true,
  "options": {
    "validateUpsert": true
  },
  "properties": {
    "Name": {
      "type": "string",
      "required": true
    }
  },
  "validations": [],
  "relations": {},
  "acls": [],
  "methods": {}
}

```
customer.json

```
{

use strict;

module.exports = function(Customer) {

};

```

customer.js

Repeat this step for the following models:

```
Model: credit-card
datasource: CreditCardRecords
Model's base class: PersistentModel
Expose Credit-Card via the REST API : No
Common model or server only: common
```

| Property | Type | Required | Default value |
| --- | --- | --- | --- |
| AccountNumber | Number | true |   |
| Points | Number | true |   |
| AccountType | String | true |   |

```
Model : reward
datasource: rewardsProgramRecords
Model's base class: PersistentModel
Expose Credit-Card via the REST API : Yes
Custom plural form (used to build REST URL):
Common model or server only: common
```
No properties needed for the Rewards model.

At this point you can explore the APIs created just by declaring the models.

#### 4. Building the Model Relations

In a real-world application with multiple models, you typically need to define relations between the models. When you define a relation for a model, LoopBack adds a set of methods to the model. For more information see [Creating Model Relations (LoopBack documentation)](http://loopback.io/doc/en/lb3/Creating-model-relations.html)

Our example contains the following relations:

- Customer hasMany credit cards
- Credit card belongsTo customer
- Customer belongsTo rewards
- Rewards hasMany customers

Here are the steps to create the Customer hasMany credit cards relation.

Still in the project directory at the root folder, type the following into your command line:

```
lb relation
```
Just like before, you will be walked through the process of making a relation, all from the command line. Select the following options:

```
?Select the model to create the relationship from:Customer
?Relation type:has many
?Choose a model to create a relationship with:(other)
?Enter the model name:CreditCard
?Enter the property name for the relation:creditCards
?Optionally enter a custom foreign key:customerId
?Require a through model? No
?Allow the relation to be nested in REST APIs: No 
?Disable the relation from being included:Yes
```

Repeat this step for the other relations mentioned above.

### 5. Application Initialization

The LoopBack provides a mechanism to initialize the application, also known as bootstrapping. When the application starts the LoopBack bootstrapper configures the datasources, models and application settings. In addition, it runs the boot scripts under the /server/boot directory. For more information [Defining boot scripts (LoopBack documentation)](https://loopback.io/doc/en/lb2/Defining-boot-scripts).

For our Rewards application, we initialize some data to be used for testing. For simplicity, clone the example in another directory.
```
git clone https://github.com/ibmruntimes/loopback-demo-zos
```
Then simply copy over the files under server/boot into your own server/boot directory.

### 6. Adding Application Logic

LoopBack provides out-of-the-box model REST APIs that cover the CRUD functions for the model. In order to expose additional functionality we need to create custom methods, known as remote methods. These methods are static methods of a model, exposed over a custom REST endpoint. All of these methods should be under [model].js file.

For our example we added the following remote methods, with members names as parameters:

1. createAccount([names]) - create a rewards program account for current credit card holders.
2. getPoints([names]) - query customer information. Check to see if they belong to the same reward program and then collect all the points, aggregate and return the sum.
3. claimPoints([names]) - update users total points by making the appropriate updates to their credit card info.
4. closeAccount([names]) - delete an account if members chose to close the account.

The application highlights the security capability of having the backend application resides on same platform as the data. The credit card and customer information is not exposed and does not leave the platform. All the logic happens inside the platform, at the same location as the data.**

For the application logic, you can write your own code for those methods. Alternatively, you can copy over the code (the .js files) from common/models in the example code into your projects common/model.

### 7. Explore your API and Test the Application

Now that we have backend logic we can test the application itself. 

From the project directory at the root folder type:

```
npm install

node .
```


See [Explore APIs and test application](#explore-apis-and-test-application) in Part A.
