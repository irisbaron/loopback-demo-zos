
# Node.js on z/OS - Create Rewards Program APIs and deploy on z/OS

In this tutorial, we will build a Node.js backend application on z/OS. The application accesses information that resides on z/OS and provides an API that can later be consumed by frontend applications and services. This tutorial will highlight the benefits of hosting the Node.js application on z/OS and will provide an introduction to Node.js development for traditional z/OS developers.

Node.js is a very popular platform for developing scalable enterprise API tier. Built upon the JavaScript programming language, Node.js enables millions of developers to build and collaborate across frontend and backend aspects of an application. Furthermore, the Node.js community has and continue to develop a plethora of frameworks and modules to enable rich web applications.  In this tutorial, we will focus on one such open-source framework - LoopBack.  LoopBack is a highly-extensible, open-source framework, that allows you to create end-to-end REST APIs with minimum coding effort. It allows for agile development and quick iterations for expanding and growing an enterprise solution. As Node.js is platform neutral, the development can be done on any platform independent on the deployment. Node.js on z/OS is now a first-class enterprise offering, making it ideal for hosting backend applications which require access to z/OS assets while providing performance, scalability and security. In this tutorial we showcase the business challenges that a typical customer on IBM Z might experience. We share a case study about a fictitious _TorCC_ credit card company, and how they leverage the capabilities of the z/OS system.

The TorCC credit card company provides a complex reward system as incentive program for its customers. It allows members to share their reward points. The company wishes to create a backend application that provides an API to query the status of the reward program, based on the member name or set of names. The resulting API can then be used by web or mobile applications (the frontend) for members to query the status of their reward points, whether individually or shared. It can also be used by other frontend applications, for example, to create internal reports or use analytics to provide recommendations to the members.

The objective of this application is to enable a highly scalable set of APIs that can support large volumes of concurrent transactions, while ensuring that confidential information, such as user and credit card data are never exposed to an external network or cloud.  Given the massive volume of data and transactions TorCC credit card company handles, they host the data on z/OS. To provide best security and performance, the company decides to host their back-end application on the same system, the z/OS system, where the data resides.  Co-location of the application with the data allows TorCC credit card to take advantage of the high of levels of performance, reliability, security and scalability that z/OS provides, while also benefiting from improved response time and throughput performance accessing the data.  With sensitive or confidential data hosted on z/OS, co-locating the application on the same platform reduces the risk of data breaches, and avoids the monetary costs of ETL&#39;ing the data.  If the APIs are well designed, there will be no confidential communication exposed on the external network between the frontend and the backend.

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

## Application Walkthrough

This section provides introduction experience into Node.js, to showcase the ease of writing Node.js applications and to familiarize with LoopBack concepts and components. It provides a couple of paths of engagement designed for different levels of experience.

In our scenario, the TorCC credit card company holds data regarding the members, the credit cards and the reward programs. It provides a rewards program in which multiple members share the reward program. TorCC wants to expose APIs for frontend or mobile usage, to query and manage the reward program. In our example, we generate 4 APIs to deal with the rewards programs:

1. create a program
2. query the status
3. delete/close a program
4. claim points

These APIs cover the full spectrum of create, retrieve, update and delete (CRUD) functions

While this tutorial targets z/OS users, you can create and run the application on any platform, in particular as our example data resides in memory, and is not tied to the platform. In practice z/OS customers probably have their data reside in DB2 or other asset on z/OS and thus will benefit from deploying the backend application on z/OS and collocating the application and the data.

The first part provides basic steps to run the application as is and get familiarized with the APIs. Deploying it on a z/OS system would demonstrate that Node.js on z/OS is a first class citizen and it behaves similarly to any other platforms. By the end of this part, you will have setup your environment and know how to run a Node.js application and how to explore its APIs.

The second part guides you through the steps to recreate our rewards application. It provides basic information about LoopBack concepts such as datasources, models and relations. By the end of this part you should have the knowledge to create your own simple LoopBack application.

## System Requirements

**Node.js**

Node.js is the server-side JavaScript platform. If you do not have Node.js installed, you can find the installer for your platform at [Node.js](https://nodejs.org/en/). For z/OS see [IBM SDK for Node.js on z/OS](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos). Please note, you can get a free trial version of Node.js on z/OS for testing at [free 90-day trial (SMP/E format)](https://www.ibm.com/us-en/marketplace/sdk-nodejs-compiler-zos/purchase) with installations instructions [here](https://www.ibm.com/support/knowledgecenter/SSTRRS_6.0.0/com.ibm.nodejs.zos.v6.doc/install.htm) or at [Node.js SDK on z/OS trial (pax format)](https://developer.ibm.com/node/sdk/ztp/) (downloads and instructions).

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

Git is a distributed version control system. You can get git for [z/OS from Rocket Software.](http://www.rocketsoftware.com/zos-open-source/tools).

**cURL**

cURL is command line tool for transfer data in different protocols. You can get [cURL for z/OS from Rocket Software.](http://www.rocketsoftware.com/zos-open-source/tools).


## Steps ##

### Part A: Deploy the Rewards Application

This part guides you through the steps to deploy the rewards program application. By the end of the session you will understand the APIs and be able to explore and test the APIs created.

1. [Clone the repo](#clone-the-repo)
2. [Run the Application](#run-the-application)
3. [Explore APIs and test application](#explore-apis-and-test-application)

### Part B: Do-it-yourself: Create the Rewards Application

This scenario guides you through the steps to create the 4 APIs for the TorCC credit card to use and the backend application. By the end of the session, you&#39;ll know how to create and deploy the APIs.

1. [Project Setup](#project-setup)
2. [Linking a Datasource](#linking-a-datasource)
3. [Generating Model Objects](#generating-model-objects)
4. [Generating Relationships Between Models](#generating-relationships-between-models)
5. [Application Initialization](#application-initialization)
6. [Adding Application Logic](#adding-application-logic)
7. [Explore API and Test](#explore-api-and-test-the-application)

## Part A: Deploy the Rewards Application

### Clone the repo

Clone the repo locally. In a terminal, run:

```bash
git clone https://github.com/ibmruntimes/loopback-demo-zos
```
On z/OS run the following:

```bash
git clone git://github.com/ibmruntimes/loopback-demo-zos
```

Alternatively, download the tutorial code as a zip file from [here](https://github.com/ibmruntimes/loopback-demo-zos/archive/master.zip).

### Run the Application

In the tutorial code directory, install the node module dependencies with `npm`, and run the application.

```bash
cd loopback-demo-zos
npm install
node .
```

The output will be:

```javascript
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

### Explore APIs and Test Application

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

## Part B: Do-it-yourself: Create the Rewards application

### Project setup

In this step we setup the environment for development.  This step is also called API scaffolding.

Navigate to an empty directory using your command line and type:

```bash
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

If you just hit Enter on the name of the application you will default to the directory you are currently in. In our case LoopBack will create a new directory called RewardsDemo for you.

Once you made all choices, npm install will run automatically and pull down all the project dependencies for you. For an explanation of all the files and directories that the tool creates, see [Project layout reference (LoopBack documentation)](http://loopback.io/doc/en/lb3/Project-layout-reference.html).

Now you have all the relevant parts for your development and can start building your API.

### Linking a Datasource

In this step we set up one or more datasource for the application. Datasources represent backend systems such as databases, external REST APIs, SOAP web services, and storage serviceFor more information, see [Defining data sources (LoopBack documentation)](http://loopback.io/doc/en/lb3/Connecting-models-to-data-sources).

For our example we generate three datasources: customers, credit cards and rewards programs. This might be the case in a real production environment where data is split across several databases.

To create a datasource, make sure you are in your project directory at the root folder. If you followed the step 1, type:

```bash
cd RewardsDemo
```

Type the following into your command line:

```bash
lb datasource
```

Just like the previous step, LoopBack will walk you through the necessary configuration steps. We will first create the customer datasource named `customerRecords`. Select the following options:

```
?Enter the datasource name: customerRecords
?Select the connector for customerRecords:In-memory db (supported by StrongLoop)
?window.localStorage key to use for persistence (browser only):
?Full path to file for persistence (server only):
```

For our example, we use the local in-memory datasource. We chose this option for simplicity, eliminating the need to control and manage a real data store. The in-memory datasource is built in to LoopBack and suitable for development and testing. LoopBack also provides several custom connectors for realistic back-end data store, such as DB2. Once under production you would choose the datasource that properly fit your setup.

The tool updates the applications OpenAPI (Swagger 2.0) definition file and the `server/datasources.json` file with settings for the new datasource. Here is the resulting declaration of the customerRecords in `datasources.json`:

```javascript
{
 "customerRecords": {
  "name": "customerRecords",
  "localStorage": "",
  "file": "",
  "connector": "memory"
  }
}
```

We showed the steps to create the customer datasource. Repeat this step to generate the credit-card and rewards program datasources, named `creditCardRecords` and `rewardsProgramRecords`, respectively.

### Generating Model Objects

In this step we add models to the project. A _LoopBack model_ is a JavaScript object that represents backend data such as databases. They are stored in JSON format and specify properties and other characteristics of the API. Models are connected to backend systems via data sources. Every LoopBack application has a set of default models, which you can extend to suit your application&#39;s requirements. You can also define custom models. For more information on models, see [Defining models (LoopBack documentation)](http://loopback.io/doc/en/lb3/Defining-models.html).

In our example we have three models: customer, credit-card and rewards. Each of these models has its own properties and connects to its respective datasource.  Here are the steps to generate the customer model.

In the project root directory, type the following:

```bash
lb model
```

Just like before, you'll be walked through the process of making a model object, all from the command line. Select the following options:

```
?Enter the model name: Customer

?Select the datasource to attach Customer to: customerRecords (memory)

?Select model's base class PersistedModel

?Expose Customer via the REST API? No

?Common model or server only? common

Let's add some Customer properties now.

Enter an empty property name when done.

?Property name: Name

invoke   loopback:property

?Property type:string

?Required?Yes

?Default value[leave blank for none]:

Let's add another Customer property.

Enter an empty property name when done.

?Property name:
```

After you get prompted to add another property, hit Enter to end the model creation dialog.

The result is two new files under `common/model` directory. The first is `customer.json` which keeps all model data in JSON format, and the other is `customer.js` which contains initial JavaScript code.

__customer.json:__

```javascript
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

__customer.js:__

```javascript
{
use strict;
module.exports = function(Customer) {
};
```

Repeat this step to create the following `CreditCard`  model with related properties.

```
Model: CreditCard
datasource: creditCardRecords
Model's base class: PersistentModel
Expose Credit-Card via the REST API : No
Common model or server only: common
```

| Property      | Type   | Required | Default value |
| ------------- | ------ | -------- | ------------  |
| AccountNumber | Number |   Y      |     No        |
| Points        | Number |   Y      |     No        |
| AccountType   | String |   Y      |     No        |


Now, we create the `Rewards` model.  Given this application is a Rewards applications, for the `Rewards` model, we would want to expose the model via REST APIs.

```
Model : Rewards
datasource: rewardsProgramRecords
Model's base class: PersistentModel
Expose Rewards via the REST API : Yes
Custom plural form (used to build REST URL):
Common model or server only: common
```
No properties are needed for the Rewards model.

At this point, you can explore the APIs created just by declaring the models.

### Generating Relationships between Models

Real-world applications typically consist of multiple models with connections between them. These connections are defined as relations between the models. When you define a relation for a model, LoopBack adds a set of methods to the model which allows to interact with other related models in order to query and filter data. For more information see [Creating Model Relations (LoopBack documentation)](http://loopback.io/doc/en/lb3/Creating-model-relations.html)

Our example contains the following relations:

- Customer hasMany credit cards
- Credit card belongsTo customer
- Customer belongsTo rewards
- Rewards hasMany customers

![Model Relations diagram](./media/ModelRelations.png?raw=true)

Here are the steps to create the Customer hasMany credit cards relation.

In the project root directory, type the following command:

```
lb relation
```

Loopback will step through the process of defining a relation. Select the following options:

```
?Select the model to create the relationship from: Customer
?Relation type:has many
?Choose a model to create a relationship with:(other)
?Enter the model name: CreditCard
?Enter the property name for the relation: creditCards
?Optionally enter a custom foreign key: customerId
?Require a through model? No
?Allow the relation to be nested in REST APIs: No 
?Disable the relation from being included:Yes
```

The result is seen in `common/model/customer.json`:

```
 "relations": {
    "creditCards": {
      "type": "hasMany",
      "model": "CreditCard",
      "foreignKey": "customerId"
    },
  
```

Repeat this step for the other relations mentioned above. Here is a table to assist with the option selection. You can also consult the code in the git repository.

|Relationship from| Relation type|Relationship with|Property name for the relation|Foreign key|
|-----------------|--------------|-----------------|------------------------------|-----------|
|Customer         | has many     |CreditCard       |creditCards                   |customerId |
|CreditCard       | belong to    |Customer         |customer                      |customerId |
|Customer         | belong to    |Rewards          |rewardsProgram                |programId  |
|Rewards          | has many     |Customer         |customers                     |programId  |

For the other options, enter the same responses as in the above Customer - CreditCard relation example.

    

### Application Initialization

The LoopBack provides a mechanism to initialize the application known as bootstrapping. When the application starts the LoopBack bootstrapper, it will configure the datasources, models and application settings. In addition, it runs the boot scripts under the `/server/boot` directory. This allows to preload code and initialize data for the application during startup. For more information [Defining boot scripts (LoopBack documentation)](https://loopback.io/doc/en/lb2/Defining-boot-scripts).

For our Rewards application, we initialize some data to be used for testing. For simplicity, clone the example in another directory.

```bash
git clone https://github.com/ibmruntimes/loopback-demo-zos
```

Then simply copy over the files under server/boot into your own server/boot directory.

### Adding Application Logic

LoopBack provides out-of-the-box model REST APIs that cover the CRUD functions for the model. In order to expose additional functionality we need to create custom methods, known as remote methods. These methods are static methods of a model, exposed over a custom REST endpoint. All of these methods should be under [model].js file.

For our example we added the following remote methods, with members names as parameters:

1. createAccount([names]) - create a rewards program account for current credit card holders.
2. getPoints([names]) - query customer information. Check to see if they belong to the same reward program and then collect all the points, aggregate and return the sum.
3. claimPoints([names]) - update users total points by making the appropriate updates to their credit card info.
4. closeAccount([names]) - delete an account if members chose to close the account.

The application highlights the security capability of having the backend application resides on same platform as the data. The credit card and customer information is not exposed and does not leave the platform. All the logic happens inside the platform, at the same location as the data.

For the application logic, you can write your own code for those methods. Alternatively, you can copy over the code (the .js files) from common/models in the example code into your projects common/model.

### Explore API and Test the Application

Now that we have backend logic we can test the application itself. 

From the project directory at the root folder type:

```bash
npm install
node .
```


See [Explore APIs and test application](#explore-apis-and-test-application) in Part A.
