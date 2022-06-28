#import "RetuBugly.h"
#import <Bugly/Bugly.h>
#import <React/RCTConvert.h>

@implementation RetuBugly

RCT_EXPORT_MODULE()

/**
 *    @brief 崩溃测试
 */
RCT_EXPORT_METHOD(testCrash)
{
    @throw [NSException exceptionWithName:@"this bugly test exception"
                                   reason:@"这是Bugly测试异常"
                                 userInfo:nil];
}

/**
 *    @brief Bugly初始化
 *
 *    @param appId          appId
 *    @param params        参数
 *    @param resolver
 *    @param resolver
 */
RCT_EXPORT_METHOD(init:(NSString *)appId params:(NSDictionary *)aParams resolver:(RCTPromiseResolveBlock)aResolve rejecter:(RCTPromiseRejectBlock)aReject)
{
    BuglyConfig *buglyConfig = [[BuglyConfig alloc] init];
    @try {
        buglyConfig.version = [RCTConvert NSString:[aParams objectForKey:@"appVersion"]];
        buglyConfig.channel = [RCTConvert NSString:[aParams objectForKey:@"appChannel"]];
        buglyConfig.deviceIdentifier = [RCTConvert NSString:[aParams objectForKey:@"deviceId"]];
        buglyConfig.reportLogLevel = BuglyLogLevelWarn;
        [Bugly startWithAppId:appId developmentDevice:NO config:buglyConfig];
        aResolve(@(YES));
    } @catch (NSException *exception) {
        NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:-1 userInfo:[exception userInfo]];
        aReject([exception name], [exception reason], error);
    }
}

/**
 *    @brief 设置用户ID
 *
 *    @param userId        用户ID
 */
RCT_EXPORT_METHOD(setUserId:(NSString *)userId)
{
    [Bugly setUserIdentifier:userId];
}

/**
 *    @brief 设置设备ID
 *
 *    @param setDeviceId        设备ID
 */
RCT_EXPORT_METHOD(setDeviceId:(NSString *)setDeviceId)
{
    // TODO
}

/**
 *    @brief 设置设备型号
 *
 *    @param deviceModel        设备型号
 */
RCT_EXPORT_METHOD(setDeviceModel:(NSString *)deviceModel)
{
    // TODO
}

/**
 *    @brief 设置渠道
 *
 *    @param appChannel        渠道
 */
RCT_EXPORT_METHOD(setAppChannel:(NSString *)appChannel)
{
    // TODO
}

/**
 *    @brief 设置APP版本
 *
 *    @param appVersion        APP版本
 */
RCT_EXPORT_METHOD(setAppVersion:(NSString *)appVersion)
{
    [Bugly updateAppVersion:appVersion];
}

/**
 *    @brief 设置APP包名
 *
 *    @param appPackage        APP包名
 */
RCT_EXPORT_METHOD(setAppPackage:(NSString *)appPackage)
{
    // TODO
}

/**
 *    @brief 设置crash和anr时是否获取全部堆栈 由于抓取全部堆栈接口 Thread.getAllStackTraces() 可能引起crash，建议只对少量用户开启
 *
 *    @param crashEnable
 *    @param anrEnable
 */
RCT_EXPORT_METHOD(setAllThreadStackEnable:(BOOL *)crashEnable:(BOOL *)anrEnable)
{
    // TODO
}

/**
 *    @brief  打印日志
 *
 *    @param level           日志级别
 *    @param tag                日志模块分类
 *    @param log                日志内容 总日志大小限制为：字符串长度30k，条数200
 */
RCT_EXPORT_METHOD(log:(NSString *)tag:(NSString *)log:(NSString *)level)
{
    BuglyLogLevel logLevel;
    if([@"v" isEqual:level]) {
        logLevel = BuglyLogLevelVerbose;
    }else if([@"i" isEqual:level]) {
        logLevel = BuglyLogLevelInfo;
    }else if([@"w" isEqual:level]) {
        logLevel = BuglyLogLevelWarn;
    }else if([@"e" isEqual:level]) {
        logLevel = BuglyLogLevelError;
    }else if([@"d" isEqual:level]) {
        logLevel = BuglyLogLevelDebug;
    }else {
        logLevel = BuglyLogLevelSilent;
    }
    [BuglyLog level:logLevel tag:tag log:log, nil];
}

/**
 *  设置关键数据，随崩溃信息上报
 *
 *  @param value KEY
 *  @param key VALUE
 */
RCT_EXPORT_METHOD(putUserData:(NSString *)userKey:(NSString *)userValue)
{
    [Bugly setUserValue:userValue forKey:userKey];
}

/**
 *  设置标签
 *
 *  @param tag 标签ID，可在网站生成
 */
RCT_EXPORT_METHOD(setUserSceneTag:(NSUInteger)tag)
{
    [Bugly setTag:tag];
}

/**
 *    @brief 上报自定义错误
 *
 *    @param params                 参数
 *    @param resolver
 *    @param resolver
 */
RCT_EXPORT_METHOD(postException:(NSDictionary *)params resolver:(RCTPromiseResolveBlock)aResolve rejecter:(RCTPromiseRejectBlock)aReject)
{
    @try {
        NSInteger category = [RCTConvert NSInteger:[params objectForKey:@"category"]];
        NSString *errorType = [RCTConvert NSString:[params objectForKey:@"errorType"]];
        NSString *errorMsg = [RCTConvert NSString:[params objectForKey:@"errorMsg"]];
        NSString *stack = [RCTConvert NSString:[params objectForKey:@"stack"]];
        NSArray *stackTraceArray = [stack componentsSeparatedByString:@""];
        NSDictionary *extraInfo = [RCTConvert NSDictionary:[params objectForKey:@"extraInfo"]];
        if(extraInfo == nil) {
            extraInfo = [NSMutableDictionary dictionary];
        }
        [Bugly reportExceptionWithCategory:category name:errorMsg reason:errorType callStack:stackTraceArray extraInfo:extraInfo terminateApp:NO];
        aResolve(@(YES));
    } @catch (NSException *exception) {
        NSError *error = [NSError errorWithDomain:NSURLErrorDomain code:-1 userInfo:[exception userInfo]];
        aReject([exception name], [exception reason], error);
        
    }
}

@end
