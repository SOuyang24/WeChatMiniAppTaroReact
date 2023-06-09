import { View, Image } from "@tarojs/components";
import { FC, useState } from "react";
import { Input, Button } from "@nutui/nutui-react-taro";
import Taro, { showToast } from "@tarojs/taro";
import { AUTH_TOKEN, USER_INFO } from "@/config/sessionKey";
import { signIn } from "./api";
import styles from "./index.module.scss";

export interface IAuthorizeProps {}
const Authorize: FC<IAuthorizeProps> = ({}) => {
  const [userName, setUserName] = useState("iotmaster@iotsharp.net");
  const [password, setPassword] = useState("285220Myh,,.");
  const handleLogin = () => {
    if (!userName)
      return showToast({ title: "请输入用户名", icon: "none", duration: 2000 });
    if (!password)
      return showToast({ title: "请输入密码", icon: "none", duration: 2000 });
    signIn({ password, userName, code: "1234" }).then(async (res: any) => {
      // @ts-ignore
      const {
        code,
        avatar,
        userName,
        token: { access_token },
      } = res;
      if (code === 10000) {
        await Taro.setStorage({
          key: AUTH_TOKEN,
          data: {
            accessToken: access_token,
          },
        });
        await Taro.setStorage({
          key: USER_INFO,
          data: {
            avatar,
            userName,
          },
        });
        Taro.switchTab({ url: "/pages/home/index" });
      } else {
        showToast({
          title: "用户名不存在或者密码错误",
          icon: "none",
          duration: 2000,
        });
      }
    });
  };
  return (
    <View className={styles.authorizeContainer}>
      <View className={styles.logo}>
        <Image
          className={styles.icon}
          src="https://oweqian.oss-cn-hangzhou.aliyuncs.com/miniApp/logo-icon.svg"
        />
        <Image
          className={styles.text}
          src="https://oweqian.oss-cn-hangzhou.aliyuncs.com/miniApp/logo-text.svg"
        />
      </View>
      <View className={styles.form}>
        <View className={styles.name}>
          <Input
            label=""
            placeholder="请输入用户名"
            leftIconSize="15"
            leftIcon="my2"
            defaultValue={userName}
            change={(val) => {
              setUserName(val);
            }}
          />
        </View>
        <View className={styles.password}>
          <Input
            label=""
            leftIconSize="15"
            placeholder="请输入密码"
            leftIcon="marshalling"
            type="password"
            defaultValue={password}
            change={(val) => {
              setPassword(val);
            }}
          />
        </View>
        <View className={styles.description}>
          登录即同意《IotSharp用户协议》和《IotSharp隐私政策》
          并使用微信授权登录
        </View>
        <Button type="primary" onClick={handleLogin}>
          登录
        </Button>
      </View>
    </View>
  );
};

export default Authorize;
