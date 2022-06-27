import React, { Component } from 'react';
import {
	Alert,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Bugly, { BuglyStrategyConfig, CATEGORY, ExceptionParams, LOG_LEVEL } from '@react-native-retu/bugly';
import { getBuildNumber, getBundleId, getDeviceNameSync, getUniqueId, getVersion } from 'react-native-device-info';
import ComponentWithError from './ComponentWithError';
import ErrorBoundary from 'react-native-error-boundary';

type State = {
	strategy: BuglyStrategyConfig,
	isShowErrorComponent: boolean
}
/**
 * @react-native-retu/bugly 使用演示
 * @author 双料特工_氚钐钾
 * @Date 2022/6/24
 * @github https://github.com/DengXiangHong/react-native-retu-bugly
 */
export default class App extends Component<any, State> {

	constructor(props: any) {
		super(props);
		this.state = {
			strategy: {},
			isShowErrorComponent: false,
		};
	}

	componentDidMount() {
		const strategy: BuglyStrategyConfig = {
			appChannel: 'Google Play',
			appVersion: getVersion() + '.' + getBuildNumber(),
			appPackageName: getBundleId(),
			deviceId: getUniqueId(),
			deviceModel: getDeviceNameSync(),
			enableCatchAnrTrace: true,
			enableRecordAnrMainStack: true,
		};
		this.setState({
			strategy,
		});
		const appId: string = Platform.select({ ios: 'd0a3cd7eb5', android: '49fc025c77', default: '' });
		// 初始化
		Bugly.init(appId, strategy).catch(error => Alert.alert(JSON.stringify(error)));

		// 设置用户ID
		Bugly.setUserId('100');
	}

	/**
	 * testJavaScript 空对象崩溃
	 * @private
	 */
	private static testJavaScriptCrash() {
		Bugly.log('崩溃警告', '即将发生崩溃，undefined Error!', LOG_LEVEL.W);
		const testObj = undefined;
		// @ts-ignore
		console.log(testObj.testError);
		// throw new Error('This Test JavaScript Crash');
	}

	/**
	 * 错误组件
	 * @private
	 */
	private testComponentWithError() {
		this.setState({
			isShowErrorComponent: true,
		});
	}

	/**
	 * 上传错误
	 * @private
	 */
	private postException() {
		const exception: ExceptionParams = {
			category: Platform.select({ ios: CATEGORY.IOS_JS, default: CATEGORY.ANDROID_JS }),
			errorType: 'React Native Exception Test',
			errorMsg: 'This React Native Exception Test',
			stack: '111111122222',
		};
		Bugly.log('崩溃警告', '这是主动上报自定义崩溃', LOG_LEVEL.W);
		Bugly.postException(exception).catch();
	}

	/**
	 * 错误处理
	 * @param error
	 * @param stackTrace
	 * @private
	 */
	private errorHandler(error: Error, stackTrace: string): void {
		this.setState({
			isShowErrorComponent: false
		})
		/* Log the error to an error reporting service */
		const exception: ExceptionParams = {
			category: Platform.select({ ios: CATEGORY.IOS_JS, default: CATEGORY.ANDROID_JS }),
			errorType: 'React Native JS Exception',
			errorMsg: error.message,
			stack: stackTrace,
		};
		Bugly.log('崩溃警告', '即将发生崩溃', LOG_LEVEL.W);
		Bugly.postException(exception).catch();
	}

	/**
	 * 错误视图
	 * @param props
	 */
	private static customFallback = (props: { error: Error, resetError: Function }) => (
		<SafeAreaView style={styles.containerError}>
			<View style={styles.content}>
				<Text style={styles.titleError}>Oops!</Text>
				<Text style={styles.subtitle}>{'There\'s an error'}</Text>
				<Text style={styles.error}>{props.error.message}</Text>
				<TouchableOpacity
					style={styles.buttonError}
					onPress={() => props.resetError()}>
					<Text style={styles.buttonTextError}>Try again</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)

	public render() {
		return (
			// @ts-ignore
			<ErrorBoundary
				FallbackComponent={(props) => App.customFallback(props)}
				onError={(error, stackTrace) => this.errorHandler(error, stackTrace)}>
				<View style={styles.container}>
					<StatusBar barStyle='dark-content' backgroundColor={'#FFFFFF'} />
					<Text style={styles.icon}>🐛</Text>
					<Text style={styles.title}>
						Bugly
					</Text>
					<Text style={styles.text}>
						Click on the following button to render a component that will throw an error.
					</Text>
					<ScrollView>
						<View style={{ alignItems: 'center' }}>
							<TouchableOpacity
								style={styles.button}
								onPress={() => Alert.alert('DeviceInfo', JSON.stringify(this.state.strategy))}
							>
								<Text style={styles.buttonText}>deviceInfo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => {
									Bugly.log('崩溃警告', '这是 testJavaCrash 发生的崩溃', LOG_LEVEL.W);
									Bugly.testJavaCrash();
								}}
							>
								<Text style={styles.buttonText}>testJavaCrash</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => App.testJavaScriptCrash()}
							>
								<Text style={styles.buttonText}>testJavaScriptCrash</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => this.testComponentWithError()}
							>
								<Text style={styles.buttonText}>testComponentWithError</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={() => this.postException()}
							>
								<Text style={styles.buttonText}>postException</Text>
							</TouchableOpacity>
						</View>
						{this.state.isShowErrorComponent ? <ComponentWithError /> : null}
					</ScrollView>
				</View>
			</ErrorBoundary>
		);
	}
}
const styles = StyleSheet.create({
	containerError: {
		backgroundColor: '#fafafa',
		flex: 1,
		justifyContent: 'center'
	},
	content: {
		marginHorizontal: 16
	},
	titleError: {
		fontSize: 48,
		fontWeight: '300',
		paddingBottom: 16,
		color: '#000'
	},
	subtitle: {
		fontSize: 32,
		fontWeight: '800',
		color: '#000'
	},
	error: {
		paddingVertical: 16
	},
	buttonError: {
		backgroundColor: '#2196f3',
		borderRadius: 50,
		padding: 16
	},
	buttonTextError: {
		color: '#fff',
		fontWeight: '600',
		textAlign: 'center'
	},
	errorView: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 20
	},
	center: {
		alignItems: 'center',
		marginVertical: 10,
	},
	button: {
		backgroundColor: '#4784ec',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
		height: 40,
		paddingHorizontal: 40,
		borderRadius: 10,
	},
	buttonText: {
		color: '#FFFFFF',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 10,
		backgroundColor: '#ecf0f1',
		padding: 8,
		textAlign: 'center',
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		textAlign: 'center',
		marginVertical: 10,
	},
	icon: {
		fontSize: 48,
	},
	text: {
		marginVertical: 16,
		marginHorizontal: 10,
	},
});
