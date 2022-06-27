import { NativeModules, Platform } from 'react-native';

/**
 * BuglyType
 * @author 双料特工穿山甲
 * @Date 2022/6/24
 * @github https://github.com/DengXiangHong/react-native-retu-bugly
 * @document Bugly SDK => https://bugly.qq.com/docs/user-guide/instruction-manual-android/?v=1.0.0
 */
export type BuglyType = {

	/**
	 * 崩溃测试
	 * TODO 删除
	 */
	testJavaCrash(): void

	/**
	 * 初始化
	 * @param appId APPID => Bugly应用ID （https://bugly.qq.com/v2/workbench/apps）
	 * @param strategy Bugly策略
	 */
	init(appId: string, strategy: BuglyStrategyConfig): Promise<boolean>

	/**
	 * 设置当前登录用户ID
	 * @param userId
	 */
	setUserId(userId: string): void

	/**
	 * 重置设备Id，将覆盖BuglyStrategy中的值
	 * @param deviceId
	 */
	setDeviceId(deviceId: string): void

	/**
	 * 重置设备型号，将覆盖BuglyStrategy中的值
	 * @param deviceModel
	 */
	setDeviceModel(deviceModel: string): void

	/**
	 * 重置app渠道，将覆盖BuglyStrategy中的值
	 * @param appChannel
	 */
	setAppChannel(appChannel: string): void

	/**
	 * 重置app版本，将覆盖BuglyStrategy中的值
	 * @param appVersion
	 */
	setAppVersion(appVersion: string): void

	/**
	 * 重置app包名，将覆盖BuglyStrategy中的值
	 * @param appPackage
	 */
	setAppPackage(appPackage: string): void

	/**
	 * 设置crash和anr时是否获取全部堆栈
	 * 由于抓取全部堆栈接口 Thread.getAllStackTraces()
	 * 可能引起crash，建议只对少量用户开启
	 */
	setAllThreadStackEnable(crashEnable: boolean, anrEnable: boolean): void

	/**
	 * 设置标签
	 * 自定义标签，用于标明App的某个“场景”。在发生Crash时会显示该Crash所在的“场景”，以最后设置的标签为准，标签id需大于0。
	 * 例：当用户进入界面A时，打上9527的标签
	 * @param id
	 */
	setUserSceneTag(id: number): void

	/**
	 * 自定义Map参数可以保存发生Crash时的一些自定义的环境信息。
	 * 在发生Crash时会随着异常信息一起上报并在页面展示。
	 * 最多可以有9对自定义的key-value（超过则添加失败）；
	 * key限长50字节，value限长200字节，过长截断；
	 * key必须匹配正则：[a-zA-Z[0-9]]+。
	 * @param key
	 * @param value
	 */
	putUserData(key: string, value: string): void

	/**
	 * 自定义日志功能 我们提供了自定义Log的接口，
	 * 用于记录一些开发者关心的调试日志，可以更全面地反应App异常时的前后文环境。
	 * 该日志将在Logcat输出，并在发生异常时上报
	 * @param tag
	 * @param log
	 * @param level
	 */
	log(tag: string, log: string, level: LOG_LEVEL): void

	/**
	 * 上报自定义异常
	 * @param params 异常信息
	 */
	postException(params: ExceptionParams): Promise<boolean>
};

// Bugly 策略 详情 => https://bugly.qq.com/docs/user-guide/advance-features-android/?v=1.0.0
export type BuglyStrategyConfig = {
	// 设备唯一ID
	deviceId?: string,
	// 设备型号
	deviceModel?: string,
	// 渠道
	appChannel?: string,
	// App版本
	appVersion?: string,
	// app包名
	appPackageName?: string,
	// 设置anr时是否获取系统trace文件，默认为false
	enableCatchAnrTrace?: boolean,
	// 设置是否获取anr过程中的主线程堆栈，默认为true
	enableRecordAnrMainStack?: boolean
}

// 异常信息
export type ExceptionParams = {
	// 类型
	category: CATEGORY,
	// 自定义名称，可以不传
	errorType?: string,
	// 错误信息
	errorMsg: string,
	// 堆栈
	stack?: string,
	// 附加数据
	extraInfo?: {
		[key: string]: string
	}
}

// 自主上传崩溃信息类型
export enum CATEGORY {
	IOS_COCOA = 3,
	IOS_CSHARP = 4,
	IOS_JS = 5,
	IOS_LUA = 6,
	ANDROID_JS = 8
}

// 日志等级
export enum LOG_LEVEL {
	V = 'v',
	D = 'd',
	I = 'i',
	W = 'w',
	E = 'e',
}

const LINKING_ERROR =
	`The package '@react-native-retu/bugly' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: '- You have run \'pod install\'\n', default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo managed workflow\n';

const Bugly = NativeModules.Bugly
	? NativeModules.Bugly
	: new Proxy(
		{},
		{
			get() {
				throw new Error(LINKING_ERROR);
			},
		},
	);

export default Bugly as BuglyType;
