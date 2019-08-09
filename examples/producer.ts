require('dotenv-defaults').config();

import makeClient from '../src/client';
import { loadProtos } from '../src/load-protos';
import uuidv4 from 'uuid/v4';

const client = makeClient({
	uri: process.env.EVENTSTASH_RPC_URI!
});
const protos = loadProtos();
const AddressBook = protos.lookupType('contact.AddressBook');
const addressbook = {
	people:[
		{
			name: 'John Doe',
			email: 'john.doe@foo.bar',
			phones: [
				{
					number: '+55 (11) 1111-1111',
					type: 1
				}
			]
		}
	]
};
const addressbookProtobuf = AddressBook.encode(addressbook).finish();
const call = client.eventStash.storeEvent((error: any, response: any) => {
	console.log('Error:', error);
	console.log('Response:', response);
});
const interval = setInterval(() => {
	console.log('Sending events');
	call.write({
		format: 'JSON',
		kind: 'contact.AddressBook',
		data: Buffer.from(JSON.stringify(addressbook))
	});
	call.write({
		format: 'PROTOBUF',
		kind: 'contact.AddressBook',
		id: uuidv4(),
		data: addressbookProtobuf
	});
	console.log('Sent events');
}, 4000);

const close = () => {
	clearInterval(interval);
	call.end();
	process.exit(0);
};

process.on('SIGINT', close);
process.on('SIGTERM', close);