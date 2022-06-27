import React, { Component } from 'react'
/**
 * ComponentWithError
 * @author 双料特工_氚钐钾
 * @Date 2022/6/24
 * @github https://github.com/DengXiangHong/react-native-retu-bugly
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

