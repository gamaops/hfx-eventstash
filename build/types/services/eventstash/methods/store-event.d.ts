/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { sendUnaryData, ServerReadableStream } from 'grpc';
import { IStoreEventRequest, IStoreEventResponse } from '../../../interfaces/eventstash';
export interface IStoreEventConfig {
    logstash: ChildProcess;
}
declare const _default: ({ logstash, }: IStoreEventConfig) => (call: ServerReadableStream<IStoreEventRequest>, callback: sendUnaryData<IStoreEventResponse>) => void;
export default _default;
