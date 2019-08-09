import storeEvent, { IStoreEventConfig } from './methods/store-event';

export default (config: IStoreEventConfig) => ({
	storeEvent: storeEvent(config)
});