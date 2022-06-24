package com.reactnativeretubugly;

import androidx.annotation.NonNull;

import com.facebook.react.BuildConfig;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.module.annotations.ReactModule;
import com.tencent.bugly.crashreport.BuglyLog;
import com.tencent.bugly.crashreport.CrashReport;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = BuglyModule.NAME)
public class BuglyModule extends ReactContextBaseJavaModule {

	private ReactApplicationContext reactContext;

	public static final String NAME = "Bugly";

	public BuglyModule(ReactApplicationContext reactContext) {
		super(reactContext);
		this.reactContext = reactContext;
	}

	@Override
	@NonNull
	public String getName() {
		return NAME;
	}

	/**
	 * 初始化
	 *
	 * @param appId       应用ID 对应 https://bugly.qq.com 控制台应用ID
	 * @param strategyMap Bugly策略
	 */
	@ReactMethod
	public void init(String appId, ReadableMap strategyMap, final Promise promise) {
		try {
			boolean isDebug = BuildConfig.DEBUG;
			if (appId == null && "".equals(appId)) {
				promise.reject("-1", "appId不能为空");
				return;
			}
			if (strategyMap != null) {
				// 定制策略
				CrashReport.UserStrategy strategy = toUserStrategy(strategyMap);
				// 初始化带定制策略
				CrashReport.initCrashReport(this.reactContext, appId, isDebug, strategy);
			} else {
				// 初始化
				CrashReport.initCrashReport(this.reactContext, appId, isDebug);
			}
			// 开发设备？
			CrashReport.setIsDevelopmentDevice(this.reactContext, isDebug);
			promise.resolve(true);
		} catch (Exception e) {
			promise.reject("-1", e.getMessage());
		}
	}

	/**
	 * 将ReadableMap数据转策略
	 *
	 * @param strategyMap 策略Map
	 * @return 用户策略
	 */
	private CrashReport.UserStrategy toUserStrategy(ReadableMap strategyMap) {
		CrashReport.UserStrategy strategy = new CrashReport.UserStrategy(this.reactContext);
		// 设备唯一ID
		if (strategyMap.hasKey("deviceId")) {
			strategy.setDeviceID(strategyMap.getString("deviceId"));
		}
		// 设备型号
		if (strategyMap.hasKey("deviceModel")) {
			strategy.setDeviceModel(strategyMap.getString("deviceModel"));
		}
		// 渠道
		if (strategyMap.hasKey("appChannel")) {
			strategy.setAppChannel(strategyMap.getString("appChannel"));
		}
		// App版本
		if (strategyMap.hasKey("appVersion")) {
			strategy.setAppVersion(strategyMap.getString("appVersion"));
		}
		// app包名
		if (strategyMap.hasKey("appPackageName")) {
			strategy.setAppPackageName(strategyMap.getString("appPackageName"));
		}
		// 设置anr时是否获取系统trace文件，默认为false
		if (strategyMap.hasKey("enableCatchAnrTrace")) {
			strategy.setEnableCatchAnrTrace(strategyMap.getBoolean("enableCatchAnrTrace"));
		}
		// 设置是否获取anr过程中的主线程堆栈，默认为true
		if (strategyMap.hasKey("enableRecordAnrMainStack")) {
			strategy.setEnableRecordAnrMainStack(strategyMap.getBoolean("enableRecordAnrMainStack"));
		}
		return strategy;
	}


	/**
	 * 崩溃测试
	 */
	@ReactMethod
	public void testJavaCrash() {
		CrashReport.testJavaCrash();
	}

	/**
	 * 设置当前登录用户ID
	 *
	 * @param userId 用户ID
	 */
	@ReactMethod
	public void setUserId(String userId) {
		CrashReport.setUserId(userId);
	}

	/**
	 * 重置设备Id，将覆盖BuglyStrategy中的值
	 *
	 * @param deviceId 设备唯一ID
	 */
	@ReactMethod
	public void setDeviceId(String deviceId) {
		CrashReport.setDeviceId(this.reactContext, deviceId);
	}

	/**
	 * 重置设备型号，将覆盖BuglyStrategy中的值
	 *
	 * @param deviceModel 设备型号
	 */
	@ReactMethod
	public void setDeviceModel(String deviceModel) {
		CrashReport.setDeviceModel(this.reactContext, deviceModel);
	}


	/**
	 * 重置app渠道，将覆盖BuglyStrategy中的值
	 *
	 * @param appChannel 渠道
	 */
	@ReactMethod
	public void setAppChannel(String appChannel) {
		CrashReport.setAppChannel(this.reactContext, appChannel);
	}

	/**
	 * 重置app版本，将覆盖BuglyStrategy中的值
	 *
	 * @param appVersion app 版本
	 */
	@ReactMethod
	public void setAppVersion(String appVersion) {
		CrashReport.setAppVersion(this.reactContext, appVersion);
	}

	/**
	 * 重置app包名，将覆盖BuglyStrategy中的值
	 *
	 * @param appPackage app 包名
	 */
	@ReactMethod
	public void setAppPackage(String appPackage) {
		CrashReport.setAppPackage(this.reactContext, appPackage);
	}

	/**
	 * 设置crash和anr时是否获取全部堆栈
	 * 由于抓取全部堆栈接口 Thread.getAllStackTraces()
	 * 可能引起crash，建议只对少量用户开启
	 */
	@ReactMethod
	public void setAllThreadStackEnable(boolean crashEnable, boolean anrEnable) {
		CrashReport.setAllThreadStackEnable(this.reactContext, crashEnable, anrEnable);
	}

	/**
	 * 设置标签
	 * 自定义标签，用于标明App的某个“场景”。在发生Crash时会显示该Crash所在的“场景”，以最后设置的标签为准，标签id需大于0。
	 * 例：当用户进入界面A时，打上9527的标签
	 *
	 * @param id ID
	 */
	@ReactMethod
	public void setUserSceneTag(int id) {
		CrashReport.setUserSceneTag(this.reactContext, id);
	}

	/**
	 * 自定义Map参数可以保存发生Crash时的一些自定义的环境信息。
	 * 在发生Crash时会随着异常信息一起上报并在页面展示。
	 * 最多可以有9对自定义的key-value（超过则添加失败）；
	 * key限长50字节，value限长200字节，过长截断；
	 * key必须匹配正则：[a-zA-Z[0-9]]+。
	 *
	 * @param key   KEY
	 * @param value VALUE
	 */
	@ReactMethod
	public void putUserData(String key, String value) {
		CrashReport.putUserData(this.reactContext, key, value);
	}

	/**
	 * 自定义日志功能 我们提供了自定义Log的接口，
	 * 用于记录一些开发者关心的调试日志，可以更全面地反应App异常时的前后文环境。
	 * 该日志将在Logcat输出，并在发生异常时上报
	 *
	 * @param tag   tag
	 * @param log   日志
	 * @param level 日志等级
	 */
	@ReactMethod
	public void log(String tag, String log, String level) {
		switch (level) {
			case "v":
				BuglyLog.v(tag, log);
				break;
			case "d":
				BuglyLog.d(tag, log);
				break;
			case "i":
				BuglyLog.i(tag, log);
				break;
			case "w":
				BuglyLog.w(tag, log);
				break;
			case "e":
				BuglyLog.e(tag, log);
				break;
		}
	}

	/**
	 * 主动提交异常信息
	 * @param map 异常信息
	 * @param promise promise
	 */
	@ReactMethod
	public void postException(ReadableMap map, Promise promise) {
		try {
			int category = map.getInt("category");
			String errorType = map.getString("errorType");
			String errorMsg = map.getString("errorMsg");
			String stack = "";
			if (map.hasKey("stack")) {
				stack = map.getString("stack");
			}
			Map<String, String> extra = new HashMap<>();
			if (map.hasKey("extraInfo")) {
				ReadableMap extraInfo = map.getMap("extraInfo");
				ReadableMapKeySetIterator iterator = extraInfo.keySetIterator();
				while (iterator.hasNextKey()) {
					String key = iterator.nextKey();
					extra.put(key, map.getString(key));
				}
			}
			CrashReport.postException(category, errorType, errorMsg, stack, extra);
			promise.resolve(true);
		} catch (Exception e) {
			promise.resolve(e.getMessage());
		}
	}
}
