import { escapeRegExp, isObject } from "lodash-es";
import dayjs from 'dayjs'

/**
 * 通过canvas获取字符的实际宽度
 * @param text 传入的字符串
 * @param options 可以传入字体大小，字体
 * @return 字符串实际像素
 * @example getActualWidthOfChars('性能数据')=>48
 */
export const getActualWidthOfChars = (text: string, options: {
    size?: number,
    family?: string
} = {}):number => {
    const {size = 14, family = "Microsoft YaHei"} = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${size}px ${family}`;
    const metrics = ctx.measureText(text);
    const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
    return Math.max(metrics.width, actual);
};

/**
 * @description 生成随机颜色
 * @returns array<string> 随机color数组
 * @example generateRandomColor() => ['rgb(48, 62, 6)',...]
 */
export const generateRandomColor = (): string[] => {
    const limit = 80;
    const colors = [];
    for (let i = 0; i < limit; i += 1) {
        colors.push(`rgb(${Math.round(Math.random() * 180)}, ${Math.round(Math.random() * 180)}, ${Math.round(Math.random() * 180)})`);
    }
    return colors;
}
/**
 * 获取url参数
 * @param name 参数名
 * @example getQueryString('p_from') => 'xxx'
 */
export const getQueryString = (name: string): string | null => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    const res = window.location.search.substr(1).match(reg);
    if (res != null) return res[2];
    return null;
};

/**
 * 复制到剪贴板 支持http请求
 * @param text
 * @example copyToClipboard('http://www.baidu.com')
 */
const copyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.textContent = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
};
/**
 * 编码字符串
 * @param val 编码字符串
 * @example encodeValue('test?') => 'test%3F'
 */
export const encodeValue = (val: string) => {
    if (!val) return val;
    return encodeURIComponent(val);
};
/**
 * 解码字符串
 * @param val 解码字符串
 * @example decodeValue('test%3F') => 'test?'
 */
const decodeValue = (val: string) => {
    try {
        if (!val) return val;
        return decodeURIComponent(val);
    } catch (e) {
        return val;
    }
};
/**
 * 转义对象中的特殊字符 例: / => %2F
 * @param obj
 * @example encodeObject({cpu: 'intel i7',gpu:'rtx 4090'}) => {cpu: 'intel%20i7',gpu:'rtx%204090'}
 */
export const encodeObject = (obj: {}) => {
    if (!isObject(obj)) {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = encodeValue(obj[key]);
        return acc;
    }, {});
};

/**
 * 解码对象中的特殊字符
 * @param obj
 * @example decodeObject({cpu: 'intel%20i7',gpu:'rtx%204090'}) => {cpu: 'intel i7',gpu:'rtx 4090'}
 */
const decodeObject = (obj: {}) => {
    if (!isObject(obj)) {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = decodeValue(obj[key]);
        return acc;
    }, {});
};
/**
 * 转义对象中含有正则中的特殊字符
 * @param obj
 * @example escapeRegExpObject({a:'[lodash]'}) => {a:'\[lodash\]'}
 */
const escapeRegExpObject = (obj: {}) => {
    if (!isObject(obj)) {
        return obj;
    }
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = escapeRegExp(obj[key]);
        return acc;
    }, {});
};
/**
 * 检查日期格式，没有时分秒补充 23:59:59
 * @param dateString
 */
const checkAndCompleteDate = (dateString: string) => {
    const date = dayjs(dateString, ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss']);
    if (date.isValid()) {
        if (/\d{2}:\d{2}:\d{2}/.test(dateString)) {
            // 如果日期格式正确，则直接返回该日期
            return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
        } else {
            // 将该日期的时间部分设置为 23:59:59
            return dayjs(dateString).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        }

    } else {
        return dateString
    }
};
/**
 * 转换为带连字符的uuid字符串
 * @param uuidStr uuid字符串
 * @returns {*|string}
 */
export const formatUUID = (uuidStr: string) => {
    // 定义匹配不带连字符的 UUID 的正则表达式
    const uuidPattern = /^[a-fA-F0-9]{32}$/;
    // 判断字符串是否为 UUID
    if (uuidPattern.test(uuidStr)) {
        // 在 UUID 的适当位置插入连字符
        return `${uuidStr.slice(0, 8)}-${uuidStr.slice(8, 12)}-${uuidStr.slice(12, 16)}-${uuidStr.slice(16, 20)}-${uuidStr.slice(20)}`;
    }
    return uuidStr
};
/**
 * 跳转锚点
 * @param anchorName id名称
 */
export const scrollToAnchor = (anchorName: string) => {
    if (anchorName) {
        // 找到锚点
        const anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if (anchorElement) {
            anchorElement.scrollIntoView({block: 'start', behavior: 'smooth'});
        }
    }
};
// 中英文数字混合排序
export const mixedSort = (_a: string | number, _b: string | number) => {
    const reg = /[a-zA-Z0-9]/;
    if (_a === undefined || _b === undefined) {
        return 0;
    }
    // 比对仅针对字符串，数字参与对比会导致对比的字符串转为number类型，变成NaN
    const a = _a.toString();
    const b = _b.toString();
    // 比对0号位的原因是字符串中有可能出现中英文混合的情况，这种仅按首位排序即可
    if (reg.test(a[0]) || reg.test(b[0])) {
        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        } else {
            return 0;
        }
    } else {
        return a.localeCompare(b);
    }
};

// 特殊数字转换(NaN/Infinity => 0)
export const convertSpecialNumbers = (num: number) => {
    if (num.toString() === 'NaN' || num.toString() === 'Infinity') {
        return 0
    }
    return num
}
// 处理空数字 0显示0 null undefined显示--
export const convertEmptyNumber = (num: number) => {
    if (num === 0) return 0;
    if (num === null || num === undefined) {
        return '--';
    }
    return num;
};
/**
 * 修改对象/数组的 键和值
 * @param obj 对象或数组
 * @param keysMap 格式{ gender: 'sex' }
 * @returns {{}|*}
 */
export const replaceKeys = (obj: any, keysMap: Record<string, string>): any => {
    if (Array.isArray(obj)) {
        return obj.map((item) => replaceKeys(item, keysMap));
    } else {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = keysMap[key] || key;
            acc[newKey] = obj[key];
            return acc;
        }, {} as Record<string, any>);
    }
};

// 字节转其他单位
export const bytesConverter = (bytes: number, unit = 'GB') => {
    if (!bytes && bytes !== 0) return undefined
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // eslint-disable-next-line no-restricted-properties
    return (bytes / Math.pow(1024, units.indexOf(unit.toUpperCase()))).toFixed(2);
};
/**
 * 生成一个唯一的key
 */
export const getRandomKey = () => {
    return Math.random().toString(36).substring(2);
}
