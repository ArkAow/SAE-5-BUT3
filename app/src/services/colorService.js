export function getShade(colorHexaCode) {
    const MULTIPLIER = 0.80;
    let colors = convertHexaToDeci(colorHexaCode);
    
    let shadedColors = colors.map(color => Math.round(color * MULTIPLIER));
    
    let colorShade = convertDeciToHexa(shadedColors);
    return colorShade;
};

export function convertDeciToHexa(colorDecimalCode) {
    let hexString = "#";

    colorDecimalCode.forEach(decimalColor => {
        let hexComponent = decimalColor.toString(16).padStart(2, '0');
        hexString += hexComponent;
    });

    return hexString;
};

export function convertHexaToDeci(colorHexadecimalCode) {
    colorHexadecimalCode = colorHexadecimalCode.replace("#", "");

    let hexadecimalColors = [];
    for (let i = 0; i < 6; i += 2) {
        hexadecimalColors.push(colorHexadecimalCode.slice(i, i + 2));
    }
    
    let decimalColors = [];
    hexadecimalColors.forEach(hexadecimalColor => {
        decimalColors.push(parseInt(hexadecimalColor, 16));
    });

    return decimalColors;
}

export function isBlack(colorCode) {

    let decimalColors;
    if (colorCode.startsWith("#")) {
        decimalColors = convertHexaToDeci(colorCode);
    } else {
        decimalColors = colorCode; 
    }

   
    const [r, g, b] = decimalColors;

    
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    
    return luminance < 128;
}
