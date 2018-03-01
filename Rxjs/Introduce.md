## ReactiveX

ReactiveX 是一个基于一系列可观察的异步和基础事件编程组成的一个库。

它继承观察者模式，支持序列数据或者事件。更高级的用法允许你将如下的一些抽象概念操作一起联合使用，比如低线程，同步，线程安全，数据并发，非阻塞I/O流。

**Observables通过成为访问多个项目异步序列的理想方法来填补空白**
****
 <em/> | 单项 | 多项
  ---- | ---- | ----
 **同步** | `T getData()` | `Iterable<T> getData()`
 **异步** | `Future<T> getData()` | `Observable<T> getData()`

 它通常被称为“函数响应式编程”，这是用词不当的。ReactiveX 可以是函数式的，可以是响应式的，但是和“函数响应式编程”是不同的。一个主要的不同点是“函数响应式编程”是对随时间次序变化的值进行操作的，而ReactiveX操作的是，整个时间段中产生的`离散值`。（可以看看[Conal Elliott关于函数式响应式编程更精确的介绍]("https://github.com/conal/talk-2015-essence-and-origins-of-frp")）

 ## 为什么使用Observables？

ReactiveX 可见模式允许你使用数组等数据项的集合来进行些异步事件流组合操作。它使你从繁琐的web式回调中解脱，从而能使得代码可读性大大提高，同时减少bug的产生。

### Observables是可组合的

像`Java Futures`这样的技术，是直接针对单一层级的异步操作的。一旦当其嵌套使用时，非平凡复杂度会大大增加。

很难直接使用Futures去优化异步执行流程（或者说不可能，因为每个请求的潜伏期在运行时都会改变）。使用`Future.get()`马上会使其变得复杂（然后因此易出错）或者提前进入阻塞状态，使得异步执行的有点荡然无存。

ReactiveX Observables，换句话说，是为了处理组合流和异步数据序列而设计的。

### Observables是灵活的

ReactiveX Observables 不仅支持单个数据流的散发（像Futures那样），还支持多值序列，甚至无穷个流。`Observable`是一种可以用于这些任意场景的单个抽象。Observable具备Iterable全部的灵活性，和更优雅的操作。

**Observable是Iterable的同步/拉的异步/推版映射**
****
event | Iterable(pull) | Observable(push)
---- | ---- | ----
检索数据 | `T next()` | `onNext(T)`
发现错误 |  `throws Exception` | `onError(Exception)`
完成 | `!hasNext()` | `onCompleted()`

### Observables是类型多变的

ReactiveX并不是只能用于某种来源的并发或异步。Observables可被用于线程池，事件循环，无阻塞I/O，Actor模型（像Akka这种），或者其他适合你的需求、你的风格、你的专业的东西。客户端代码可以使用Observables以异步方式来处理任何交互，无论你的潜在操作是阻塞的还是非阻塞的。
**Observable是怎么执行的？**
***
``` public Observable<data> getData();```
***
 * 是否是在同一个线程中同步调用？
 * 是否是在另一个线程中异步调用？
 * 是否被划分在多个线程中，且以任意顺序返回数据给调用者？
 * 是否是使用Actor（或多个Actor）而非线程池？
 * 是否是结合事件循环使用网络接口对象来做异步网络请求？
 * 是否使用事件循环划分了工作线程和回调线程？
***
从Observer的视角来看，这些都没问题！

还有一个点很重要：使用ReactiveX最终会改变你的思想，且在不触及你的Observable消费者的情况下，彻底颠覆你的Observable实现潜在的本质。

### 回调是有问题的

回调通过不允许任何阻塞行为，解决了`Future.get()`上过早阻塞的问题。他们在响应完成后才执行，所以自然是高效的。

但是回调在单层的异步执行上，还ok，一旦嵌套，就会变得非常难用。

### ReactiveX是跨语言的

ReactiveX目前支持大量语言，且遵循语言的使用习惯，更多的语言支持将加入豪华午餐。

## 响应式编程

ReactiveX提供了一个操作符集合，允许你去过滤、选取、转换、组合、构建Observables。这些都是很高效的。

你可以把Observable的"push"看作Iterable的"pull"。使用Iterable，消费者从生产者那里拉取数据，阻塞线程直到数据到达。与之对比，使用Observable，生产者将数据推送给消费者，无论数据是否可用。这种方法更加灵活，因为数据可以同步或是异步到达。

**以下代码展示Iterable和Observable的高阶函数是多么相似**
***
`Iterable`
```
getDataFromLocalMemory()
  .skip(10)
  .take(5)
  .map({ s -> return s + " transformed" })
  .forEach({ println "next => " + it }) 
```
`Observable`
```
getDataFromNetwork()
  .skip(10)
  .take(5)
  .map({ s -> return s + " transformed" })
  .subscribe({ println "onNext => " + it })
```

Observable在四人帮的观察者模式上添加了两个缺失的语义，以弥补以与Iterable一致。

1. 当没有更多的有效数据时生产者通知消费者的能力（Iterable上进行一次foreach循环，照常返回；Observable上执行观察者的`onCompleted`方法）
1. 当有错误发生时生产者通知消费者的能力（Iterable在迭代时若发生错误会抛出异常；Observable执行观察者的`onError`方法）

在这些条件下，ReactiveX完成了Iterable和Observable类型的一致化。二者的唯一不同在于其中数据流的方向。这一点非常重要，因为现在任何你可以在Iterable上执行的操作，同样可以在Observable上使用。