import axios, { AxiosRequestConfig } from 'axios';
import { logger } from '../../logger';

export const isLogstashHealthy = async (): Promise<boolean> => {

	const requestOptions: AxiosRequestConfig = {
		timeout: parseInt(process.env.LOGSTASH_HEALTHCHECK_TIMEOUT || '5000'),
		responseType: 'json',
	};

	try {
		const processResponse = await axios.get('http://127.0.0.1:9600/_node/stats/process', requestOptions);
		const eventsResponse = await axios.get('http://127.0.0.1:9600/_node/stats/events', requestOptions);

		logger.info(processResponse.data, 'Logstash process stats response');
		logger.info(eventsResponse.data, 'Logstash events stats response');

		if (processResponse.data.status !== 'green' && eventsResponse.data.status !== 'green') {
			return false;
		}
	} catch (error) {
		logger.error(error, 'Logstash healthcheck error');
		return false;
	}

	return true;

};
