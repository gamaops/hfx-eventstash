/// <reference types="node" />
import { ChildProcess } from 'child_process';
export interface IStoreEventConfig {
    logstash: ChildProcess;
}
declare const _default: ({ logstash }: IStoreEventConfig) => (call: any, callback: any) => void;
export default _default;
