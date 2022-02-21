----

title: Room--帮大佬代传
date: 2021-4-18
tags: android

----

# Room数据库

<!-- more -->

##  Room与SQLite比较

官网上的介绍

- Room提供了一个SQLite之上的抽象层，使得在充分利用SQLite功能的前提下顺畅的访问数据库。 
- 需要写很多公式化的代码在SQL查询与Java对象之间转换。

例子：插入

用SQLite

```java
public void insert() {
        SQLiteDatabase sqLiteOpenHelper = qbHelper.getWritableDatabase();
        String sql = "insert into " + QBHelper.Table_Name + "(ID,name,sex) values(?,?,?)";
        sqLiteOpenHelper.execSQL(sql,new Object[]{2020213482,"邓策渝","男"});
        sqLiteOpenHelper.close();
    }
```

用Room

```java
@Insert
    void InsertStudent(Student... students);
```

 

```java
@Eninty
public class Student(){
   ...
}
```

## ROOM三个组件

**Entity:** <u>一个列表</u>  

- 简单来说，被标记的类可以抽象理解成一个表格。
- 对每一个entity，需要创建一些item作为列。
- 至少有一个主键`@PrimaryKey`(一般是id，方便更新、删除等需要指定数据后进行的操作)

![](https://ftp.bmp.ovh/imgs/2021/04/5f880e03993b54be.jpg)

- 必须在Database类中的entities数组中引用这些entity类。
- entity中的每一个field都将被持久化到数据库，如果不想保存，就使用 `@Ignore`注解。

**DAO**: <u>存放方法的接口</u>

- DAO是Room的主要组件，负责定义**添加、删除、清除、更新、查询**数据库的方法。

**Database:**  <u>获取接口、创建单例数据库的抽象类</u>

- 注解定义实体的列表，类的内容定义从**数据库中获取数据的对象**（DAO）。
- 这个被注解的类是一个继承RoomDatabase的抽象类。
- 使用@Database注解的类必须包含一个0参数的，**返回类@Dao注解过的类的抽象方法**。
- 为什么是单例数据库？方便不同Activity或者Fragment对数据库进行操作

![](https://ftp.bmp.ovh/imgs/2021/04/00e03d590d436742.png)

## Room依赖

```java
def room_version = "2.2.0-alpha01"

    implementation "android.arch.persistence.room:runtime:$room_version"
    annotationProcessor "android.arch.persistence.room:compiler:$room_version"
    // Test helpers
    testImplementation "android.arch.persistence.room:testing:$room_version"
```

implementation "android.arch.persistence.room:runtime:1.1.1"
annotationProcessor "android.arch.persistence.room:compiler:1.1.1" 