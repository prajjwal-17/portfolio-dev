import experience from "@/data/experience";

// The Spense internship starts on 15 December 2026 (midnight IST).
const SPENSE_START = Date.UTC(2026, 11, 14, 18, 30);

export const SPENSE = {
  name: "Spense",
  url: "https://spense.tech",
  about: "Bengaluru-based fintech building credit and card infrastructure for banks and fintechs",
};

/** Current role line. Switches from "Upcoming" on the internship start date. */
export function getRole(now = new Date()) {
  const started = now.getTime() >= SPENSE_START;
  return {
    started,
    title: "Software Engineer",
    status: started ? `SWE Intern at ${SPENSE.name}` : `Upcoming SWE Intern at ${SPENSE.name}`,
  };
}

/** Experience list with the Spense internship on top, worded for today's date. */
export function getExperience(now = new Date()) {
  const { started } = getRole(now);
  return [
    {
      role: started ? "SWE Intern" : "SWE Intern (upcoming)",
      company: SPENSE.name,
      location: "",
      duration: started ? "December 2026 - Present" : "Starting 15 December 2026",
      description: started
        ? `Software engineering intern at Spense, a ${SPENSE.about}.`
        : `Joining Spense, a ${SPENSE.about}, as a software engineering intern.`,
      proof: "",
    },
    ...experience,
  ];
}
