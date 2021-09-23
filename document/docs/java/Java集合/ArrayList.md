

# ArrayList
##  ArrayList简介

ArrayList 相当于**动态数组** ,是对不可变数组的一种封装类型,当触发扩容机制后能够自动对数组进行扩容.它继承于AbstractList，实现了List, RandomAccess, Cloneable, java.io.Serializable这些接口。

ArrayList *继承了AbstractList，实现了List*。它是一个数组队列，提供了相关的添加、删除、修改、遍历等功能。

ArrayList *实现了RandmoAccess接口，即提供了随机访问功能。*RandmoAccess是java中用来被List实现，为List提供快速访问功能的。在ArrayList中，我们即可以通过元素的序号快速获取元素对象；这就是快速随机访问。稍后，我们会比较List的“快速随机访问”和“通过Iterator迭代器访问”的效率。

ArrayList 实现了Cloneable接口，即覆盖了函数clone()，能被克隆。

ArrayList 实现java.io.Serializable接口，这意味着ArrayList支持序列化，能通过序列化去传输。

## 构造函数

ArrayList 共有三个构造函数 

### 无参构造函数

```java
/**
 * 用于默认大小的空实例的共享空数组实例。 
 * 我们将其与 EMPTY_ELEMENTDATA 区分开来，以了解添加第一个元素时要膨胀多少	
 */
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};	
/**
 * 构造一个初始容量为 10 的空列表
 */
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```

此处可以看到,如果使用ArrayList的无参构造,ArrayList只会将节点数据复制为一个静态 final的一个名为DEFAULTCAPACITY_EMPTY_ELEMENTDATA的空数组.但是,注释说明了构造一个容量为10的空列表.所以此处跟踪下它的add方法,观察一下初始化容量为10是怎么由来的.

```java
private static final int DEFAULT_CAPACITY = 10;

public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private static int calculateCapacity(Object[] elementData, int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    return minCapacity;
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;
    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

可以看到,如果调用add方法后,add方法会先调用ensureCapacityInternal来检查当前的数组容量时候能够容纳新增的数据,ensureCapacityInternal方法调用calculateCapacity方法并传递一个新增后的尺寸minCapacity来判断时候能够容纳,不过此时的扩容后大小来自于calculateCapacity函数的计算,其非判断当前数据数组是否能与DEFAULTCAPACITY_EMPTY_ELEMENTDATA,如果等于就取DEFAULT_CAPACITY和增加后容量中较大的值.随后调用ensureExplicitCapacity检测是否需要扩容,需要扩容则调用grow进行扩容.

### 带初始容量的构造函数

```java
private static final Object[] EMPTY_ELEMENTDATA = {};

public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+ initialCapacity);
    }
}
```

如果说使用带参数的构造函数,如果初始化大小大于0 则初始化传入长度的object数组来存放数据,如果长度为0则使用EMPTY_ELEMENTDATA来作为初始化的数据容器,如果参数小于0 将会抛出参数异常的异常.

### 使用集合类对象构造ArrayList

```java
  public ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        if ((size = elementData.length) != 0) {
            // c.toArray might (incorrectly) not return Object[] (see 6260652)
            if (elementData.getClass() != Object[].class)
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // replace with empty array.
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }
```

传入一个已有的集合,然后将集合转换成数组赋值给elementData 如果集合长度为0 则赋值 EMPTY_ELEMENTDATA给elementData,此外,还判断力一下elementData的class类型,注释中说toArray方法不一定返回Object[],所以如果不是Object[],则调用Arrays,copyOf方法将数组复制为Object[].