# HFXEventStash

**HFXEventStash** is an event store implementation for NodeJS using gRPC and Logstash.

* Exposes an gRPC server and exports a gRPC client to easily store events
* You can store your events at every storage that Logstash supports
* Supports protobuf and json encoded messages
* Helm chart ready to deploy on Kubernetes as a DaemonSet
* Unit and E2E tested

```bash
npm install --save hfxeventstash
```

----------------------

## How it works

HFXEventStash uses [gRPC](https://grpc.io/) and [Logstash](https://www.elastic.co/products/logstash) to provide an asynchronous event store.

The exposed gRPC server has an endpoint that receives a stream of events and puts on Logstash's stdin to be stored in any storage system.

You can specify proto definitions for HFXEventStash, so you can send raw protobufs to server to be parsed into JSON to send to Logstash.

We provide a full implementation of Elasticsearch as an event store, but you're free to choose any output that Logstash can handle.

----------------------

## Configuration

HFXEventStash is configured through some environment variables and directories.

**Environment Variables:**

* **GRPC_BIND_ADDRESS** - An address and port to bind the gRPC server, the default value is: `0.0.0.0:42043`.
* **EVENTSTASH_RPC_URI** - This setting is only required when you're running the `healthcheck.js`, the default value is `127.0.0.1:42043`.
* **SHUTDOWN_TIMEOUT** - Maximum number of milliseconds to wait before forcing a shutdown, the default value is `15000`.
* **PROTOS_GLOB** - Glob pattern to load protobuf definitions to be parsed by server, the default value is `/var/lib/hfxeventstash/protos/**/*.proto`.
* **LOG_LEVEL** - The server's log level, accepted values are: error, warn, info or debug (default).
* **LOGSTASH_HEALTHCHECK_TIMEOUT** - Maximum number of milliseconds to wait Logstash healthcheck response before consider a failure, the default value is `5000`.

**Directories:**

* **/usr/src/hfxeventstash/lib** - Is passed as the *--path.settings* to Logstash.
* **/usr/src/hfxeventstash/lib/logstash.conf** - Is passed as the *-f* to Logstash.

----------------------

## Healthcheck

To do a healthcheck on HFXEventStash you just need to run `node build/healthcheck.js`, this process will return 0 if the server is healthy or 1 otherwise.

----------------------

## Stopping the server

HFXEventStash gRPC server accepts the *SIGINT* and *SIGTERM* signals to gracefuly shutdown everything, it'll close the server and wait for Logstash to exit (sendin a *SIGTERM*) if this whole process takes more than **SHUTDOWN_TIMEOUT** it'll be auto-killed. Be careful with the value of **SHUTDOWN_TIMEOUT** if you're using in memory queue storage on Logstash, it can cause data loss.

----------------------

## The event structure

This is the request protobuf definition of HFXEventStash server:

```protobuf
message StoreEventRequest {
  enum EventFormat {
    PROTOBUF = 0;
    JSON = 1;
  }
  // This enum defines the format of the "data" property
  EventFormat format = 1;
  // A buffer with data, can be a protobuf message or a JSON string buffer
  bytes data = 2;
  // This can be:
  //   1 - Just a label when the format is JSON 
  //   2 - The protobuf message's type to be parsed by HFXEventStash
  string kind = 3;
  // The ID of event, if you don't specify a value an UUIDv4 will be generated
  string id = 4;
}
```

And the response is:

```protobuf
message StoreEventResponse {
  bool success = 1;
}
```

----------------------

## If you're using Elasticsearch

We provide an standard and recommended configurations to store events in Elasticsearch, you can customize it to fit into your needs.

* **lib/template.json** - The recommended index template.
* **lib/logstash.conf** - The recommended Logstash's pipeline, you should adapt the connection parameters from `http://localhost:9200` to point to your Elasticsearch cluster/server.

----------------------

## Tutorial for Kubernetes server

----------------------

## Tutorial for Docker server

1. Setup your `logstash.conf`
2. Start the container: `docker run --rm -it -p 42043:42043 -v /path/to/your/logstash.conf:/usr/src/hfxeventstash/lib/logstash.conf hfxeventstash:stable`
3. If you want to run a healthcheck, enter in the container and execute: `node build/healthcheck.js`
	1. After executing the healthcheck you can see the process exit code using the following command: `echo $?`

----------------------

## Tutorial for clients

Take a look at the **examples** folder.

```typescript
import makeClient from 'hfxeventstash';

const client = makeClient({
  uri: '127.0.0.1:42043' // The gRPC HFXEventStash server address
});

const addressbook = {};

const call = client.eventStash.storeEvent((error, response) => {
  console.log('Error:', error);
  console.log('Response:', response);
});

call.write({
  format: 'JSON',
  kind: 'contact.AddressBook',
  data: Buffer.from(JSON.stringify(addressbook)),
});

call.end();
```