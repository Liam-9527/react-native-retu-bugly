# @react-native-retu/bugly
[![NPM Version](https://img.shields.io/npm/v/@react-native-retu/bugly.svg)](https://npmjs.org/package/react-native-alipay-verify)
[![License](https://img.shields.io/npm/l/@react-native-retu/bugly.svg)](./LICENSE)

基于腾讯[bugly SDK](https://bugly.qq.com/) v4.0.4 实现，应用崩溃日志收集，让**BUG**🐛有迹可循

## Installation

```sh
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


## Usage

```js
import Bugly from "@react-native-retu/bugly";

// ...

const result = await Bugly.multiply(3, 7);
```

## Contributing

- [@DengXiangHong](https://github.com/DengXiangHong)

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
