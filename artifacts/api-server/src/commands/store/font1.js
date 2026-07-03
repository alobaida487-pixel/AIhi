module.exports = {
    name: 'font1',
    async execute(message, args, client) {
        let words = args.join(" ");
        if (!words) return message.channel.send('> ** | Please __Write a Word__ !**');

        let words3 = words.replaceAll("a", "𝗮").replaceAll("A", "𝗔").replaceAll("b", "𝗯").replaceAll("B", "𝗕").replaceAll('c', "𝗰").replaceAll("C", "𝗖").replaceAll("d", "𝗱").replaceAll("D", "𝗗").replaceAll("e", "𝗲").replaceAll("E", "𝗘").replaceAll("f", "𝗳").replaceAll("F", "𝗙").replaceAll("g", "𝗴").replaceAll("G", "𝗚").replaceAll("h", "𝗵").replaceAll("H", "𝗛").replaceAll("i", "𝗶").replaceAll("I", "𝗜").replaceAll("j", "𝗷").replaceAll("J", "𝗝").replaceAll("k", "𝗸").replaceAll("K", "𝗞").replaceAll("l", "𝗹").replaceAll("L", "𝗟").replaceAll("m", "𝗺").replaceAll("M", "𝗠").replaceAll("n", "𝗻").replaceAll("N", "𝗡").replaceAll("o", "𝗼").replaceAll("O", "𝗢").replaceAll("p", "𝗽").replaceAll("P", "𝗣").replaceAll("q", "𝗾").replaceAll("Q", "𝗤").replaceAll("r", "𝗿").replaceAll("R", "𝗥").replaceAll("s", "𝘀").replaceAll("S", "𝗦").replaceAll("t", "𝘁").replaceAll("T", "𝗧").replaceAll("u", "𝘂").replaceAll("U", "𝗨").replaceAll("v", "𝘃").replaceAll("V", "𝗩").replaceAll("w", "𝘄").replaceAll("W", "𝗪").replaceAll("x", "𝘅").replaceAll("X", "𝗫").replaceAll("y", "𝘆").replaceAll("Y", "𝗬").replaceAll("z", "𝘇").replaceAll("Z", "𝗭");

        message.channel.send(`${words3}`);
    }
};
