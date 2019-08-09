import { IEventStashImplementation } from '../../interfaces/eventstash';
import storeEvent, { IStoreEventConfig } from './methods/store-event';

export default (config: IStoreEventConfig): IEventStashImplementation => ({
	storeEvent: storeEvent(config),
});
