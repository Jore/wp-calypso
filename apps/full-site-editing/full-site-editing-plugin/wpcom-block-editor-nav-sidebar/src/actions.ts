/**
 * Internal dependencies
 */
import { PostStatus } from './types';

const toggleSidebar = () =>
	( {
		type: 'TOGGLE_SIDEBAR',
	} as const );

const receievePostStatuses = ( statuses: Record< string, PostStatus > ) =>
	( {
		type: 'RECEIVE_POST_STATUSES',
		statuses,
	} as const );

const receievePostStatusesFailed = ( error: object ) =>
	( {
		type: 'RECEIVE_POST_STATUSES_FAILED',
		error,
	} as const );

export const actions = {
	toggleSidebar,
	receievePostStatuses,
	receievePostStatusesFailed,
};

export type Action = ReturnType<
	typeof toggleSidebar | typeof receievePostStatuses | typeof receievePostStatusesFailed
>;
