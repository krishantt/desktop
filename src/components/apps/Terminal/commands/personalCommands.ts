import personalData from "../../../../../personal-data.json";
import type { CommandFunction } from "../types";

// Define types for personal data structure
interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  technologies?: string[];
}

interface Project {
  name: string;
  description: string;
  tech: string[];
  url: string;
  status: string;
  year: string;
}

interface Education {
  degree: string;
  field: string;
  institution: string;
  period: string;
  location: string;
  gpa?: string;
  description?: string;
}

interface Certification {
  name: string;
  issuer: string;
  year: string;
  description: string;
}

interface Award {
  title: string;
  event: string;
  year: string;
  description: string;
}

interface Leadership {
  role: string;
  organization: string;
  period: string;
  description: string;
}

export const personalCommands: { [key: string]: CommandFunction } = {
  about: () => [
    `👋 Hi, I'm ${personalData.name}!`,
    "",
    `${personalData.title} based in ${personalData.location}`,
    "",
    personalData.bio.long,
  ],

  skills: () => {
    const skillsOutput = ["🚀 Technical Skills & Stack:", ""];

    Object.entries(personalData.skills).forEach(([category, items]) => {
      skillsOutput.push(
        `${category.charAt(0).toUpperCase() + category.slice(1)}:`
      );
      skillsOutput.push(`  ${(items as string[]).join(", ")}`);
      skillsOutput.push("");
    });

    return skillsOutput;
  },

  experience: () => {
    const expOutput = ["💼 Professional Experience:", ""];

    personalData.experience.forEach((exp: Experience, index: number) => {
      expOutput.push(`${index + 1}. ${exp.role} @ ${exp.company}`);
      expOutput.push(`   Period: ${exp.period}`);
      expOutput.push(`   Location: ${exp.location}`);
      expOutput.push(`   Type: ${exp.type}`);
      expOutput.push(`   ${exp.description}`);
      if (exp.technologies) {
        expOutput.push(`   Technologies: ${exp.technologies.join(", ")}`);
      }
      expOutput.push("");
    });

    return expOutput;
  },

  projects: () => {
    const projectOutput = ["🔥 Featured Projects:", ""];

    personalData.projects.forEach((project: Project, index: number) => {
      projectOutput.push(`${index + 1}. ${project.name}`);
      projectOutput.push(`   ${project.description}`);
      projectOutput.push(`   Tech: ${project.tech.join(", ")}`);
      projectOutput.push(`   URL: ${project.url}`);
      projectOutput.push(
        `   Year: ${project.year} | Status: ${project.status}`
      );
      projectOutput.push("");
    });

    return projectOutput;
  },

  contact: () => [
    "📧 Get in Touch:",
    "",
    `Email: ${personalData.email}`,
    `Phone: ${personalData.phone}`,
    `Website: ${personalData.website}`,
    "",
    "🌐 Social Links:",
    `GitHub: ${personalData.social.github}`,
    `LinkedIn: ${personalData.social.linkedin}`,
    `Twitter: ${personalData.social.twitter}`,
    `Instagram: ${personalData.social.instagram}`,
    "",
    "📅 Schedule a Call:",
    `Calendly: ${personalData.social.calendly}`,
    "",
    "Feel free to reach out for collaborations or just to say hi! 👋",
  ],

  education: () => {
    const eduOutput = ["🎓 Education:", ""];

    personalData.education.forEach((edu: Education, index: number) => {
      eduOutput.push(`${index + 1}. ${edu.degree} - ${edu.field}`);
      eduOutput.push(`   Institution: ${edu.institution}`);
      eduOutput.push(`   Period: ${edu.period}`);
      eduOutput.push(`   Location: ${edu.location}`);
      if (edu.gpa) {
        eduOutput.push(`   GPA: ${edu.gpa}`);
      }
      if (edu.description) {
        eduOutput.push(`   ${edu.description}`);
      }
      eduOutput.push("");
    });

    return eduOutput;
  },

  certifications: () => {
    const certOutput = ["🏆 Certifications:", ""];

    personalData.certifications.forEach(
      (cert: Certification, index: number) => {
        certOutput.push(`${index + 1}. ${cert.name}`);
        certOutput.push(`   Issuer: ${cert.issuer}`);
        certOutput.push(`   Year: ${cert.year}`);
        certOutput.push(`   ${cert.description}`);
        certOutput.push("");
      }
    );

    return certOutput;
  },

  awards: () => {
    const awardOutput = ["🥇 Awards & Achievements:", ""];

    personalData.awards.forEach((award: Award, index: number) => {
      awardOutput.push(`${index + 1}. ${award.title}`);
      awardOutput.push(`   Event: ${award.event}`);
      awardOutput.push(`   Year: ${award.year}`);
      awardOutput.push(`   ${award.description}`);
      awardOutput.push("");
    });

    return awardOutput;
  },

  leadership: () => {
    const leaderOutput = ["👑 Leadership Experience:", ""];

    personalData.leadership.forEach((lead: Leadership, index: number) => {
      leaderOutput.push(`${index + 1}. ${lead.role} @ ${lead.organization}`);
      leaderOutput.push(`   Period: ${lead.period}`);
      leaderOutput.push(`   ${lead.description}`);
      leaderOutput.push("");
    });

    return leaderOutput;
  },

  resume: () => {
    // Open resume in new tab
    window.open(personalData.resume.url, "_blank");

    return [
      "📄 Resume",
      "",
      "✅ Opening resume in a new tab...",
      "",
      `Direct link: ${personalData.resume.url}`,
      `Last updated: ${personalData.resume.lastUpdated}`,
      "",
      "You can also find my complete resume on LinkedIn:",
      personalData.social.linkedin,
    ];
  },
};
