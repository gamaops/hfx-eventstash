import { IEventStashClient } from './interfaces/eventstash';
import { IHealthClientAsync } from './interfaces/healthcheck';
export interface IEventStashClientOptions {
    uri: string;
}
export interface IPackageClient {
    eventStash: IEventStashClient;
    health: IHealthClientAsync;
}
declare const _default: ({ uri, }: IEventStashClientOptions) => IPackageClient;
export default _default;
