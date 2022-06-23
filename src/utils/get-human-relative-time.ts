const units: [string, number][] = [
  ["year", 31536000000],
  ["month", 2628000000],
  ["day", 86400000],
  ["hour", 3600000],
  ["minute", 60000],
  ["second", 1000],
];

const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

const getRelativeTime = (dates: { from: Date | string; to: Date | string }) => {
  const elapsed = new Date(dates.to).getTime() - new Date(dates.from).getTime()

  for (const [unit, amount] of units) {
    if (Math.abs(elapsed) > amount || unit === "second") {
      return {
        raw: elapsed,
        rtf: rtf.format(Math.round(elapsed / amount), unit)
      };
    }
  }

  return { raw: 0, rtf: "" }
};

export default getRelativeTime