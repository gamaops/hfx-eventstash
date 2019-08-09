import { sendUnaryData, ServerUnaryCall } from 'grpc';
import { IHealthCheckRequest, IHealthCheckResponse } from '../../../interfaces/healthcheck';
import { isLogstashHealthy } from '../logstash';

export const check = async (): Promise<IHealthCheckResponse> => {
	const healthy = await isLogstashHealthy();
	return {
		status: healthy ? 'SERVING' : 'NOT_SERVING',
	};
};

export default () => (call: ServerUnaryCall<IHealthCheckRequest>, callback: sendUnaryData<IHealthCheckResponse>) => {
	check()
		.then((response) => callback(null, response))
		.catch((error) => {
			callback(error, null);
		});
};
