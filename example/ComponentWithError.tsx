import React, { Component } from 'react'
/**
 * ComponentWithError
 */
export default class ComponentWithError extends Component {

	componentDidMount() {
		throw new Error('This is a test error thrown by ComponentWithError.')
	}

	public render() {
		return (
			<>
			</>
		);
	}
}

