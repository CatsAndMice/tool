const StrategyFromTest = require('../fromTest/StrategyFromTest'),
    { isValueNoEmpty, _error } = require('../tool')
class MyEvent {
    constructor() {
        this.event = {};
        this.maxCacheNum = 15;
    }

    _isHaveKey(key) {
        StrategyFromTest.addCacheTest(key, Object.assign(isValueNoEmpty, { errorFn: () => _warn('事件名不能为空') }));
        return StrategyFromTest.start();
    }

    _isHaveKeyAndValue(key, value) {
        const isHaveKey = this._isHaveKey(key);
        StrategyFromTest.addCacheTest(value, Object.assign(isValueNoEmpty, { errorFn: () => _warn('事件事件不能为空') }))
        return isHaveKey && StrategyFromTest.start();
    }

    _isTypeFunc(value) {
        let type = Object.prototype.toString.call(value);
        return /Function/.test(type);
    }

    _addEvent(key, value, once = false) {
        if (this._isHaveKeyAndValue(key, value)) {
            once && this._isTypeFunc(value) ? value.once = true : null;
            if (this.event.hasOwnProperty(key)) {
                let callBacks = this.event[key];
                if (!key.includes(value)) {
                    let keyLen = callBacks.length;
                    keyLen < this.maxCacheNum ? null : callBacks.shift() && _error('已超出最大缓存量!请注意内存泄露');
                    callBacks.push(value);
                }

                return;
            }
            this.event[key] = [value];
        }
    }

    /**
     * 设置最大缓存数
     */
    setMaxCacheNum(num) {
        this.maxCacheNum = num;
    }

    on(key, value) {
        this._addEvent(key, value);
    }

    once(key, value) {
        this._addEvent(key, value, true);
    }

    _deleteKey(key) {
        StrategyFromTest.addCacheTest(this.event[key], { description: 'islengthNoZero' });
        StrategyFromTest.start() ? null : delete this.event[key];
    }

    trigger(key) {
        let values = this.event[key];
        if (!this._isHaveKey(key) || !values) return;
        values.forEach((value, index) => {
            this._isTypeFunc(value) ? value() : null;
            value.once ? this.event[key].splice(index, 1) && this._deleteKey(key) : null;
        })
    }

    remove(key) {
        this._isHaveKey(key) ? delete this.event[key] : null;
    }
}

module.exports = new MyEvent();
