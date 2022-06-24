# @react-native-retu/bugly

tencent bugly

## Installation

```sh
npm install @react-native-retu/bugly
```
### 参数配置
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

### Android

### iOS

## Usage

```js
import Bugly from "@react-native-retu/bugly";

// ...

const result = await Bugly.multiply(3, 7);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
