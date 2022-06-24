import React, { Component } from 'react';
import {
	Text,
	Alert,
	SafeAreaView,
	ScrollView,
	StatusBar,
	TouchableOpacity,
	StyleSheet, View, Platform,
} from 'react-native';
import Bugly, { BuglyStrategyConfig, CATEGORY, ExceptionParams } from '@react-native-retu/bugly';
import {
	getBundleId,
	getUniqueId,
	getVersion,
	getBuildNumber,
	getDeviceNameSync,
} from 'react-native-device-info';

type State = {
	strategy: BuglyStrategyConfig
}
/**
 * @react-native-retu/bugly 使用演示
 * @author 双料特工穿山甲
 * @Date 2022/6/24
 * @github https://github.com/DengXiangHong/react-native-retu-bugly
 */
export default class App extends Component<any, State> {

	constructor(props: any) {
		super(props);
		this.state = {
			strategy: {}
		}
	}

	componentDidMount() {
		const strategy: BuglyStrategyConfig = {
			appChannel: "Google Play",
			appVersion: getVersion()+"("+getBuildNumber()+")",
			appPackageName: getBundleId(),
			deviceId: getUniqueId(),
			deviceModel: getDeviceNameSync(),
			enableCatchAnrTrace: true,
			enableRecordAnrMainStack: true
		}
		this.setState({
			strategy
		})
		const appId: string = Platform.select({ios: "d0a3cd7eb5", android: "49fc025c77", default: ""});
		// 初始化
		Bugly.init(appId, strategy).catch(error => Alert.alert(JSON.stringify(error)));
		// 设置用户ID
		Bugly.setUserId("100");
	}

	/**
	 * testJavaScript 空对象崩溃
	 * @private
	 */
	private static testJavaScriptCrash() {
		console.error("this test react-native crash");
	}

	private postException() {
		const exception: ExceptionParams = {
			category: Platform.select({ios: CATEGORY.IOS_JS, default: CATEGORY.ANDROID_JS}),
			errorType: "React Native Exception Test",
			errorMsg: "This React Native Exception Test",
			stack: this.context,
			extraInfo: {
				errorCode: "103"
			}
		}
		Bugly.postException(exception).catch(error => Alert.alert(JSON.stringify(error)));
	}

	public render() {
		return (
			<>
				<StatusBar barStyle="dark-content" backgroundColor={"#FFFFFF"}/>
				<SafeAreaView>
					<View style={styles.center}>
						<Text style={styles.title}>
							Bugly
						</Text>
					</View>
					<ScrollView>
						<View style={{alignItems: 'center'}}>
							<TouchableOpacity
								style={styles.button}
								onPress={()=> Alert.alert("DeviceInfo", JSON.stringify(this.state.strategy))}
							>
								<Text style={styles.buttonText}>deviceInfo</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={()=> Bugly.testJavaCrash()}
							>
								<Text style={styles.buttonText}>testJavaCrash</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={()=> App.testJavaScriptCrash()}
							>
								<Text style={styles.buttonText}>testJavaScriptCrash</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={styles.button}
								onPress={()=> this.postException()}
							>
								<Text style={styles.buttonText}>postException</Text>
							</TouchableOpacity>
						</View>
					</ScrollView>
				</SafeAreaView>
			</>
		);
	}
}
const styles = StyleSheet.create({
	center: {
		alignItems: 'center',
		marginVertical: 10
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	button: {
		backgroundColor: "#4784ec",
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
		height: 40,
		paddingHorizontal: 40,
		borderRadius: 10
	},
	buttonText: {
		color: "#FFFFFF"
	}
})
