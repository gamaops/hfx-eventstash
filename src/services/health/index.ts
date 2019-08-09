import { IHealthImplementation } from '../../interfaces/healthcheck';
import check from './methods/check';

export default (): IHealthImplementation => ({
	check: check(),
});
