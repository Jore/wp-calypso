/* eslint-disable import/no-extraneous-dependencies */
/**
 * External dependencies
 */
import { combineReducers, registerStore } from '@wordpress/data';
import type { Reducer } from 'redux';
import type { DispatchFromMap, SelectFromMap } from '@automattic/data-stores';
import { addQueryArgs } from '@wordpress/url';
import { apiFetch, controls } from '@wordpress/data-controls';

/**
 * Internal dependencies
 */
import { actions, Action } from './actions';
import { STORE_KEY } from './constants';
import { PostStatus } from './types';

const opened: Reducer< boolean, Action > = ( state = false, action ) => {
	switch ( action.type ) {
		case 'TOGGLE_SIDEBAR':
			return ! state;

		default:
			return state;
	}
};

const postStatuses: Reducer< Record< string, PostStatus >, Action > = ( state = {}, action ) => {
	switch ( action.type ) {
		case 'RECEIVE_POST_STATUSES':
			return action.statuses;

		default:
			return state;
	}
};

const reducer = combineReducers( { opened, postStatuses } );

type State = ReturnType< typeof reducer >;

const resolvers = {
	getPostStatuses: function* () {
		try {
			const response = yield apiFetch( {
				path: addQueryArgs( '/wp/v2/statuses' ),
			} );

			yield actions.receievePostStatuses( response );
		} catch ( err ) {
			yield actions.receievePostStatusesFailed( err );
		}
	},
};

const selectors = {
	isSidebarOpened: ( state: State ) => state.opened,
	getPostStatuses: ( state: State ) => state.postStatuses,
	getPostStatusName: ( state: State, statusSlug: string ) =>
		selectors.getPostStatuses( state )[ statusSlug ],
};

registerStore( STORE_KEY, {
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
} );

declare module '@wordpress/data' {
	function dispatch( key: typeof STORE_KEY ): DispatchFromMap< typeof actions >;
	function select( key: typeof STORE_KEY ): SelectFromMap< typeof selectors >;
}
