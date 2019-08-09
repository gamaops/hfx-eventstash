import { ChannelCredentials, Client, ClientUnaryCall, handleUnaryCall, requestCallback } from 'grpc';

export enum IServingStatus {
	UNKNOWN = 'UNKNOWN',
	SERVING = 'SERVING',
	NOT_SERVING = 'NOT_SERVING',
}

export type TServingStatus = IServingStatus | string;

export interface IHealthCheckRequest {
	service?: string;
}

export interface IHealthCheckResponse {
	status: TServingStatus;
}

export interface IHealthImplementation {
	check: handleUnaryCall<IHealthCheckRequest, IHealthCheckResponse>;
}

export interface IHealthClient extends Client {
	check(request: IHealthCheckRequest, callback: requestCallback<IHealthCheckResponse>): ClientUnaryCall;
}

export interface IHealthClientAsync extends IHealthClient {
	checkAsync(request: IHealthCheckRequest ): Promise<IHealthCheckResponse>;
}

export type THealthClient = new (address: string, credentials: ChannelCredentials, options?: any) => IHealthClient;
