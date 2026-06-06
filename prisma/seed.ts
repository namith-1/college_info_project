import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.loadEnvFile?.();
}

const prisma = new PrismaClient();

const CollegeType = {
  ENGINEERING: "ENGINEERING",
  MANAGEMENT: "MANAGEMENT",
  MEDICAL: "MEDICAL",
  UNIVERSITY: "UNIVERSITY"
} as const;

const Ownership = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  DEEMED: "DEEMED"
} as const;

const exams = [
  { name: "JEE Main", code: "JEE_MAIN" },
  { name: "JEE Advanced", code: "JEE_ADVANCED" },
  { name: "CAT", code: "CAT" },
  { name: "NEET UG", code: "NEET_UG" }
];

const colleges = [
  {
    name: "National Institute of Technology Tiruchirappalli",
    slug: "nit-tiruchirappalli",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: CollegeType.ENGINEERING,
    ownership: Ownership.PUBLIC,
    rating: 4.7,
    reviewCount: 428,
    feesMin: 145000,
    feesMax: 625000,
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop",
    overview: "A nationally ranked public technical institute known for strong engineering programs, research output, and high placement outcomes.",
    placement: { averagePackage: 16.2, highestPackage: 52, placementRate: 94, topRecruiters: ["Google", "Microsoft", "L&T", "Tata Steel"] },
    courses: [
      ["Computer Science and Engineering", "B.Tech", "4 years", 625000, 120],
      ["Electronics and Communication Engineering", "B.Tech", "4 years", 610000, 115],
      ["Structural Engineering", "M.Tech", "2 years", 210000, 36]
    ],
    cutoffs: [
      ["JEE_MAIN", "Computer Science and Engineering", 750, 5200],
      ["JEE_MAIN", "Electronics and Communication Engineering", 5201, 9800]
    ]
  },
  {
    name: "Indian Institute of Technology Bombay",
    slug: "iit-bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: CollegeType.ENGINEERING,
    ownership: Ownership.PUBLIC,
    rating: 4.9,
    reviewCount: 612,
    feesMin: 210000,
    feesMax: 840000,
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop",
    overview: "A premier technology institute with deep research culture, selective admissions, and exceptional entrepreneurship and placement networks.",
    placement: { averagePackage: 23.5, highestPackage: 78, placementRate: 96, topRecruiters: ["Apple", "Jane Street", "Google", "McKinsey"] },
    courses: [
      ["Computer Science and Engineering", "B.Tech", "4 years", 840000, 110],
      ["Electrical Engineering", "B.Tech", "4 years", 835000, 100],
      ["Industrial Design", "M.Des", "2 years", 280000, 30]
    ],
    cutoffs: [
      ["JEE_ADVANCED", "Computer Science and Engineering", 1, 75],
      ["JEE_ADVANCED", "Electrical Engineering", 76, 520]
    ]
  },
  {
    name: "Delhi Technological University",
    slug: "delhi-technological-university",
    city: "New Delhi",
    state: "Delhi",
    type: CollegeType.ENGINEERING,
    ownership: Ownership.PUBLIC,
    rating: 4.5,
    reviewCount: 389,
    feesMin: 180000,
    feesMax: 760000,
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop",
    overview: "A leading state technical university with industry-facing engineering courses and strong access to NCR recruiters.",
    placement: { averagePackage: 14.8, highestPackage: 45, placementRate: 91, topRecruiters: ["Amazon", "Adobe", "Maruti Suzuki", "ZS"] },
    courses: [
      ["Software Engineering", "B.Tech", "4 years", 760000, 150],
      ["Mechanical Engineering", "B.Tech", "4 years", 720000, 120],
      ["Data Science", "M.Tech", "2 years", 260000, 40]
    ],
    cutoffs: [
      ["JEE_MAIN", "Software Engineering", 3500, 14500],
      ["JEE_MAIN", "Mechanical Engineering", 14501, 42000]
    ]
  },
  {
    name: "Vellore Institute of Technology",
    slug: "vellore-institute-of-technology",
    city: "Vellore",
    state: "Tamil Nadu",
    type: CollegeType.UNIVERSITY,
    ownership: Ownership.PRIVATE,
    rating: 4.3,
    reviewCount: 735,
    feesMin: 195000,
    feesMax: 780000,
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
    overview: "A large private university with broad program choice, international collaborations, and a centralized placement ecosystem.",
    placement: { averagePackage: 9.6, highestPackage: 44, placementRate: 89, topRecruiters: ["TCS", "Infosys", "PayPal", "Deloitte"] },
    courses: [
      ["Computer Science and Engineering", "B.Tech", "4 years", 780000, 600],
      ["Biotechnology", "B.Tech", "4 years", 690000, 80],
      ["Business Analytics", "MBA", "2 years", 720000, 90]
    ],
    cutoffs: [
      ["JEE_MAIN", "Computer Science and Engineering", 12000, 62000],
      ["CAT", "Business Analytics", 1, 45000]
    ]
  },
  {
    name: "Indian Institute of Management Ahmedabad",
    slug: "iim-ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    type: CollegeType.MANAGEMENT,
    ownership: Ownership.PUBLIC,
    rating: 4.9,
    reviewCount: 504,
    feesMin: 2500000,
    feesMax: 3200000,
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=1200&auto=format&fit=crop",
    overview: "India's most selective management school, known for case pedagogy, leadership outcomes, and global alumni network.",
    placement: { averagePackage: 34.4, highestPackage: 115, placementRate: 100, topRecruiters: ["BCG", "Bain", "Goldman Sachs", "HUL"] },
    courses: [
      ["Post Graduate Programme in Management", "MBA", "2 years", 3200000, 400],
      ["Food and Agribusiness Management", "MBA", "2 years", 2500000, 46]
    ],
    cutoffs: [
      ["CAT", "Post Graduate Programme in Management", 1, 900],
      ["CAT", "Food and Agribusiness Management", 901, 4500]
    ]
  },
  {
    name: "Manipal Institute of Technology",
    slug: "manipal-institute-of-technology",
    city: "Manipal",
    state: "Karnataka",
    type: CollegeType.ENGINEERING,
    ownership: Ownership.PRIVATE,
    rating: 4.2,
    reviewCount: 512,
    feesMin: 335000,
    feesMax: 1670000,
    imageUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?q=80&w=1200&auto=format&fit=crop",
    overview: "A well-known private engineering institute with flexible academics, modern labs, and active student communities.",
    placement: { averagePackage: 8.9, highestPackage: 38, placementRate: 86, topRecruiters: ["Microsoft", "Dell", "Accenture", "Bosch"] },
    courses: [
      ["Computer Science and Engineering", "B.Tech", "4 years", 1670000, 240],
      ["Information Technology", "B.Tech", "4 years", 1550000, 180],
      ["Robotics and Automation", "M.Tech", "2 years", 335000, 30]
    ],
    cutoffs: [
      ["JEE_MAIN", "Computer Science and Engineering", 25000, 85000],
      ["JEE_MAIN", "Information Technology", 85001, 115000]
    ]
  },
  {
    name: "Christian Medical College Vellore",
    slug: "christian-medical-college-vellore",
    city: "Vellore",
    state: "Tamil Nadu",
    type: CollegeType.MEDICAL,
    ownership: Ownership.PRIVATE,
    rating: 4.8,
    reviewCount: 318,
    feesMin: 52000,
    feesMax: 240000,
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop",
    overview: "A highly respected medical college and hospital with rigorous clinical training and a strong public health mission.",
    placement: { averagePackage: 10.5, highestPackage: 28, placementRate: 98, topRecruiters: ["CMC Hospital", "Apollo", "Fortis", "AIIMS"] },
    courses: [
      ["Medicine and Surgery", "MBBS", "5.5 years", 240000, 100],
      ["Nursing", "B.Sc", "4 years", 52000, 75]
    ],
    cutoffs: [
      ["NEET_UG", "Medicine and Surgery", 1, 950],
      ["NEET_UG", "Nursing", 951, 22000]
    ]
  },
  {
    name: "SRM Institute of Science and Technology",
    slug: "srm-institute-of-science-and-technology",
    city: "Chennai",
    state: "Tamil Nadu",
    type: CollegeType.UNIVERSITY,
    ownership: Ownership.DEEMED,
    rating: 4.0,
    reviewCount: 690,
    feesMin: 250000,
    feesMax: 1400000,
    imageUrl: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=1200&auto=format&fit=crop",
    overview: "A multidisciplinary private university with high course variety, strong campus facilities, and broad recruiter participation.",
    placement: { averagePackage: 7.4, highestPackage: 32, placementRate: 82, topRecruiters: ["Wipro", "Cognizant", "IBM", "Capgemini"] },
    courses: [
      ["Computer Science and Engineering", "B.Tech", "4 years", 1400000, 480],
      ["Artificial Intelligence", "B.Tech", "4 years", 1320000, 180],
      ["Marketing", "MBA", "2 years", 760000, 120]
    ],
    cutoffs: [
      ["JEE_MAIN", "Artificial Intelligence", 55000, 150000],
      ["CAT", "Marketing", 12000, 90000]
    ]
  }
];

async function main() {
  await prisma.collegeExamCutoff.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.college.deleteMany();

  const examRecords = new Map<string, string>();
  for (const exam of exams) {
    const record = await prisma.exam.create({ data: exam });
    examRecords.set(exam.code, record.id);
  }

  for (const college of colleges) {
    const created = await prisma.college.create({
      data: {
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        type: college.type,
        ownership: college.ownership,
        overview: college.overview,
        rating: college.rating,
        reviewCount: college.reviewCount,
        feesMin: college.feesMin,
        feesMax: college.feesMax,
        imageUrl: college.imageUrl,
        placement: { create: college.placement },
        courses: {
          create: college.courses.map(([name, degree, duration, fees, seats]) => ({
            name: String(name),
            degree: String(degree),
            duration: String(duration),
            fees: Number(fees),
            seats: Number(seats)
          }))
        },
        reviews: {
          create: [
            {
              authorName: "Aarav Mehta",
              rating: Math.min(5, college.rating + 0.1),
              title: "Strong academics and peer group",
              body: "The curriculum is demanding but the faculty and student community make the experience rewarding."
            },
            {
              authorName: "Nisha Rao",
              rating: Math.max(3.5, college.rating - 0.2),
              title: "Good placement support",
              body: "The placement cell is active and transparent. Course workload can be heavy during project season."
            }
          ]
        }
      }
    });

    for (const [examCode, courseName, minRank, maxRank] of college.cutoffs) {
      const examId = examRecords.get(String(examCode));
      if (!examId) continue;
      await prisma.collegeExamCutoff.create({
        data: {
          collegeId: created.id,
          examId,
          courseName: String(courseName),
          minRank: Number(minRank),
          maxRank: Number(maxRank),
          category: "General"
        }
      });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
