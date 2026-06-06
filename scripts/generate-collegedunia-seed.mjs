import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "data");
const outFile = path.join(outDir, "collegedunia-colleges-100.json");

const images = [
  "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop"
];

const engineering = [
  ["IIT Bombay", "Mumbai", "Maharashtra", "PUBLIC"],
  ["IIT Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["IIT Madras", "Chennai", "Tamil Nadu", "PUBLIC"],
  ["IIT Kanpur", "Kanpur", "Uttar Pradesh", "PUBLIC"],
  ["IIT Kharagpur", "Kharagpur", "West Bengal", "PUBLIC"],
  ["IIT Roorkee", "Roorkee", "Uttarakhand", "PUBLIC"],
  ["IIT Guwahati", "Guwahati", "Assam", "PUBLIC"],
  ["BITS Pilani", "Pilani", "Rajasthan", "PRIVATE"],
  ["IIT Hyderabad", "Hyderabad", "Telangana", "PUBLIC"],
  ["IIT BHU Varanasi", "Varanasi", "Uttar Pradesh", "PUBLIC"],
  ["NIT Tiruchirappalli", "Tiruchirappalli", "Tamil Nadu", "PUBLIC"],
  ["NIT Surathkal", "Surathkal", "Karnataka", "PUBLIC"],
  ["NIT Warangal", "Warangal", "Telangana", "PUBLIC"],
  ["IIIT Bangalore", "Bangalore", "Karnataka", "PRIVATE"],
  ["Delhi Technological University", "New Delhi", "Delhi", "PUBLIC"],
  ["NSUT New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["RV College of Engineering", "Bangalore", "Karnataka", "PRIVATE"],
  ["VIT Vellore", "Vellore", "Tamil Nadu", "PRIVATE"],
  ["Manipal Institute of Technology", "Manipal", "Karnataka", "PRIVATE"],
  ["SRM Institute of Science and Technology", "Chennai", "Tamil Nadu", "DEEMED"],
  ["Amity University", "Noida", "Uttar Pradesh", "PRIVATE"],
  ["Jain University", "Bangalore", "Karnataka", "DEEMED"],
  ["New Horizon College of Engineering", "Bangalore", "Karnataka", "PRIVATE"],
  ["Tolani Maritime Institute", "Pune", "Maharashtra", "PRIVATE"],
  ["Yenepoya University", "Mangalore", "Karnataka", "DEEMED"],
  ["IIT Mandi", "Mandi", "Himachal Pradesh", "PUBLIC"],
  ["IIT Jodhpur", "Jodhpur", "Rajasthan", "PUBLIC"],
  ["IIT Bhubaneswar", "Bhubaneswar", "Odisha", "PUBLIC"],
  ["IIT Patna", "Patna", "Bihar", "PUBLIC"],
  ["IIT Gandhinagar", "Gandhinagar", "Gujarat", "PUBLIC"],
  ["IIT Indore", "Indore", "Madhya Pradesh", "PUBLIC"],
  ["IIIT Allahabad", "Prayagraj", "Uttar Pradesh", "PUBLIC"],
  ["Thapar Institute of Engineering and Technology", "Patiala", "Punjab", "PRIVATE"],
  ["College of Engineering Pune", "Pune", "Maharashtra", "PUBLIC"],
  ["Jadavpur University", "Kolkata", "West Bengal", "PUBLIC"],
  ["Anna University", "Chennai", "Tamil Nadu", "PUBLIC"],
  ["PSG College of Technology", "Coimbatore", "Tamil Nadu", "PRIVATE"],
  ["Sardar Vallabhbhai National Institute of Technology", "Surat", "Gujarat", "PUBLIC"],
  ["Motilal Nehru National Institute of Technology", "Prayagraj", "Uttar Pradesh", "PUBLIC"],
  ["Birla Institute of Technology Mesra", "Ranchi", "Jharkhand", "PRIVATE"]
];

const management = [
  ["IIM Ahmedabad", "Ahmedabad", "Gujarat", "PUBLIC"],
  ["IIM Bangalore", "Bangalore", "Karnataka", "PUBLIC"],
  ["IIM Calcutta", "Kolkata", "West Bengal", "PUBLIC"],
  ["Indian School of Business", "Mohali", "Punjab", "PRIVATE"],
  ["IIM Lucknow", "Lucknow", "Uttar Pradesh", "PUBLIC"],
  ["IIM Kozhikode", "Kozhikode", "Kerala", "PUBLIC"],
  ["SPJIMR Mumbai", "Mumbai", "Maharashtra", "PRIVATE"],
  ["IIM Mumbai", "Mumbai", "Maharashtra", "PUBLIC"],
  ["TISS Mumbai", "Mumbai", "Maharashtra", "PUBLIC"],
  ["IIM Indore", "Indore", "Madhya Pradesh", "PUBLIC"],
  ["MDI Gurgaon", "Gurgaon", "Haryana", "PRIVATE"],
  ["IIFT Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["JBIMS Mumbai", "Mumbai", "Maharashtra", "PUBLIC"],
  ["NMIMS Mumbai", "Mumbai", "Maharashtra", "DEEMED"],
  ["FMS Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["XLRI Jamshedpur", "Jamshedpur", "Jharkhand", "PRIVATE"],
  ["SDA Bocconi Asia Center", "Mumbai", "Maharashtra", "PRIVATE"],
  ["Woxsen University", "Hyderabad", "Telangana", "PRIVATE"],
  ["GIBS Business School", "Bangalore", "Karnataka", "PRIVATE"],
  ["NSB Bangalore", "Bangalore", "Karnataka", "PRIVATE"],
  ["Parul University", "Vadodara", "Gujarat", "PRIVATE"],
  ["New Horizon College of Engineering MBA", "Bangalore", "Karnataka", "PRIVATE"],
  ["Jamia Millia Islamia", "New Delhi", "Delhi", "PUBLIC"],
  ["Lovely Professional University", "Jalandhar", "Punjab", "PRIVATE"],
  ["Chitkara University", "Chandigarh", "Chandigarh", "PRIVATE"],
  ["Taxila Business School", "Jaipur", "Rajasthan", "PRIVATE"],
  ["Great Lakes Institute of Management", "Chennai", "Tamil Nadu", "PRIVATE"],
  ["IMT Ghaziabad", "Ghaziabad", "Uttar Pradesh", "PRIVATE"],
  ["XIM University", "Bhubaneswar", "Odisha", "PRIVATE"],
  ["SIBM Pune", "Pune", "Maharashtra", "DEEMED"],
  ["TAPMI Manipal", "Manipal", "Karnataka", "PRIVATE"],
  ["FORE School of Management", "New Delhi", "Delhi", "PRIVATE"],
  ["K J Somaiya Institute of Management", "Mumbai", "Maharashtra", "PRIVATE"],
  ["BIMTECH Greater Noida", "Greater Noida", "Uttar Pradesh", "PRIVATE"],
  ["Christ University", "Bangalore", "Karnataka", "DEEMED"]
];

const medical = [
  ["AIIMS New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["VMMC New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["CMC Vellore", "Vellore", "Tamil Nadu", "PRIVATE"],
  ["MAMC New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["ABVIMS New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["JIPMER Puducherry", "Puducherry", "Puducherry", "PUBLIC"],
  ["AIIMS Jodhpur", "Jodhpur", "Rajasthan", "PUBLIC"],
  ["UCMS New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["AIIMS Bhopal", "Bhopal", "Madhya Pradesh", "PUBLIC"],
  ["AIIMS Bhubaneswar", "Bhubaneswar", "Odisha", "PUBLIC"],
  ["BJMC Ahmedabad", "Ahmedabad", "Gujarat", "PUBLIC"],
  ["AIIMS Rishikesh", "Rishikesh", "Uttarakhand", "PUBLIC"],
  ["DPU Pune", "Pune", "Maharashtra", "DEEMED"],
  ["GMCH Chandigarh", "Chandigarh", "Chandigarh", "PUBLIC"],
  ["SIMATS Chennai", "Chennai", "Tamil Nadu", "DEEMED"],
  ["LHMC New Delhi", "New Delhi", "Delhi", "PUBLIC"],
  ["GMC Kozhikode", "Kozhikode", "Kerala", "PUBLIC"],
  ["MMC Chennai", "Chennai", "Tamil Nadu", "PUBLIC"],
  ["CMC Ludhiana", "Ludhiana", "Punjab", "PRIVATE"],
  ["PGIMER Chandigarh", "Chandigarh", "Chandigarh", "PUBLIC"],
  ["Kasturba Medical College Manipal", "Manipal", "Karnataka", "PRIVATE"],
  ["St Johns Medical College", "Bangalore", "Karnataka", "PRIVATE"],
  ["Seth GS Medical College", "Mumbai", "Maharashtra", "PUBLIC"],
  ["Grant Medical College", "Mumbai", "Maharashtra", "PUBLIC"],
  ["Osmania Medical College", "Hyderabad", "Telangana", "PUBLIC"]
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rupeesLakh(lakh) {
  return Math.round(lakh * 100000);
}

function buildCollege([name, city, state, ownership], index, kind) {
  const publicCollege = ownership === "PUBLIC";
  const rank = index + 1;
  const rating = Number((4.75 - Math.min(rank, 80) * 0.01 + (publicCollege ? 0.05 : 0)).toFixed(1));
  const reviewCount = 80 + rank * 37;
  const sourceUrl =
    kind === "ENGINEERING"
      ? "https://collegedunia.com/engineering-colleges"
      : kind === "MANAGEMENT"
        ? "https://collegedunia.com/top-mba-colleges-in-india"
        : "https://collegedunia.com/medical-colleges";

  const feesLakh =
    kind === "ENGINEERING"
      ? publicCollege ? 6 + rank * 0.22 : 8 + rank * 0.55
      : kind === "MANAGEMENT"
        ? publicCollege ? 2 + rank * 0.85 : 6 + rank * 0.7
        : publicCollege ? 0.05 + rank * 0.08 : 2 + rank * 1.35;

  const avgPackage =
    kind === "ENGINEERING"
      ? Math.max(4.5, 25 - rank * 0.35)
      : kind === "MANAGEMENT"
        ? Math.max(5.5, 35 - rank * 0.48)
        : Math.max(5, 14 - rank * 0.18);

  const highestPackage =
    kind === "ENGINEERING"
      ? avgPackage * (rank < 12 ? 4.2 : 3.1)
      : kind === "MANAGEMENT"
        ? avgPackage * (rank < 16 ? 3.2 : 2.4)
        : avgPackage * 2.2;

  const course =
    kind === "ENGINEERING"
      ? ["Computer Science and Engineering", "B.Tech", "4 years", 120]
      : kind === "MANAGEMENT"
        ? ["Master of Business Administration", "MBA", "2 years", 180]
        : ["Medicine and Surgery", "MBBS", "5.5 years", 150];

  const examCode = kind === "ENGINEERING" ? (name.startsWith("IIT") ? "JEE_ADVANCED" : "JEE_MAIN") : kind === "MANAGEMENT" ? "CAT" : "NEET_UG";
  const examName = kind === "ENGINEERING" ? (examCode === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main") : kind === "MANAGEMENT" ? "CAT" : "NEET UG";
  const cutoffStart = kind === "MEDICAL" ? rank * 60 : kind === "MANAGEMENT" ? rank * 350 : rank * 500;
  const cutoffEnd = cutoffStart + (kind === "MEDICAL" ? 1200 : kind === "MANAGEMENT" ? 6000 : 9000);

  return {
    name,
    slug: slugify(name),
    city,
    state,
    type: kind === "MEDICAL" ? "MEDICAL" : kind,
    ownership,
    overview: `${name} is a ${ownership.toLowerCase()} ${kind.toLowerCase()} institution in ${city}, ${state}. This seed record is structured for discovery, comparison, and predictor workflows.`,
    rating: Math.max(3.7, Math.min(4.9, rating)),
    reviewCount,
    feesMin: rupeesLakh(Math.max(0.05, feesLakh * 0.82)),
    feesMax: rupeesLakh(feesLakh),
    imageUrl: images[index % images.length],
    sourceUrl,
    placement: {
      averagePackage: Number(avgPackage.toFixed(1)),
      highestPackage: Number(highestPackage.toFixed(1)),
      placementRate: Math.max(72, 98 - Math.floor(rank * 0.35)),
      topRecruiters:
        kind === "MEDICAL"
          ? ["Apollo", "Fortis", "AIIMS", "Manipal Hospitals"]
          : kind === "MANAGEMENT"
            ? ["BCG", "Deloitte", "HDFC Bank", "Amazon"]
            : ["Google", "Microsoft", "TCS", "Infosys"]
    },
    courses: [
      {
        name: course[0],
        degree: course[1],
        duration: course[2],
        fees: rupeesLakh(feesLakh),
        seats: course[3]
      },
      {
        name: kind === "ENGINEERING" ? "Electronics and Communication Engineering" : kind === "MANAGEMENT" ? "Business Analytics" : "Nursing",
        degree: kind === "ENGINEERING" ? "B.Tech" : kind === "MANAGEMENT" ? "MBA" : "B.Sc",
        duration: kind === "MEDICAL" ? "4 years" : course[2],
        fees: rupeesLakh(feesLakh * 0.92),
        seats: Math.round(course[3] * 0.7)
      }
    ],
    reviews: [
      {
        authorName: "Verified Student",
        rating: Math.max(3.5, Math.min(5, rating)),
        title: "Useful academic and career exposure",
        body: "Students highlight academics, campus facilities, and career support as major decision factors."
      }
    ],
    cutoffs: [
      {
        examCode,
        examName,
        courseName: course[0],
        minRank: cutoffStart,
        maxRank: cutoffEnd,
        category: "General"
      }
    ]
  };
}

const records = [
  ...engineering.map((item, index) => buildCollege(item, index, "ENGINEERING")),
  ...management.map((item, index) => buildCollege(item, index, "MANAGEMENT")),
  ...medical.map((item, index) => buildCollege(item, index, "MEDICAL"))
];

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(records, null, 2));
console.log(`Wrote ${records.length} colleges to ${outFile}`);
