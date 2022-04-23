----

title: Android 自定义View--定制图表
date: 2022-2-25
tags: Android&&自定义View

----





产品的想象永远天马行空，但作为一个苦命的打工人，我们也许现在可以摆摆烂说上一句我不会（QwQ），但以后总不能一直说我不会吧。所以各种花里胡哨的东西我们都要会一点，真正落实产品异想，我们开天。把公屏打在泪目上( Ĭ ^ Ĭ )（ps：这篇博客有点赶，所以对理论的东西基本不进行分析）

<!-- more -->

分析基础部分主要参考：扔物线

# 基础

基础不牢，地动山摇！！！血与泪的教训。

我们这里介绍以画图相关的为主，主要将与onDraw相关的东西，剩余的分批次讲解

* onDraw(Canvas canvas)
* onMeasure(int width,int height)
* onLayout()

对于一个View的流程呢

onMeasure → onLayout → onDraw

先确定布局的长宽等属性，进而确定布局信息，最后进行绘制

提前说明一下获取父布局的方法

## Activity的构成

先放上经典老图

![acivity](https://img-blog.csdnimg.cn/20190118214429466.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM4MTgyMTI1,size_16,color_FFFFFF,t_70)

这里放上DecorView解析的博客，感兴趣的可以去看一下https://www.jianshu.com/p/ee7e3b08c23c

因为我们的手机的App打开后都是可视界面，即DecorView是最顶级的视图层。我们自己写的那些App，通常上面都会有明显的一个紫色的条目，还带着项目的名字，那个就是TitleView，而我们的加载的布局是在ContentView中加载

## onDarw(Canvas)

[![GDB91.png](https://s1.328888.xyz/2022/02/21/GDB91.png)](https://imgloc.com/image/GDB91)

看看人家多好，就是告诉你需要重写，在这里实现你想画的图

## Canvas类

我个人理解的就是一块画板，我们Java乘虚猿也能尝试去当简单的人工智障艺术家，天马行空的开画。我的认知里面可以把canvas的绘制如下这几类，像drawRect就被归为画线一类

![这里写图片描述](https://img-blog.csdn.net/2018072121442999)

#### 绘制颜色

**canvas.drawColor(int color)**给画布上个花脸！

#### 绘制基本形状和路径

这个具体参考下面的Path相关讲解

#### 绘制图片

**canvas.drawBitmap(Bitmap bitmap,int left , int top , Paint paint)**

canvas.drawBitmap(Bitmap, Matirx, Paint)有待查阅

#### 绘制文本

**canvas.drawText(Strint text, float x, float y, Paint paint)**在以（x,y）为起点的地方写下text

#### 画布裁剪

**canvas.cilp(Path path)**的效果是选取的Path闭合区域可见

canvas.clipOutPath(Path path)的效果是选取Path闭合区域外可见

#### 画布变换

**canvas.translate()**的效果是Canvas的坐标轴改变而坐标平面的事物随之相对位移。

```java
```



效果如图：

**canvas.rotate(int angel)**的效果可以理解为坐标轴的旋转

#### 矩阵变换

##### Matrix

**matrix.postTranslate()**目前的测试效果是和canvas.translate()的效果有些不同，更加类似于坐标位移，而不动坐标系，导致测试效果不同的原因可能是在调用***drawBitmap(Bitmap,Matrix,Paint)***上。具体效果我再下去试试

**matrix.postRotate()**目前测试的效果和canvas.rotate()的效果相同，但功能上更加强大

## Path类

path就是描述边界的作用，简单的绘图可以调用像Rect等Android指定图形而更加牛马，更加个性的图形就只能自己用Path来描述,下面列举了大多的Path相关的方法，但Path和其他基础的图形相结合才能更好地去完成路径之类的设置。

```java
Path path = new Path();
path.moveTo();
path.LineTo();
path.close();
path.clear();
```

```java
//基础的图形类别
Rect()
Arc()
RoundRect()
Oval()
```

**贝赛尔曲线**：这个是用来绘制很多圆润丝滑的曲线，难度较大，我也没学，所以飘过了。。。

#### MoveTo()

#### LineTo()

#### close()使得Path可以首尾相连

#### 另一种作用就是在复杂的图形中设置填充方式。

看到这句话，小问号是不是有很多朋友？？我们来举个例子，当我们要画两个相交圆的时候



## Paint类

这里我们直接上用法吧，写不动了,更具体的参考：https://developer.android.com/reference/android/graphics/Paint

```java
Paint paint = new Paint();
paint.setColor(Color.BLUE);//设置颜色
paint.setTextSize(50);//设置字体大小
paint.setStyle(Paint.Style.FILL);//一定要设置这个，不然可能显示不出来
paint.setAntiAlias(true)//设置抗锯齿
paint.setStrokeWidth()//设置线条宽度
paint.setAlpha(50)//设置透明度
```

Style.STROKE空心，FILL是将内部也填充上



# 圆形头像

在下面的各项开始之前，我们下来个简单的实现圆形头像,就是简单的利用一下Canvas的图像裁剪的部分来实现一个不成熟的圆心头像的重写

```java
public class RoundImageView extends androidx.appcompat.widget.AppCompatImageView {
    private int mHeight, mWidth;
    private Paint paint;
    private RollThread thread = null;
    private int angel = 0;
    private int r;
    private Matrix matrix;
    private Bitmap bitmap;

    public RoundImageView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public RoundImageView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public RoundImageView(@NonNull Context context) {
        super(context);
        init();
    }

    private void init(){
        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLUE);
        paint.setStrokeWidth(10);

    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        mHeight = getMeasuredHeight();
        mWidth = getMeasuredWidth();
        final int size = Math.min(mHeight,mWidth);
        setMeasuredDimension(size,size);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        Drawable drawable = getDrawable();
        bitmap = ((BitmapDrawable)drawable).getBitmap();
        r = Math.min(bitmap.getHeight(),bitmap.getWidth())/2;
        matrix = new Matrix();
        final float size = Math.max(mHeight/bitmap.getHeight(),mWidth/bitmap.getWidth());
        matrix.postScale(size,size);
        Path path = new Path();
        path.addCircle(r,r,r, Path.Direction.CW);
        canvas.drawColor(Color.WHITE);//消除背景画
        canvas.clipPath(path);
        canvas.drawBitmap(bitmap,matrix,paint);
    }
}

```



# 1.图表类

### 六边形雷达图

![5v6mtJ.png](https://z3.ax1x.com/2021/10/30/5v6mtJ.png)

那么我们怎么利用上述的工具来实现呢？

首先我们先想办法搞一个六边形,那我们首先要解决描述角度的问题就用Math库的PI来处理圆周率,剩下的就是中学的数学三角函数的知识，这里就不赘述。

```java
public class Hexagon extends View {
    private final double Angle_60 = Math.PI / 3;
    private PointF[] somePoint = {
            new PointF(0, 1),
            new PointF((float) Math.sin(Angle_60), (float) Math.cos(Angle_60)),
            new PointF((float) Math.sin(Angle_60 * 2), (float) Math.cos(Angle_60 * 2)),
            new PointF((float) Math.sin(Angle_60 * 3), (float) Math.cos(Angle_60 * 3)),
            new PointF((float) Math.sin(Angle_60 * 4), (float) Math.cos(Angle_60 * 4)),
            new PointF((float) Math.sin(Angle_60 * 5), (float) Math.cos(Angle_60 * 5))
    };
}
```

进行日常的初始化之类的活动

```java
public class Hexagon extends View {
    private final double Angle_60 = Math.PI / 3;
    private float centerX = getX();
    private float centerY = getY();
    private float r = 300f;
    private int color = Color.BLUE;
    private float testSize = 36;
    private Context mContext;
    private Paint mLinePaint, mAreaPaint, mTextPaint;
    public Hexagon(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.mContext = context;
    }

    public Hexagon(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        this.mContext = context;
    }

    public Hexagon(Context context) {
        super(context);
        this.mContext = context;
    }
  
  private void initPaint() {
        mLinePaint = new Paint();
        mLinePaint.setStrokeWidth(3);
        mLinePaint.setColor(color);
        mLinePaint.setAntiAlias(true);
        mLinePaint.setStyle(Paint.Style.STROKE);

        mAreaPaint = new Paint();
        mAreaPaint.setStyle(Paint.Style.FILL);
        mAreaPaint.setColor(Color.BLUE);
        mAreaPaint.setAntiAlias(true);
        mAreaPaint.setAlpha(10);

        mTextPaint = new Paint();
        mTextPaint.setAntiAlias(true);
        mTextPaint.setColor(color);
        mTextPaint.setStyle(Paint.Style.FILL);
        mTextPaint.setStrokeWidth(3);
        mTextPaint.setTextAlign(Paint.Align.LEFT);
        mTextPaint.setTextSkewX((float) -0.25);
        mTextPaint.setTextSize(36);
    }
}

```



观察到边的都是相似的，所以只用修改这个和半径差不多东西的长就行,如下是标记各个顶点的坐标

```java
 private void initEdge(float r) {
        PointF mPoint;
        mList = new ArrayList<>(EndNumber);
        for (int i = 0; i < EndNumber; i++) {
            mPoint = new PointF();
            mPoint.x = somePoint[i].x * r;
            mPoint.y = somePoint[i].y * r;
            mList.add(mPoint);
        }
    }

```



最后附上完成品代码

```java
public class Hexagon extends View {
    private final double Angle_60 = Math.PI / 3;
    private float centerX = getX();
    private float centerY = getY();
    private float r = 300f;
    private float testSize = 36;
    private Context mContext;
    private int EndNumber = 6;
    private int width, height;
    private int color = Color.BLUE;

    private Paint mLinePaint, mAreaPaint, mTextPaint;

    private List<PointF> mList;
    private final String[] text = {"Hello,android1", "Hello,android2", "Hello,android3", "Hello,android4", "Hello,android5", "Hello,android6"};

    private int[] score = {6, 7, 6, 4, 10, 5};
    private PointF[] somePoint = {
            new PointF(0, 1),
            new PointF((float) Math.sin(Angle_60), (float) Math.cos(Angle_60)),
            new PointF((float) Math.sin(Angle_60 * 2), (float) Math.cos(Angle_60 * 2)),
            new PointF((float) Math.sin(Angle_60 * 3), (float) Math.cos(Angle_60 * 3)),
            new PointF((float) Math.sin(Angle_60 * 4), (float) Math.cos(Angle_60 * 4)),
            new PointF((float) Math.sin(Angle_60 * 5), (float) Math.cos(Angle_60 * 5))
    };

    public Hexagon(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        this.mContext = context;
    }

    public Hexagon(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        this.mContext = context;
    }

    public Hexagon(Context context) {
        super(context);
        this.mContext = context;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        this.width = w;
        this.height = h;
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        initPaint();
        canvas.translate(width / 2, height / 2);
        initLine(canvas);
        initText(canvas);
        initPoint(canvas);


    }

    private void initLine(Canvas canvas) {
        Path path = new Path();
        /**
         * 画六条射线
         */

        for (int i = 0; i < 5; i++) {
            float size = r - (r / 5) * i;
            initEdge(size);
            PointF p = mList.get(0);
            path.moveTo(p.x, p.y);
            canvas.drawText(String.valueOf(20*(5-i)),-p.x,-p.y,mTextPaint);
            for (int j = 1; j < EndNumber; j++) {
                p = mList.get(j);
                path.lineTo(p.x, p.y);
            }
            path.close();
            if(i%2==0){
                mAreaPaint.setColor(color);
                mAreaPaint.setAlpha(10);
                canvas.drawPath(path,mAreaPaint);
            }else{
                mAreaPaint.setColor(Color.WHITE);
                canvas.drawPath(path,mAreaPaint);
            }
            canvas.drawPath(path, mLinePaint);
            path.reset();
        }
        

        for (int i = 0; i < EndNumber; i++) {
            initEdge(r);
            path.moveTo(0, 0);
            PointF pointF = mList.get(i);
            path.lineTo(pointF.x, pointF.y);
        }
        canvas.drawPath(path, mLinePaint);

    }

    private void initPaint() {
        mLinePaint = new Paint();
        mLinePaint.setStrokeWidth(3);
        mLinePaint.setColor(color);
        mLinePaint.setAntiAlias(true);
        mLinePaint.setStyle(Paint.Style.STROKE);

        mAreaPaint = new Paint();
        mAreaPaint.setStyle(Paint.Style.FILL);
        mAreaPaint.setColor(Color.BLUE);
        mAreaPaint.setAntiAlias(true);
        mAreaPaint.setAlpha(10);

        mTextPaint = new Paint();
        mTextPaint.setAntiAlias(true);
        mTextPaint.setColor(color);
        mTextPaint.setStyle(Paint.Style.FILL);
        mTextPaint.setStrokeWidth(3);
        mTextPaint.setTextAlign(Paint.Align.LEFT);
        mTextPaint.setTextSkewX((float) -0.25);
        mTextPaint.setTextSize(36);
    }

    private void initEdge(float r) {
        PointF mPoint;
        mList = new ArrayList<>(EndNumber);
        for (int i = 0; i < EndNumber; i++) {
            mPoint = new PointF();
            mPoint.x = somePoint[i].x * r;
            mPoint.y = somePoint[i].y * r;
            mList.add(mPoint);
        }
    }

    private void initText(Canvas canvas) {
        initEdge(r);
        mTextPaint.setTextAlign(Paint.Align.CENTER);
        PointF p = mList.get(0);
        float wid = mTextPaint.measureText(text[0]);
        canvas.drawText(text[0], p.x, p.y + (float) (testSize * 1.2), mTextPaint);

        p = mList.get(1);
        wid = mTextPaint.measureText(text[1]);
        canvas.drawText(text[1], p.x + wid / 2 + (float) (testSize * 0.6), p.y + (float) (testSize * 0.5), mTextPaint);

        p = mList.get(2);
        wid = mTextPaint.measureText(text[2]);
        canvas.drawText(text[2], p.x + wid / 2 + (float) (testSize * 0.6), p.y + (float) (testSize * 0.4), mTextPaint);

        p = mList.get(3);
        wid = mTextPaint.measureText(text[3]);
        canvas.drawText(text[3], p.x, p.y - (float) (testSize * 0.8), mTextPaint);

        p = mList.get(4);
        wid = mTextPaint.measureText(text[4]);
        canvas.drawText(text[4], p.x - (float) (testSize * 0.6) - wid / 2, p.y + (float) (testSize * 0.4), mTextPaint);

        p = mList.get(5);
        wid = mTextPaint.measureText(text[5]);
        canvas.drawText(text[5], p.x - (float) (testSize * 0.6) - wid / 2, p.y + (float) (testSize * 0.5), mTextPaint);

    }

    public void initPoint(Canvas canvas){
        initEdge(r);
        mAreaPaint.setColor(Color.BLUE);
        mAreaPaint.setAlpha(50);
        PointF p = mList.get(0);
        Path path = new Path();
        path.moveTo(p.x*(float) (score[0]/10.0),p.y*(float) (score[0]/10.0));
        for(int i = 1;i<EndNumber;i++){
            p = mList.get(i);
            path.lineTo(p.x*(float) (score[i]/10.0),p.y*(float) (score[i]/10.0));
        }
        path.close();
        canvas.drawPath(path,mAreaPaint);
    }

    public void setColor(int color){
        this.color = color;
        invalidate();
    }

    public void setR(float r) {
        this.r = r;
        invalidate();
    }

    public void setTestSize(float textSize){
        this.testSize = textSize;
        invalidate();
    }

    public void setScore(int[] score){
        this.score = score;
        invalidate();
    }
}
```



### 直线图

### 尝试

你都耐心的看到这了，自己尝试写一个折线图吧！

# 2.花里胡哨类

### 弹幕效果

参考:

弹幕呢，像个textView，所以我们直接继承TextView

```java
public class BarrageText extends androidx.appcompat.widget.AppCompatTextView {

    public BarrageText(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public BarrageText(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }



    public BarrageText(Context context) {
        super(context);
    }
}

```

因为要对图形进行绘制，所以我们要获得一个paint的实例

```java
public class BarrageText extends androidx.appcompat.widget.AppCompatTextView {
    private Paint mPaint;
    ......    
    public void init(){
        mPaint = new Paint();
        mPaint.setTextSize(50);
        mPaint.setColor(Color.BLUE);
        mPaint.setStrokeWidth(4);
        mPaint.setStyle(Paint.Style.FILL);
    }
}

```

相对于屏幕来说我们要有显示的文字和这个弹幕的坐标还有移动速度

所以要添加posX，posY，text，v。我们选择顶格绘制，所以要留出字体大小的高度 posY = textSize = 50，速度设置为10

```java
public class BarrageText extends androidx.appcompat.widget.AppCompatTextView {
    private Paint mPaint;
    private int posX;
    private int posY;
    private int v;
    private String s = "I love MUXI Android";
    ......
    public void init(){
        mPaint = new Paint();
        mPaint.setTextSize(50);
        mPaint.setColor(Color.BLUE);
        mPaint.setStrokeWidth(4);
        mPaint.setStyle(Paint.Style.FILL);
        posX = 0;
        posY = random.nextInt(50);
        v = 10;
    }

```

至于位移，可以使用动画属性来实现，但我并没有尝试过。。。这里使用多线程来实现异步处理。（在写所思的时候的用到了，而且我线程学的不好，借这个机会预习一下）

在逻辑上弹幕右移就是 posX += v;

```java
public void roll(){
        posX += v;
    }
```

然后我们对线程进行处理，新建一个RollThread类继承Thread,然后重写run方法，在run方法中实现我们想要的效果。为了我们能清楚的观察到这个弹幕，所以让线程挂起50ms

```java
class RollThread extends Thread {

        @Override
        public void run() {
            super.run();
            while (true) {
                roll();
                postInvalidate();//让视图重新进行绘制
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```

然后在onDarw方法里进行绘制的实现

```java
@Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawText(s,posX,posY,mPaint);
        if (thread == null){
            thread = new RollThread();
            thread.start();
        }
    }
```

这里的thread类似于单例模式，但不能用static进行修饰，static是RollThread这个类所共有的，也就是所有的弹幕共用这一个线程，但为了让弹幕实现天女散花的效果，我们让每个弹幕拥有他们独自的线程。

这个时候我们已经实现了一个会动的弹幕了，下面对其继续进行丰富

弹幕应该是万紫千红和位置随机出现的，字体的大小和速度也应该有所区别，因而我们应该实现其随机性

```java
public class BarrageText extends androidx.appcompat.widget.AppCompatTextView {
    private Paint mPaint;
    private int posX;
    private int posY;
    private final int textSize = 80;
    private int mHeight;
    private int mWidth;
    private RollThread thread = null;
    private Random random;
    private int v;
    private static final String[] s = {"I Love MUXI","I Learn Android","菜鸡也会发光！"};
    .......
    public void init(){
        random = new Random();
        mPaint = new Paint();
        mPaint.setTextSize(random.nextInt(textSize) + 10);
        mPaint.setAlpha(random.nextInt(255));
        int color = Color.rgb(random.nextInt(256),random.nextInt(256),random.nextInt(256));
        mPaint.setColor(color);
        mPaint.setStrokeWidth(4);
        mPaint.setStyle(Paint.Style.FILL);
        posX = 0;
        posY = random.nextInt(mHeight);
        v = random.nextInt(10) + 1;
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        mHeight = getMeasuredHeight();
        mWidth = getMeasuredWidth();
    }
    
    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        canvas.drawText(s[random.nextInt(s.length)],posX,posY,mPaint);
        if (thread == null){
            thread = new RollThread();
            thread.start();
        }
    }
}
```

这样就让这一条弹幕可以从屏幕的任意一个地方开始了。

等我再多学点，多理解点再讲一下群弹幕的实现的原理。这里就先简单的摆个方法吧。

```java
//在MainActivity里添加如下的代码
 //让弹幕凌驾于底部的视图之上
        final ViewGroup.LayoutParams lp = new        ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        final Handler handler = new Handler();
        Runnable createText = new Runnable() {
            @Override
            public void run() {
                if (BarrageText.num <= 25) {
                    final BarrageText text = new BarrageText(MainActivity.this);
                    addContentView(text, lp);
                    handler.postDelayed(this, 50);
                }
            }
        };
        handler.post(createText);

    }
```

同时onMeasure方法中获取的高和宽也要替换

```java
        Rect rect = new Rect();
        getWindowVisibleDisplayFrame(rect);
        mWidth = rect.width();
        mHeight = rect.height();
```

整个例子可以在我github的仓库里面观看。

### 代码雨效果

## 旋转头像的效果

就是在之前讲的圆形头像上多一点点的变化，可以结合上面的弹幕特效来实现。即多开一条线程，然后重复绘制

```java
public class RoundImageView extends androidx.appcompat.widget.AppCompatImageView {
    private int mHeight, mWidth;
    private Paint paint;
    private RollThread thread = null;
    private int angel = 0;
    private int r;
    private Matrix matrix;
    private Bitmap bitmap;

    public RoundImageView(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    public RoundImageView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public RoundImageView(@NonNull Context context) {
        super(context);
        init();
    }

    private void init(){
        paint = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLUE);
        paint.setStrokeWidth(10);

    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
        mHeight = getMeasuredHeight();
        mWidth = getMeasuredWidth();
        final int size = Math.min(mHeight,mWidth);
        setMeasuredDimension(size,size);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        Drawable drawable = getDrawable();
        bitmap = ((BitmapDrawable)drawable).getBitmap();
        r = Math.min(bitmap.getHeight(),bitmap.getWidth())/2;
        matrix = new Matrix();
        final float size = Math.max(mHeight/bitmap.getHeight(),mWidth/bitmap.getWidth());
        matrix.postScale(size,size);
        matrix.postTranslate(-r,-r);
        canvas.translate(r,r);
        Path path = new Path();
        path.addCircle(0,0,r, Path.Direction.CW);
        canvas.drawColor(Color.WHITE);//消除背景画
        canvas.clipPath(path);
        canvas.rotate(angel);
        canvas.drawBitmap(bitmap,matrix,paint);
        if (thread == null){
            thread = new RollThread();
            thread.start();
        }

    }

    class RollThread extends Thread{

        @Override
        public void run() {
            super.run();
            while(true) {
                roll();
                postInvalidate();
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        private void roll(){
            angel += 20;
        }
    }
}

```



