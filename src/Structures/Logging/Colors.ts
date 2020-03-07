//* TypeScript-esk library for Colors
//* Project (revised from): https://github.com/ohlookitsderpy/leeks.js
import { inspect } from 'util';

const data: { [x in 'colors' | 'styles']: { [x: string]: number } } = {
    colors: {
        black: 30,
        red: 31,
        green: 32,
        yellow: 33,
        blue: 34,
        magenta: 35,
        cyan: 36,
        white: 37,
        gray: 90,
        grey: 90,
        blackBright: 90,
        redBright: 91,
        greenBright: 92,
        yellowBright: 93,
        blueBright: 94,
        magentaBright: 95,
        cyanBright: 96,
        whiteBright: 97,
        bgBlack: 40,
        bgRed: 41,
        bgGreen: 42,
        bgYellow: 43,
        bgBlue: 44,
        bgMagenta: 45,
        bgCyan: 46,
        bgWhite: 47,
        bgBlackBright: 100,
        bgRedBright: 101,
        bgGreenBright: 102,
        bgYellowBright: 103,
        bgBlueBright: 104,
        bgMagentaBright: 105,
        bgCyanBright: 106,
        bgWhiteBright: 107,
        bgGray: 100,
        bgGrey: 100
    },
    styles: {
        reset: 0,
        bold: 1,
        dim: 2,
        italic: 3,
        underline: 4,
        blink: 5,
        inverse: 7,
        strikethrough: 9
    }
};

type IColor = 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey' |
    'blackBright' | 'redBright' | 'yellowBright' | 'blueBright' | 'magentaBright' | 'cyanBright' | 'whiteBright' | 'greenBright' |
    'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite' |
    'bgBlackBright' | 'bgRedBright' | 'bgGreenBright' | 'bgBlueBright' | 'bgMagentaBright' | 'bgCyanBright' | 'bgWhiteBright' | 'bgYellowBright' |
    'bgGray' | 'bgGrey';

type IStyle = 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'blink' | 'inverse' | 'strikethrough';

const convertText = (t: string | object) => typeof t === 'object'? inspect(t): t; 
const styles: { [x in IStyle]: (t: string | object) => string } = {
    reset: (t: string | object)         => `\x1b[${data.styles.reset}m${convertText(t)}\x1b[0m`,
    bold: (t: string | object)          => `\x1b[${data.styles.bold}m${convertText(t)}\x1b[0m`,
    dim: (t: string | object)           => `\x1b[${data.styles.dim}m${convertText(t)}\x1b[0m`,
    italic: (t: string | object)        => `\x1b[${data.styles.italic}m${convertText(t)}\x1b[0m`,
    underline: (t: string | object)     => `\x1b[${data.styles.underline}m${convertText(t)}\x1b[0m`,
    blink: (t: string | object)         => `\x1b[${data.styles.blink}m${convertText(t)}\x1b[0m`,
    inverse: (t: string | object)       => `\x1b[${data.styles.inverse}m${convertText(t)}\x1b[0m`,
    strikethrough: (t: string | object) => `\x1b[${data.styles.strikethrough}m${convertText(t)}\x1b[0m`
};

const colors: { [x in IColor]: (t: string | object) => string } = {
    black: (t: string | object) => `\x1b[${data.colors.black}m${convertText(t)}\x1b[0m`,
    red: (t: string | object) => `\x1b[${data.colors.red}m${convertText(t)}\x1b[0m`,
    green: (t: string | object) => `\x1b[${data.colors.green}m${convertText(t)}\x1b[0m`,
    yellow: (t: string | object) => `\x1b[${data.colors.yellow}m${convertText(t)}\x1b[0m`,
    blue: (t: string | object) => `\x1b[${data.colors.blue}m${convertText(t)}\x1b[0m`,
    magenta: (t: string | object) => `\x1b[${data.colors.magenta}m${convertText(t)}\x1b[0m`,
    cyan: (t: string | object) => `\x1b[${data.colors.cyan}m${convertText(t)}\x1b[0m`,
    white: (t: string | object) => `\x1b[${data.colors.white}m${convertText(t)}\x1b[0m`,
    gray: (t: string | object) => `\x1b[${data.colors.gray}m${convertText(t)}\x1b[0m`,
    grey: (t: string | object) => `\x1b[${data.colors.grey}m${convertText(t)}\x1b[0m`,
    blackBright: (t: string | object) => `\x1b[${data.colors.blackBright}m${convertText(t)}\x1b[0m`,
    redBright: (t: string | object) => `\x1b[${data.colors.redBright}m${convertText(t)}\x1b[0m`,
    greenBright: (t: string | object) => `\x1b[${data.colors.greenBright}m${convertText(t)}\x1b[0m`,
    yellowBright: (t: string | object) => `\x1b[${data.colors.yellowBright}m${convertText(t)}\x1b[0m`,
    blueBright: (t: string | object) => `\x1b[${data.colors.blueBright}m${convertText(t)}\x1b[0m`,
    magentaBright: (t: string | object) => `\x1b[${data.colors.magentaBright}m${convertText(t)}\x1b[0m`,
    cyanBright: (t: string | object) => `\x1b[${data.colors.cyanBright}m${convertText(t)}\x1b[0m`,
    whiteBright: (t: string | object) => `\x1b[${data.colors.whiteBright}m${convertText(t)}\x1b[0m`,
    bgBlack: (t: string | object) => `\x1b[${data.colors.bgBlack}m${convertText(t)}\x1b[0m`,
    bgRed: (t: string | object) => `\x1b[${data.colors.bgRed}m${convertText(t)}\x1b[0m`,
    bgGreen: (t: string | object) => `\x1b[${data.colors.bgGreen}m${convertText(t)}\x1b[0m`,
    bgYellow: (t: string | object) => `\x1b[${data.colors.bgYellow}m${convertText(t)}\x1b[0m`,
    bgBlue: (t: string | object) => `\x1b[${data.colors.bgBlue}m${convertText(t)}\x1b[0m`,
    bgMagenta: (t: string | object) => `\x1b[${data.colors.bgMagenta}m${convertText(t)}\x1b[0m`,
    bgCyan: (t: string | object) => `\x1b[${data.colors.bgCyan}m${convertText(t)}\x1b[0m`,
    bgWhite: (t: string | object) => `\x1b[${data.colors.bgWhite}m${convertText(t)}\x1b[0m`,
    bgBlackBright: (t: string | object) => `\x1b[${data.colors.bgBlackBright}m${convertText(t)}\x1b[0m`,
    bgRedBright: (t: string | object) => `\x1b[${data.colors.bgRedBright}m${convertText(t)}\x1b[0m`,
    bgGreenBright: (t: string | object) => `\x1b[${data.colors.bgGreenBright}m${convertText(t)}\x1b[0m`,
    bgYellowBright: (t: string | object) => `\x1b[${data.colors.bgYellowBright}m${convertText(t)}\x1b[0m`,
    bgBlueBright: (t: string | object) => `\x1b[${data.colors.bgBlueBright}m${convertText(t)}\x1b[0m`,
    bgMagentaBright: (t: string | object) => `\x1b[${data.colors.bgMagentaBright}m${convertText(t)}\x1b[0m`,
    bgCyanBright: (t: string | object) => `\x1b[${data.colors.bgCyanBright}m${convertText(t)}\x1b[0m`,
    bgWhiteBright: (t: string | object) => `\x1b[${data.colors.bgWhiteBright}m${convertText(t)}\x1b[0m`,
    bgGray: (t: string | object) => `\x1b[${data.colors.bgGray}m${convertText(t)}\x1b[0m`,
    bgGrey: (t: string | object) => `\x1b[${data.colors.bgGrey}m${convertText(t)}\x1b[0m`,
};

export const rgb = (values: [number, number, number], text: string | object) => '\033[32;2;' + `${values[0]};${values[1]};${values[2]}m${convertText(text)}\x1b[0m`;
export const rgbBg = (values: [number, number, number], text: string | object) => '\033[48;2;' + `${values[0]};${values[1]};${values[2]}m${convertText(text)}\x1b[0m`;

export {
    styles as Styles
};

export default colors;