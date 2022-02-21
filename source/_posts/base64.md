----

title: base64

date: 2021-4-6

tags: 密码 

----

#                                    Base64

​       *前言：先唠点为什么写选个。我看到室友他们的项目登录都用到了base64，做了一个简单的安全措施，为这个加密和解密苦不堪言。所以就先讲讲这个东西，让大家以后遇到了也可以从容应对。*

<!-- more -->

##  1.什么是base64

  百度上给的定义:

> *Base64是网络上最常见的用于传输8Bit[字节码](https://baike.baidu.com/item/字节码/9953683)的编码方式之一，Base64就是一种基于64个可打印字符来表示[二进制](https://baike.baidu.com/item/二进制/361457)数据的方法。可查看RFC2045～RFC2049，上面有MIME的详细规范。*

好吧，说实话，我也看的不是很懂（doge）

**那用通俗的话讲什么是“base64“：就是像ASCII编码这中相似的东西，因为有64个编码，所以是base64。注入此类还有"base32"等。**

下面是base64的编码表：

> ![base64编码有什么用？（base64介绍及应用）](http://www.elecfans.com/uploads/allimg/171114/2387123-1G114103624322.png)



在由此看索引，从0~63，一共64个。诸如此类，base32是从0~31一共32个。

由于计算机是2进制存储，应当以2进制形式看这个表中的索引。

## 2.base64的算法

* **Base64要求把每三个8Bit的字节转换为四个6Bit的字节（3×8 = 4×6 = 24），然后把6Bit再添两位高位0，组成四个8Bit的字节，也就是说，转换后的字符串理论上将要比原来的长1/3。**

* **也可以这样理解base64实际上6个直接存储最大的数是00 111111，最小的是00 000000。这套编码所做就是将字节进行分割而已，每6位一个然后再前面补零**

* ​                                                               *关于这个编码的规则：*

​                                                                 ①.把3个字节变成4个字节。

​                                                                 ②每76个字符加一个换行符。

​                                                                 ③.最后的结束符也要处理。

![举个例子](http://img.rcbqb.com/dt/mvmek3peano.jpg)

​                                                                                 **转前 ：s 1 3**

**查ASCII表可知    s→115   ，  1→49   ， 3→51  **

**先转成ASCII：对应 115  49  51**

**implementation "android.arch.persistence.room:runtime:1.1.1"
annotationProcessor "android.arch.persistence.room:compiler:1.1.1" implementation "android.arch.persistence.room:runtime:1.1.1"
annotationProcessor "android.arch.persistence.room:compiler:1.1.1" 2进制： 01110011 00110001 00110011**

按照上面的分割方法处理

​               **011100**|110011|**000100**|110011

然后才有后面的 011100 110011 000100 110011

**然后计算机一个字节占8位，不够就自动补两个高位0了**

科学计算器输入 **00**011100 **00**110011 **00**000100 **00**110011

转换十进制得到 28 51 4 51

**查对下照表 c z E z**

* #### 那么问题来了：这是位数刚好为6的倍数的情况下的处理，那如果不够怎么办？

**此时，需在原数据后面添加1个或2个零值字节，使其字节数是3的倍数。然后，在编码后的字符串后面添加1个或2个等号“=”，以表示所添加的零值字节数。解码的时候，会自动去掉。（至于为什么是保证3的倍数就行了，我还不知道......）**

* 这就使base64有个明显的特征，大多数都会以”=“结尾



## 3.base64的应用区域

* base64 最早就是用来邮件传输协议中的，原因是邮件传输协议只支持 ASCII 字符传递，因此如果要传输二进制文件，如：图片、视频是无法实现的。因此 base64 就可以用来将二进制文件内容编码为只包含 ASCII 字符的内容。

  * 公钥证书

  ​        对证书来说，特别是根证书，一般都是作Base64编码的，因为它要在网上被许多人下载。电子邮件的附件一般也作Base64编码的，因为一个附件数据往往是有不可见字符的。

  * 文本传输

  ​        一个xml当中包含另一个xml数据，此时如果将xml数据直接写入显然不合适，将xml进行适当编码存入较为方便，事实上xml当中的字符一般都是可见字符（0-127之间），但是由于中文的存在，可能存在不可见字符，直接将字符打印在外层xml的数据中显然不合理，那么怎么办呢？可以使用base64进行编码，然后存入xml，解码反之其实还有个办法，将byte的值写在xml当中，空格或者，分开，这样也可以将byte数据传入，不过这样更浪费空间，并且不易保存。

  * HTTP协议

  ​        http协议当中的key value字段，必须进行URLEncode 不然出现的等号可能使解析失败 空格也会使http请求解析出现问题，比如 请求行就是以空格来划分的 POST /guowuxin/hehe HTTP/1.1。

  * 电子邮件（SMTP协议）

  ​       有些文本协议不支持不可见字符的传递，只能用大于32的可见字符来传递信息（协议规定）。

  * 图片base64编码

  ​        前端在实现页面时，对于一些简单图片，通常会选择将图片内容直接内嵌在页面中，避免不必要的外部资源加载，增大页面加载时间，但是图片数据是二进制数据，该怎么嵌入呢？绝大多数现代浏览器都支持一种名为 Data URLs 的特性，允许使用Base64对图片或其他文件的二进制数据进行编码，将其作为文本字符串嵌入网页中。

  * 进行简单加密

    将一些密码改的面目全非：比如报考四级的网站，用火狐储存账户信息后，密码长度改变，点击查看后发现密码和输入的不一样，起到了变相保护密码的作用。

## 4.base64的加密与解密

* 先来康康java中的怎么处理：

  幸运的是在看了很多博客后知道java中提供了专门的包来处理base64的加密与解密，所以我们只用导入包java.util.Base64然后再调用其中的方法就行。

  下面上代码

  ```
  import java.util.Scanner;
  
  import java.util.Base64;
  
  public class Test
  
  {
      public static void main(String[] args) {
          Scanner in = new Scanner(System.in);
          System.out.println("请输入您要处理的字符串\n");
          String base = in.next();
          base64encode(base);
          base64decode(base);
      }
  
      /*base64加密*/
       public static void base64encode(String str){
          byte []bytes = str.getBytes();
                       // 创建一个byte类型的数组，用于存储读取到的数据；String的getBytes()方法是                         得到一个系统默认的编码格式的字节数组。
          String encode = Base64.getEncoder().encodeToString(bytes);
                       //encode是”编译成密码“的意思
          System.out.println("base64加密后:"+encode);
  
          byte[] decode = Base64.getDecoder().decode(encode);
                       //decode是“解码”的意思
          String decode_code = new String(decode);
          System.out.println("验证-base64解密后："+decode_code);
       }
       
       /*base64解密*/
      public static void base64decode(String str){
          byte []bytes = str.getBytes();
          byte []decode = Base64.getDecoder().decode(str);
          String decode_code = new String(decode);
          System.out.println("base64解密后："+decode_code);
          String encode = Base64.getEncoder().encodeToString(decode);
          System.out.println("验证-base64加密后："+encode);
  
      }
  
  
  }
  ```

* 下面用c语言来整的base64的解码

  ```
  unsigned char *base64_encode(unsigned char *str)
  {
      long len;
      long str_len;
      unsigned char *res;
      int i,j;
  //定义base64编码表
      unsigned char *base64_table="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  //计算经过base64编码后的字符串长度
      str_len=strlen(str);
      if(str_len % 3 == 0)
          len=str_len/3*4;
      else
          len=(str_len/3+1)*4;//(余了1或2后都要补位，所以之后长度要+1)
      res=malloc(sizeof(unsigned char)*len+1);//malloc该函数返回一个指针 ，指向已分配大小的内存。如果请求失败，则返回 NULL
      res[len]='\0';
  //以3个8位字符为一组进行编码
      for(i=0,j=0;i<len-2;j+=3,i+=4)
      {
          res[i]=base64_table[str[j]>>2]; //取出第一个字符的前6位并找出对应的结果字符
          res[i+1]=base64_table[(str[j]&0x3)<<4 | (str[j+1]>>4)]; //将第一个字符的后位与第二个字符的前4位进行组合并找到对应的结果字符
          res[i+2]=base64_table[(str[j+1]&0xf)<<2 | (str[j+2]>>6)]; //将第二个字符的后4位与第三个字符的前2位组合并找出对应的结果字符
          res[i+3]=base64_table[str[j+2]&0x3f]; //取出第三个字符的后6位并找出结果字符
      }
      switch(str_len % 3)
      {
          case 1:
              res[i-2]='=';
              res[i-1]='=';
              break;
          case 2:
              res[i-1]='=';
              break;
      }
  
      return res;
  }
  
  unsigned char *base64_decode(unsigned char *code)
  {
  //根据base64表，以字符找到对应的十进制数据
      int table[]={
           0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  	     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  	     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  	     0, 0, 0, 0, 0, 0, 0,62, 0, 0, 0,63,
          52,53,54,55,56,57,58,59,60,61, 0, 0,
           0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6,
           7, 8, 9,10,11,12,13,14,15,16,17,18,
          19,20,21,22,23,24,25, 0, 0, 0, 0, 0,
           0,26,27,28,29,30,31,32,33,34,35,36,
          37,38,39,40,41,42,43,44,45,46,47,48,
          49,50,51, 0, 0, 0, 0, 0
      	    };
      long len;
      long str_len;
      unsigned char *res;
      int i,j;
  //计算解码后的字符串长度
      len=strlen(code);
  //判断编码后的字符串后是否有=
      if(strstr(code,"=="))
          str_len=len/4*3-2;
      else if(strstr(code,"="))
          str_len=len/4*3-1;
      else
          str_len=len/4;
  
      res=malloc(sizeof(unsigned char)*str_len+1);
      res[str_len]='\0';
  
  //以4个字符为一位进行解码
      for(i=0,j=0;i < len-2;j+=3,i+=4)
      {
          res[j]=((unsigned char)table[code[i]])<<2 | (((unsigned char)table[code[i+1]])>>4); //取出第一个字符对应base64表的十进制数的前6位与第二个字符对应base64表的十进制数的后2位进行组合  
          res[j+1]=(((unsigned char)table[code[i+1]])<<4) | (((unsigned char)table[code[i+2]])>>2); //取出第二个字符对应base64表的十进制数的后4位与第三个字符对应bas464表的十进制数的后4位进行组合  
          res[j+2]=(((unsigned char)table[code[i+2]])<<6) | ((unsigned char)table[code[i+3]]); //取出第三个字符对应base64表的十进制数的后2位与第4个字符进行组合  
      }
      return res;
  }
  ```

  