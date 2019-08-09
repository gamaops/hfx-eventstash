import { ChannelCredentials, Client, ClientWritableStream, handleClientStreamingCall, requestCallback } from 'grpc';

export enum IEventFormat {
	PROTOBUF = 'PROTOBUF',
	JSON = 'JSON',
}

export type TEventFormat = IEventFormat | string;

export interface IStoreEventRequest {
	format: TEventFormat;
	data: Buffer | Uint8Array;
	kind: string;
	id?: string;
}

export interface IStoreEventResponse {
	success: boolean;
}

export interface IEventStashImplementation {
	storeEvent: handleClientStreamingCall<IStoreEventRequest, IStoreEventResponse>;
}

export interface IEventStashClient extends Client {
	storeEvent(callback: requestCallback<IStoreEventResponse>): ClientWritableStream<IStoreEventRequest>;
}

export type TEventStashClient = new (
	address: string,
	credentials: ChannelCredentials,
	options?: any,
) => IEventStashClient;
