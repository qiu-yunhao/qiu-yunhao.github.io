-------

tag : Android

title :  Android动画Animator与布局

date : 20222-5-7

----

Android动画Animator这部分说难吧，是真的难的离谱，说简单吧，东西又就那么多，以一言概之，G

<!---more--->

我们学习这部分主要还是用来应对甲方的各种需求，比如对于统计的数据的显示图，如果只是一个图摆那就略显单调。所以我们一般会选择使用动画效果来实现。

## Animator相关介绍

1.View Animation能做的，Property Animator也能做，View Animation做不到的，Property Animator也能做！比如修改背景颜色，比如View Animation要求使用的对象是一个View对象，而Property Animator却不需要，因为他主要修改的是对象属性。

2.View Animation交互性不好，比如你对TextView使用了动画从（0，0）点移动到（400，400），虽然视图上textView移动到了（400，400），但是textview的点击响应事件却在（0  ，0）点。关于这点大家可以试验下印象深刻点。而Property Animator却没有这个问题（因为他修改的textview的属性）。

## Animator使用讲解

![](https://image.rengwuxian.com/2021/%7Bmon%7D/06/006tKfTcgy1fj7x3rm1xxj30u50laq6y.jpg)

```java
start() //开始动画
setDuration（）//设置每次的动画时间，单位ms
setRepeatCount() //设置重复次数
```





### 自定义View

我们选择的属性要有对应的set方法，若没有对成员变量初始化，还需要get方法

我们通过调用ofFloat之类的方法来实现动画效果

ps：我们的of后面加的数据类型要和set，get操作的数据类型相同

```java
public class PieView extends View {
    private int score = 78;
    private Paint paintText, paintEdge, paintContent;
    private int[] colors, standard;
    private int width, height;
    private float radius;

    public PieView(Context context) {
        super(context);
        init();
    }

    public PieView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public PieView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        this.width = w;
        this.height = h;
    }

    private void drawEdge(Canvas canvas, float r, int color) {
        .
        .
        .
    }

    private void init() {
        .
        .
        .
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        .
        .
        .
    }


    private int getColor() {
        for (int i = 0; i < standard.length; i++) {
            if (getScore() < standard[i]) {
                return colors[i];
            }
        }
        return 0;
    }

    public int getScore(){
        return score;
    }

    public void setScore(int score){
        this.score = score;
        invalidate();
    }

    public void setStandard(int[] standard) ;

    public void setColors(int[] colors);

}
```

我们的成员score表示分数，数据类型是int

```java
PieView pie = findViewById(R.id.pie);
ObjectAnimator animator = ObjectAnimator.ofInt(pie,"score",0,50,99);
animator.setDuration(1000);
animator.setRepeatCount(6);
animator.start();
```



## 实战演练

这次打算做个卫星布局，目前的产品比较粗糙，后期有待优化

### 相关基础原理

老规矩了，纯纯的初中初中数学问题，又不是QQ拉红点（doge）

![4qI3P.jpg](https://s1.328888.xyz/2022/05/08/4qI3P.jpg)

这里就可以用到动画属性了，我们先让布局集中在主布局处，使其成为上下叠加的状态（后期会对此进行优化，简而言之，就是让子布局看不见）然后在调用动画属性，使其移动至目标处（多路并行特效）

```java
private void open() {
        int n = getChildCount() - 1 ;
        List<Animator> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            View v = getChildAt(i);
            int arc = 90 * i / ((n-2) == 0 ? 1 : (n-1)) + rollAngel;
            int x = (int)Math.cos(Math.toRadians(arc)) * radius;
            int y = (int)Math.sin(Math.toRadians(arc)) * radius;
            ObjectAnimator animatorX = ObjectAnimator.ofFloat(v,"translationX",0,x);
            ObjectAnimator animatorY = ObjectAnimator.ofFloat(v,"translationY",0,y);
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(v,"scaleX",0f,1);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(v,"scaleY",0f,1);
            list.add(animatorX);
            list.add(animatorY);
            list.add(scaleX);
            list.add(scaleY);
        }
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(list);
        animatorSet.setDuration(1000);
        animatorSet.start();
    }
```





### 注意事项

*  在动态添加视图后，它会被归到子视图当中，并光荣的成为最后一员，因而会在这里进行减一，使得这个主按钮不会加入动画效果

```java
int n = getChildCount() - 1;
```

* ![4q56g.png](https://s1.328888.xyz/2022/05/08/4q56g.png)这里是addView不能再onDraw中调用，在onLayout()，onMeasure()的方法中调用貌似也有影响。因为在addView后，父布局会再次测量子布局，再进行相关数值的布局。



### 总体代码

```java
public class ArcButton extends FrameLayout implements View.OnClickListener{
    private int position = 1;
    private float width, height, centerX, centerY;
    private int rollAngel = 0, radius;
    private boolean isCheck = false;
    private FloatingActionButton button;

    public ArcButton(@NonNull Context context) {
        super(context);
    }

    public ArcButton(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        TypedArray attr = context.obtainStyledAttributes(attrs,R.styleable.ArcButton,0,0);
        button = new FloatingActionButton(context,attrs);
        button.setOnClickListener(this);
    }

    public ArcButton(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        setOnClickListener(this);
    }

    @Override
    protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
        int n = getChildCount();//获取子控件的数量
        for (int i = 0; i < n; i++) {
            measureChild(getChildAt(i), widthMeasureSpec, heightMeasureSpec);
        }
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
        initCenterPoint();
    }

    /**
     * position 选择相对位置
     * = 1 和 其他；为左上角，向右下方向展开
     * = 2；为右上角，向左下角展开
     * = 3；为左下角，向右上角展开
     * = 4；为右下角，向右上角展开
     */
    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        width = w;
        height = h;
        switch (position) {
            case 2:
                rollAngel = 90;
                centerX = width * 9 / 10;
                centerY = height / 10;
                break;
            case 3:
                rollAngel = 270;
                centerX = width / 10;
                centerY = height * 9 / 10;
                break;
            case 4:
                rollAngel = 180;
                centerX = width * 9 / 10;
                centerY = height * 9 / 10;
                break;
            default:
                rollAngel = 0;
                centerX = width / 10;
                centerY = height / 10;
                break;
        }
        radius = Math.min(w,h)/2;
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        int n = getChildCount();
        for (int i = 0; i < n-1; i++) {
            layoutChildView(i);
        }
        layoutMainMenu();
    }

    //实现中心按钮的加载
    public void initCenterPoint() {
        //button.setImageResource(R.mipmap.ic_launcher);
        addView(button);
    }

    private void layoutMainMenu(){
        int left = 0,top = 0;
        switch (position) {
            case 2:
                top = (int) height / 10;
                left = (int) width * 9 / 10;
                break;
            case 3:
                top = (int) height * 9 / 10;
                left = (int) width / 10;
                break;
            case 4:
                top = (int) height * 9 / 10;
                left = (int) width * 9 / 10;
                break;
            default:
                top = (int) height / 10;
                left = (int) width / 10;
                break;
        }
        int x = Math.min(button.getWidth(),button.getHeight())/2;
        button.layout(left ,top ,left + x,top + x);
    }

    private void layoutChildView(int i) {
        View v = getChildAt(i);
        int width_child = v.getMeasuredWidth();
        int height_child = v.getMeasuredHeight();
        v.layout((int) centerX ,(int) centerY, (int) centerX + width_child , (int) centerY + height_child);
    }

    //实现展开动画
    private void open() {
        int n = getChildCount() - 1 ;
        List<Animator> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            View v = getChildAt(i);
            int arc = 90 * i / ((n-2) == 0 ? 1 : (n-1)) + rollAngel;
            int x = (int)Math.cos(Math.toRadians(arc)) * radius;
            int y = (int)Math.sin(Math.toRadians(arc)) * radius;
            ObjectAnimator animatorX = ObjectAnimator.ofFloat(v,"translationX",0,x);
            ObjectAnimator animatorY = ObjectAnimator.ofFloat(v,"translationY",0,y);
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(v,"scaleX",0f,1);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(v,"scaleY",0f,1);
            list.add(animatorX);
            list.add(animatorY);
            list.add(scaleX);
            list.add(scaleY);
        }
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(list);
        animatorSet.setDuration(1000);
        animatorSet.start();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
    }

    //实现回收动画
    private void close() {
        int n = getChildCount() - 1;
        List<Animator> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            View v = getChildAt(i);
            int arc = 90 * i / ((n-1) == 0 ? 1 : (n-1)) + rollAngel;
            int x = (int)Math.cos(Math.toRadians(arc)) * radius;
            int y = (int)Math.sin(Math.toRadians(arc)) * radius;
            ObjectAnimator animatorX = ObjectAnimator.ofFloat(v,"translationX",x,0);
            ObjectAnimator animatorY = ObjectAnimator.ofFloat(v,"translationY",y,0);
            ObjectAnimator scaleX = ObjectAnimator.ofFloat(v,"scaleX",1,0f);
            ObjectAnimator scaleY = ObjectAnimator.ofFloat(v,"scaleY",1,0f);
            list.add(animatorX);
            list.add(animatorY);
            list.add(scaleX);
            list.add(scaleY);
        }
        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(list);
        animatorSet.setDuration(1000);
        animatorSet.start();
    }

    @Override
    public void onClick(View v) {
        Log.d("卫星","点击");
        if(isCheck){
            isCheck = false;
            invalidate();
            close();
        }else{
            isCheck = true;
            invalidate();
            open();
        }
    }
}

```



