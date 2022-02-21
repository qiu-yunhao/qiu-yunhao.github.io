----
title: C语言指针（代传）
date: 2021-10-30
tags: C 帮大佬代传
----

# C语言指针

<!-- more -->


## 问题

### 什么是字节？什么是内存？什么是地址？什么是指针？什么是指针变量？

[![5bDivj.jpg](https://z3.ax1x.com/2021/10/27/5bDivj.jpg)](https://imgtu.com/i/5bDivj)

### 为什么需要指针？

- 指针的使用使得不同区域的代码可以轻易的访问内存数据（主要体现在参数传递上）

  ```c
  #include<stdio.h>
  typedef struct soBigStruct{
  	int a,b,c,d,e;
  }soBig;
  
  void Function(soBig sb);
  void Function2(soBig *sb);
  
  int main(){
  	soBig sb;
  	soBig *psb = &sb;
      Function(sb);
      Function2(2sb);
  }
  ```

  因为函数参数传递时是需要在**栈内存**里新分配相应大小的区域，相较于直接传入占用空间较大的变量，不如传入占用空间较小的指针。

- 指针使得一些复杂的链接性的数据结构的构建成为可能

  ```c
  typedef struct LinkList{
  	int data;
  	struct LinkList *next;
  }LinkList;
  ```

- C语言是传值调用，而有些操作传值调用是无法完成的

  ```c
  void swap(int *a, int *b){
      int temp = *a;
      *a = *b;
      *b = temp;
  }
  ```

  

### 什么是变量？

[![5OuxJ0.jpg](https://z3.ax1x.com/2021/10/28/5OuxJ0.jpg)](https://imgtu.com/i/5OuxJ0)

### 为什么会有多种类型的指针？

## 两个重要符号

*: 取值符，用在指针变量上（通过地址拿取值的方法叫做**解引用**）

[![5OlJYR.png](https://z3.ax1x.com/2021/10/28/5OlJYR.png)](https://imgtu.com/i/5OlJYR)

&：取地址符，用在普通变量上

```c
int a = 1;
int *p1 = &a;
int p2 = &a;
int *p3 = a;
printf("%d %d",a,*p1);   //a称为直接访问，*p称为间接访问
```

```c
int a[5]={1,2,3,4,5};
int *p = a;
```

```c
int main(void){
	int f = 1;
	short c = *(short*)&f;
	printf("%hd",c);
}
```

[![5O8oAe.jpg](https://z3.ax1x.com/2021/10/28/5O8oAe.jpg)](https://imgtu.com/i/5O8oAe)

```c
int main(void){
	short f = 1;
	int c = *(int*)&f;
	printf("%d",c);
}
```

`*(int*)&f`会让我们从`f` 的首地址开始取四个字节，然后按照 int的编码方式去解释。

但是`f`是 short类型只占两个字节，那肯定会访问到相邻后面两个字节，这时候就发生了内存访问越界。

### 多级指针

```c
int a = 1;
int *p1 = &a;
int **p2 = &p1;
int ***p3 = &p2;
printf("%d %d %d %d %d %d %d %d %d %d", a, p1, *p1, p2, *p2, **p2, p3, *p3, **p3, ***p3);
```

[![5O1vxP.jpg](https://z3.ax1x.com/2021/10/28/5O1vxP.jpg)](https://imgtu.com/i/5O1vxP)

`int **p`可以把它分为两部分看，即 `int* `和 `*p`，后面 `*p` 中的`*`表示 `p` 是一个指针变量，前面的 `int*` 表示指针变量`p`

## 指针

### 野指针

本节中，把没有合法指向的指针称为“野”指针。因为“野”指针随机指向一块空间，该空间中存储的可能是其他程序的数据甚至是系统数据，故不能对“野”指针所指向的空间进行存取操作，否则轻者会引起程序崩溃，严重的可能导致整个系统崩溃。

例如：

```c
int *pi,a; //pi未初始化，无合法指向，为“野”指针
*pi=3; //运行时错误，不能对”野”指针指向的空间做存入操作。该语句试图把 3 存入“野”指针pi所指的随机空间中，会产生运行时错误。
a=*pi; //运行时错误，不能对”野”指针指向的空间取操作。该语句试图从“野”指针pi所指的空间中取出数据，然后赋给变量a同样会产生运行时错误。
```

### 数组与指针

数组名其实也可以写作指针的形式，在内存中数组是一块连续的内存空间

```c
int a[5]={1,2,3,4,5};
int *p = a;
printf("%d %d", a[0], *(a+0));
printf("%d %d", a[1], *(a+1));
```

**注意：a+1指的是下一个元素，而不是下一个地址**

```c
printf("p = %d, p + 1 = %d\n", p, p+1);    //用十进制格式输出
/*
输出结果为： p = 1638196, p + 1 = 1638200
*/
```

#### 指针求差：

```c
int *p1 = a;
int *p2 = &a[3];
printf("%d",p2-p1);
```

#### 多维数组（以二维数组举例）：

从图形上理解：

[![5OtpND.png](https://z3.ax1x.com/2021/10/28/5OtpND.png)](https://imgtu.com/i/5OtpND)

本质上：

[![5OYhn0.jpg](https://z3.ax1x.com/2021/10/28/5OYhn0.jpg)](https://imgtu.com/i/5OYhn0)

C语言允许把一个二维数组分解成多个一维数组来处理。对于数组 a，它可以分解成三个一维数组，即 a[0]、a[1]、a[2]。每一个一维数组又包含了 4 个元素，例如 a[0] 包含` a[0][0]、a[0][1]、a[0][2]、a[0][3]`。

[![5OtnUS.png](https://z3.ax1x.com/2021/10/28/5OtnUS.png)](https://imgtu.com/i/5OtnUS)

  **按照指针访问数组元素**：

* 先将每行的首元素取出：`*(a+1)`

* 在取出第一行首元素的基础上，再访问第一行第一个元素的地址：`*(a+1)+1`

  `*(p+1)`单独使用时表示的是第 1 行数据，放在表达式中会被转换为第 1 行数据的首地址，也就是第 1 行第 0 个元素的地址，因为使用整行数据没有实际的含义，编译器遇到这种情况都会转换为指向该行第 0 个元素的指针。所以在此基础上+1便指向了第一行第一个元素的地址

* 然后再加上取值符*即可：`*(*(a+1)+1)`

```c
/**
    * a[i][j] 等价于 *(*(a+i)+j)
    * &a[i][j] 等价于 *(a+i)+j
    * a[i] 等价于 *(a+i) &a[i]
    */

//根据指针遍历输出二维数组
for(int i=0;i<2;i++){
    for(int j=0;j<3;j++){
        printf(" %d ",*(*(a+i)+j));
    }
    printf("\n");
} 
```

