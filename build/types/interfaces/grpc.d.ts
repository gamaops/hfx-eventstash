import { ServiceDefinition } from 'grpc';
import { IEventStashImplementation, TEventStashClient } from './eventstash';
import { IHealthImplementation, THealthClient } from './healthcheck';
export interface IPackageDefinition {
    hfx: {
        v1: {
            EventStash: TEventStashClient & {
                service: ServiceDefinition<IEventStashImplementation>;
            };
        };
    };
    grpc: {
        health: {
            v1: {
                Health: THealthClient & {
                    service: ServiceDefinition<IHealthImplementation>;
                };
            };
        };
    };
}
