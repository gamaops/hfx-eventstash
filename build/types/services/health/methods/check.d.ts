import { sendUnaryData, ServerUnaryCall } from 'grpc';
import { IHealthCheckRequest, IHealthCheckResponse } from '../../../interfaces/healthcheck';
export declare const check: () => Promise<IHealthCheckResponse>;
declare const _default: () => (call: ServerUnaryCall<IHealthCheckRequest>, callback: sendUnaryData<IHealthCheckResponse>) => void;
export default _default;
