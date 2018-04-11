class MyPromise {
    constructor(executor) {
        // 缓存this
        let self = this
        // 设置初始态

        self.status = 'pending'
        // 定义成功的值默认undefined
        self.value = undefined
        // 定义失败的原因默认undefined
        self.reason = undefined
        // 定义成功的回调数组
        self.onResolvedCallbacks = []
        // 定义失败的回调数组
        self.onRejectedCallbacks = []
        // 定义成功时执行的函数
        let resolve = value => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject)
            }
            // 异步执行成功回调
            setTimeout(() => {
                if (self.status === 'pending') {
                    // 把状态改为成功态
                    self.status = 'fulfilled'
                    // 保存成功的值
                    self.value = value
                    // 遍历执行每个成功的回调
                    self.onResolvedCallbacks.forEach(onFulfilled => onFulfilled(value))
                }
            })
        }
        // 定义失败时执行的函数
        let reject = reason => {
            // 异步执行失败回调
            setTimeout(() => {
                if (self.status === 'pending') {
                    // 把状态改为失败态
                    self.status = 'rejected'
                    // 保存失败的原因
                    self.reason = reason
                    // 遍历执行每个失败的回调
                    self.onRejectedCallbacks.forEach(onRejected => onRejected(reason))
                }
            })
        }
        // 由于调用executor这个方法有可能异常，需要将捕获的异常reject出去

        try {
        // 运行传进来的函数把成功和失败的方法传进去
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    /**
     * @param {value} onFulfilled //值的穿透，默认值往后传
     * @param {reason} onRejected //默认把失败原因往后抛
     */
    then(onFulfilled = value => value, onRejected = reason => {throw reason}) {
        // 缓存this,定义promise2
        let self = this

        let promise2
        // promise主要解决程序，也是promise的难点

        let resolveExecutor = (promise2, x, resolve, reject) => {
            // 定义个标识 promise2是否已经resolve 或 reject了
            let isThenCalled = false
            // 2.3.1 如果promise和x引用同一个对象，则以TypeError为原因拒绝promise。

            if (promise2 === x) {
                return reject(new TypeError('循环引用！！！'))
            }
            // 2.3.2 如果x是一个promise，采用它的状态【3.4】
            if (x instanceof MyPromise) {
                /**
                     * 2.3.2.1 如果x是初始态，promise必须保持初始态(即递归执行这个解决程序)，直到x被成功或被失败。（即，直到resolve或者reject执行）
                */
                if (x.status === 'pending') {
                    x.then(function(y) {
                        resolveExecutor(promise2, y, resolve, reject)
                    }, reject)
                } else {
                    // 2.3.2.2 如果/当x被成功时，用相同的值（结果）履行promise。
                    // 2.3.2.3 如果/当x被失败时，用相同的错误原因履行promise。
                    x.then(resolve, reject)
                }
            } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
                // 2.3.3 否则，如果x是一个对象或函数,
                try {
                    // 2.3.3.1 让then等于x.then。【3.5】
                    let then = x.then

                    if (typeof then === 'function') {
                        // 2.3.3.3.3 如果resolvePromise和rejectPromise都被调用，或者对同一个参数进行多次调用，则第一次调用优先，并且任何进一步的调用都会被忽略。
                        let resolvePromise = y => {
                            // 如果promise2已经成功或失败了，就return掉
                            if (isThenCalled) {
                                return
                            }
                            isThenCalled = true
                            // 2.3.3.3.1 如果使用值（结果）y调用resolvePromise，运行[[Resolve]]（promise，y）我的解决程序的名字是resolveExecutor,也就是递归调用。
                            resolveExecutor(promise2, y, resolve, reject)
                        }

                        let rejectPromise = r => {
                            // 如果promise2已经成功或失败了，就return掉
                            if (isThenCalled) {
                                return
                            }
                            isThenCalled = true
                            // 2.3.3.3.2 如果使用拒绝原因r调用resolvePromise，运行reject(r)。
                            reject(r)
                        }
                        // 2.3.3.3 如果then是一个函数，则使用x作为此参数调用它，第一个参数resolveExecutor，第二个参数rejectPromise

                        then.call(x, resolvePromise, rejectPromise)
                    } else {
                        // 到此的话x不是一个thenable对象，那直接把它当成值resolve promise2就可以了
                        resolve(x)
                    }
                } catch (e) {
                    // 2.3.3.3.4 如果调用then方法抛出异常e，
                    // 2.3.3.3.4.1 如果resolvePromise或rejectPromise已经调用了，则忽略它。
                    if (isThenCalled) {
                        return
                    }
                    isThenCalled = true

                    // 2.3.3.2 如果x.then导致抛出异常e，拒绝promise并用e作为失败原因
                    // 2.3.3.3.4.2 否则，以e作为失败原因拒绝promise
                    reject(e)
                }
            } else {
                // 2.3.3.4 如果then不是一个对象或者函数，则用x作为值（结果）履行promise。
                resolve(x)
            }
        }

        if (self.status === 'fulfilled') {
        // 2.2.7
            return (promise2 = new MyPromise((resolve, reject) => {
                // 2.2.4 在执行上下文堆栈仅包含平台代码之前，不能调用onFulfilled或onRejected。[3.1]。
                // 3.1 这里的“平台代码”是指引擎，环境和primise实现代码。在实践中，这个要求确保onFulfilled和onRejected异步执行，在事件循环开始之后then被调用，和一个新的堆栈。这可以使用诸如setTimeout或setImmediate之类的“宏任务”机制，或者使用诸如MutationObserver或process.nextTick的“微任务”机制来实现。由于promise实现被认为是经过深思熟虑的平台代码，因此它本身可能包含调用处理程序的任务调度队列或或称为“trampoline”（可重用的）的处理程序。
                // 让onFulfilled异步执行
                setTimeout(() => {
                    try {
                        let x = onFulfilled(self.value)

                        resolveExecutor(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }))
        }
        if (self.status === 'rejected') {
            return (promise2 = new MyPromise((resolve, reject) => {
                // 2.2.4 在执行上下文堆栈仅包含平台代码之前，不能调用onFulfilled或onRejected。[3.1]。
                // 3.1 这里的“平台代码”是指引擎，环境和primise实现代码。在实践中，这个要求确保onFulfilled和onRejected异步执行，在事件循环开始之后then被调用，和一个新的堆栈。这可以使用诸如setTimeout或setImmediate之类的“宏任务”机制，或者使用诸如MutationObserver或process.nextTick的“微任务”机制来实现。由于promise实现被认为是经过深思熟虑的平台代码，因此它本身可能包含调用处理程序的任务调度队列或或称为“trampoline”（可重用的）的处理程序。
                // 让onFulfilled异步执行
                setTimeout(() => {
                    try {
                        let x = onRejected(self.reason)

                        resolveExecutor(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }))
        }
        if (self.status === 'pending') {
            return (promise2 = new MyPromise((resolve, reject) => {
                self.onResolvedCallbacks.push(() => {
                    try {
                        let x = onFulfilled(self.value)

                        resolveExecutor(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
                self.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(self.reason)

                        resolveExecutor(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            }))
        }
    }
    catch(onRejected) {
        this.then(null, onRejected)
    }
    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => {throw reason})
        )
    }
    // 立即成功的promise
    static resolve(value) {
        return new MyPromise(resolve => {
            resolve(value)
        })
    }
    // 立即失败的promise
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
    // promise all方法，只要有一个失败就失败了。
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let len = promises.length

            let resolveAry = []

            let count = 0

            for (let i = 0;i < len;i++) {
                promises[i].then(value => {
                    resolveAry[i] = value
                    if (++count === len) {resolve(resolveAry)}
                }, reject)
            }
        })
    }
    // promise all方法，只要有一个失败就失败了。
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0, l = promises.length;i < l;i++) {
                promises[i].then(resolve, reject)
            }
        })
    }
}
module.exports = MyPromise

