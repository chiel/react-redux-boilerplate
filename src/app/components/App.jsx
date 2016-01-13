'use strict';

import React       from 'react';
import { connect } from 'react-redux';

function App(props) {
	return (
		<div className="app">
			Hello {props.currentUser ? props.currentUser.firstname : 'world'}.
		</div>
	);
}

export default connect(state => ({
	currentUser: state.session.user
}))(App);
