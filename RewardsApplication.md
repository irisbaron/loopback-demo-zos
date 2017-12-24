## Part B: Do-it-yourself: Create a Rewards Application
This scenario guides you through the steps to create the 4 APIs for the TorCC credit card to use and the backend application. By the end of the session, you will know how to create and deploy the APIs.

1. [Project Setup](#project-setup)
2. [Linking a Datasource](#linking-a-datasource)
3. [Generating Model Objects](#generating-model-objects)
4. [Generating Relationships Between Models](#generating-relationships-between-models)
5. [Application Initialization](#application-initialization)
6. [Adding Application Logic](#adding-application-logic)
7. [Explore APIs and Test the Application](#explore-apis-and-test-the-application)

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

In this step we add models to the project. A _LoopBack model_ is a JavaScript object that represents backend data such as databases. They are stored in JSON format and specify properties and other characteristics of the API. Models are connected to backend systems via data sources. Every LoopBack application has a set of default models, which you can extend to suit your application's requirements. You can also define custom models. For more information on models, see [Defining models (LoopBack documentation)](http://loopback.io/doc/en/lb3/Defining-models.html).

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

### Explore APIs and Test the Application

Now that we have backend logic we can test the application itself. 

From the project directory at the root folder type:

```bash
npm install
node .
```


See [Explore APIs and Test Application](#explore-apis-and-test-application) in Part A.
