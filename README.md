# Employee RESTful service

**Employee service** is a laboratory work from the course [Service Science and Management Engineering (SSME)](https://info.rtu.lv/rtupub/disc2/printDiscEn.28118/DSP707_Service-Science,-Management,-and-Engineering.pdf).  
This laboratory aims to demonstrate the implementation of a RESTful API definition adhering to OpenAPI Specification.  
The building blocks of this service are comprised of AWS cloud services, [API Gateway](https://aws.amazon.com/api-gateway/), [AWS Lambda](https://aws.amazon.com/lambda/) and [DynamoDB](https://aws.amazon.com/dynamodb/).

Service Provisioning
---

#### AWS Lambda Build Package
This repository contains a ready for deployment [build package](build/build.zip).

#### AWS Lambda Test Events

* Create Employee

```json
{"body":"{\"id\":\"5516a1f0-387e-4265-8859-6f676ba806d1\",\"jobTitle\":\"Architect\",\"email\":\"joe@mail.com\",\"name\":\"Joe Johnson\"}"}
```

* Get Employee by id

```json
{"pathParameters":{"id":"5516a1f0-387e-4265-8859-6f676ba806d1"}}
```

* Get Employees

```json
{}
```

Development
---

#### Requirements
* Docker
* Docker-compose
* Make
* Zip

#### Installation
Installation of packages is done via npm on docker.
```shell script
docker-compose up -d
```

#### Build
Build scripts are execute via make.
```shell script
make build
```
