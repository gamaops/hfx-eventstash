import { isLogstashHealthy } from '../logstash';

export const check = async (): Promise<any> => {
	const healthy = await isLogstashHealthy();
	return {
		status: healthy ? 'SERVING' : 'NOT_SERVING'
	};
};

export default () => (call: any, callback: any) => {
	check()
		.then((response) => callback(null, response))
		.catch(callback)
};