const MathTool = require('../mathTool/MathTool');
class Calendar {
    ymdReg = /^(YY).(MM).(DD).?$/g;
    hmsReg = /^(hh).(mm).(ss).?$/g;
    dateReg = /^(YY).(MM).(DD).?\s(hh).(mm).?(ss)?.?$/g;
    _getCurDate() {
        return new Date();
    }

    getMonth() {
        const month = this.CurDate ? this.CurDate.getMonth() : this._getCurDate().getMonth();
        return month + 1;
    }

    _createYMDArray() {
        return [this.CurDate.getFullYear(), this.getMonth(), this.CurDate.getDate()];
    }

    _createHMSArray() {
        return [this.CurDate.getHours(), this.CurDate.getMinutes(), this.CurDate.getSeconds()];
    }

    _createArray(format, captures) {
        let date = null;
        if (captures.length === 6) {
            date = [].concat(this._createYMDArray(), this._createHMSArray());
        } else {
            date = this.ymdReg.test(format) ? this._createYMDArray() : this._createHMSArray();
        }
        return captures.map((val, index) => {
            return { key: val, value: MathTool.getUseTwoNumberToString(date[index]) };
        })
    }

    /**
     * 获取返回时间格式对应的时间字符串
     * @param {*} format 时间格式
     * @param {*} reg 正则
     * @returns String
     */
    _getReplaceFormat(format, reg) {
        return format.replace(reg, (match, ...captures) => {
            captures.splice(-2);
            const strs = this._createArray(format, captures);
            return strs.map((str) => {
                const { key, value } = str;
                match = match.replace(key, value);
                return match;
            }).pop();
        })
    }

    /**
     * 
     * @param {*} dateTime 时间
     * @param {*} format 时间格式  默认时间格式YY.MM.DD hh:mm:ss 可选YY.MM.DD或hh:mm:ss
     * @returns String
     */
    getStringCalender(dateTime, format = 'YY.MM.DD hh:mm:ss') {
        this.CurDate = dateTime ? new Date(dateTime) : this._getCurDate();
        const regs = [this.ymdReg, this.hmsReg, this.dateReg];
        return this._getReplaceFormat(format, regs.find(reg => reg.test(format)));
    }
}
module.exports = new Calendar();