# @react-native-retu/bugly
[![NPM Version](https://img.shields.io/npm/v/@react-native-retu/bugly.svg)](https://npmjs.org/package/@react-native-retu/bugly)
[![npm total downloads](https://img.shields.io/npm/dt/@react-native-retu/bugly.svg)](https://img.shields.io/npm/dt/@react-native-retu/bugly.svg)
[![npm monthly downloads](https://img.shields.io/npm/dm/@react-native-retu/bugly.svg)](https://img.shields.io/npm/dm/@react-native-retu/bugly.svg)
[![npm weekly downloads](https://img.shields.io/npm/dw/@react-native-retu/bugly.svg)](https://img.shields.io/npm/dw/@react-native-retu/bugly.svg)
[![License](https://img.shields.io/npm/l/@react-native-retu/bugly.svg)](./LICENSE)

> 基于腾讯[bugly SDK](https://bugly.qq.com/) v4.0.4 实现，应用崩溃日志收集，让**BUG**🐛有迹可循。

## Installation
Using npm:

```shell
npm install --save @react-native-retu/bugly
```

or using yarn:

```shell
yarn add @react-native-retu/bugly
```

### 参数配置
#### Android
- 在AndroidManifest.xml中添加权限：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```
- 请避免混淆Bugly，在Proguard混淆文件中增加以下配置：
```
-dontwarn com.tencent.bugly.**
-keep public class com.tencent.bugly.**{*;}
```
#### iOS

--

## Usage

```js
import Bugly from "@react-native-retu/bugly";

componentDidMount() {
    // 征得用户同意上传崩溃日志
    ......
    // 初始化Bugly
    const strategy: BuglyStrategyConfig = {
        appChannel: "Google Play",
        appVersion: "1.0.0",
        appPackageName: "com.retu.example",
        deviceId: "983DFBBD-D047-4C53-908F",
        deviceModel: "XiaoMi 12",
    };
    Bugly.init("you appId", strategy);
}

// test crash
Bugly.testCrash();
```
## Example
```shell
git clone https://github.com/DengXiangHong/react-native-retu-bugly.git
cd example && yarn install
```
android
```shell
yarn android
```
ios
```shell
pod install
yarn ios
```
![](https://s1.ax1x.com/2022/06/28/jem9xg.png)

![](https://s1.ax1x.com/2022/06/28/jemPMQ.png)

![](https://s1.ax1x.com/2022/06/28/jem5es.png)

## API

|Method|Return Type|iOS|Android|
|------|-----------|:---:|:-----:|
| [testCrash()](#testCrash) | `void` | ✅ | ✅ |
| [init(appId: string, strategy: BuglyStrategyConfig)](#init) | `Promise<boolean>` | ✅ | ✅ |
| [setUserId(userId: string)](#setUserId) | `void` | ✅ | ✅ |
| [setDeviceId(deviceId: string)](#setDeviceId)| `void` | ❌ | ✅ |
| [setDeviceModel(deviceModel: string)](#setDeviceModel)| `void` | ❌ | ✅ |
| [setAppChannel(appChannel: string)](#setAppChannel)| `void` | ❌ | ✅ |
| [setAppVersion(appVersion: string)](#setAppVersion)| `void` | ✅ | ✅ |
| [setAppPackage(appPackage: string)](#setAppPackage)| `void` | ❌ | ✅ |
| [setAllThreadStackEnable(crashEnable: boolean, anrEnable: boolean)](#setAllThreadStackEnable)| `void` | ❌ | ✅ |
| [setUserSceneTag(id: number)](#setUserSceneTag)| `void` | ✅ | ✅ |
| [putUserData(key: string, value: string)](#putUserData)| `void` | ✅ | ✅ |
| [log(tag: string, log: string, level: LOG_LEVEL)](#log)| `void` | ✅ | ✅ |
| [postException(params: ExceptionParams)](#postException)| `Promise<boolean>` | ✅ | ✅ |

---

### testCrash()
```javascript
// 崩溃测试
Bugly.testCrash();
```
### init()
```javascript
// 初始化Bugly
const strategy: BuglyStrategyConfig = {
    appChannel: "Google Play",
    appVersion: "1.0.0",
    appPackageName: "com.retu.example",
    deviceId: "983DFBBD-D047-4C53-908F",
    deviceModel: "XiaoMi 12",
};
Bugly.init("you appId", strategy).then((isInit) => {
    console.log("Bugly init "+ isInit);
}).cache(error => console.error(error));
```
### setUserId()
```javascript
Bugly.setUserId("100");
```
### setDeviceId()
```javascript
// 重置设备型号，将覆盖BuglyStrategy中的值
Bugly.setDeviceId("983DFBBD-D047-4C53-908F");
```

### setDeviceModel()
```javascript
// 重置app渠道，将覆盖BuglyStrategy中的值
Bugly.setAppChannel("Google Play");
```

### setAppVersion()
```javascript
// 重置app版本，将覆盖BuglyStrategy中的值
Bugly.setAppVersion("1.0.1");
```
### setAppPackage()
```javascript
// 重置app包名，将覆盖BuglyStrategy中的值
Bugly.setAppPackage("com.retu.test");
```
### setAllThreadStackEnable()
```javascript
// 设置crash和anr时是否获取全部堆栈
Bugly.setAllThreadStackEnable(true, false);
```
### setUserSceneTag()
```javascript
// 设置标签
Bugly.setUserSceneTag(145);
```
### putUserData()
```javascript
// 自定义Map参数可以保存发生Crash时的一些自定义的环境信息。
Bugly.putUserData("userId", "120");
```
### log()
```javascript
// 该日志将在Logcat输出，并在发生异常时上报
Bugly.log("[Test]", "log test !", LOG_LEVEL.D);
```
### postException()
```javascript
// 上报自定义异常
const exception: ExceptionParams = {
    category: Platform.select({ ios: CATEGORY.IOS_JS, default: CATEGORY.ANDROID_JS }),
    errorType: 'React Native Exception Test',
    errorMsg: 'This React Native Exception Test',
    stack: 'This Test,This Test,This Test!!!',
};
Bugly.log('崩溃警告', '这是主动上报自定义崩溃', LOG_LEVEL.W);
Bugly.postException(exception).then(() => Alert.alert("上报成功", JSON.stringify(exception))).catch();
```

## Contributing

- [@DengXiangHong](https://github.com/DengXiangHong)

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
