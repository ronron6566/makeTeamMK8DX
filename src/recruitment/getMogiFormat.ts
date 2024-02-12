export const getMogiFormat = (text: string): number | null => {
    // 正規表現でvを挟んでいる数字を抽出
    const match = text.match(/(\d+)v\d+/);
    if (match) {
        return parseInt(match[1], 10);
    } else {
        return null;
    }
}