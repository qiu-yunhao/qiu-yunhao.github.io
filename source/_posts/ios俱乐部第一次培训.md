----

title: ios俱乐部第一次培训

dtae: 2022-4-23

tags: ios

----

简单的写点东西

<!-- more -->

## 1.科学上网

节点网址 https://speed17.com/#/login

建议一个月一买，防止vpn突然跑路

## 2.github的基本用法

### 1.下载

[网址]( https://git-scm.com/downloads)，根据个人的环境不同选择对应版本安装

windows可参考<https://www.cnblogs.com/xueweisuoyong/p/11914045.html>的前8步

### 2.在github官网注册账号

网址<https://github.com/>

### 3.git配置

参考 <https://www.jianshu.com/p/9976cffe7485>

### 4.github关联远端

在用户名下点击新建

![](https://s3.bmp.ovh/imgs/2022/04/22/0dfef9c91dd902da.png)

![](https://s3.bmp.ovh/imgs/2022/04/22/ab4dbb9efc9c4aeb.png)

输入仓库的名字，不要和已有的有冲突，直接下一步（来到如图所示的地方）



![](https://s3.bmp.ovh/imgs/2022/04/22/3581d750fcd229b9.png)

本地新建一个文件夹，最好和库同名（可以避免不必要的麻烦）

然后右键文件夹，选择用终端（或者git bash）打开，将这个 create a new ...... 下面的代码复制，然后丢进去，回车

![](https://s3.bmp.ovh/imgs/2022/04/22/0bbbc00a23796cf5.png)

### 5.github上传

现场演示

余下的更内容请活用google

## 3.swift的语法基础

### 1.swift中的数据

swift中引用分为变量(var)和常量(let), 常量具体的感觉可参考java的final和c的const

```swift
let a = UILabel()
var b = UILabel()

a = b //报错
a = UILabel() //再让a指向新的文字板，报错

b = a
b = UILabel() //都是正常的
```

### 2.基本数据类型与语法

这个部分，就简单的代码部分，与C++，java的语法结构和相似，具体的自己去了解

但是swift不能自动类型转换，需要程序员进行手动操作

数组这部分有点出入，简单讲一下

定义数组

```swift
var a : [Int] = [Int](repeating: 0, count: 3) //创建初始值为0，长度为3的int型数组
var a = [1,2,3]
```

swift中有自动类型推断，有时可以省略对类型的声明

swift的数组并不是一个定长的数组，是可以进行延展的，类似于c++的vector和java的ArrayList

```swift
a.append(20)
a += [20]
```

上述的方法都可以进行延展

和python中一样，swift也有字典，这个呢和c++，java的map的性质很像

### 3.遍历与数据输出

```swift
for i in 1...5 {
    //左闭右闭
}

for i in 1..<5 {
  //左闭右开
}

for item in items {
  //遍历items中每一个元素
}


var index = 2
print("这个数值是\(index)")
```

### class 和 struct区别

- class是引用类型(浅拷贝)；struct是值类型(深拷贝)
- class支持继承；struct不支持继承
- class声明的方法修改属性不需要`mutating`关键字；struct需要
- class没有提供默认的构造方法；struct提供默认的memberwise initializer
- struct可以使用Delegate，和class一样



