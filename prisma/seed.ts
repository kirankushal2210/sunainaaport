import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { PROJECTS } from '../src/data/projects';

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.contactMessage.deleteMany();

  const projects = PROJECTS;

  // Insert in reverse so the newest created_at matches the first item in the list (page sorts by created_at desc)
  for (const p of [...projects].reverse()) {
    await prisma.project.create({ data: p });
  }

  // Seed Experience
  const experiences = [
    {
      company: 'NarrativeX Media',
      role: 'Graphic Designer',
      duration: 'January 2026 - Present',
      description: ['Led design/development of branding, social, print, and digital creatives.', 'Collaborated with cross-functional teams.']
    },
    {
      company: 'Wittelsbach',
      role: 'Graphic Designer',
      duration: 'July 2024 - January 2026',
      description: ['Created social creatives, print materials, digital marketing assets.', 'Assisted brand identity development.']
    },
    {
      company: 'MayaBazar Loft',
      role: 'Album & Graphic Designer',
      duration: 'January - March 2024',
      description: ['Designed wedding album layouts focusing on composition and storytelling.']
    },
    {
      company: 'Exsconicc',
      role: 'Graphic Design & Social Media Intern',
      duration: 'May - Oct 2023',
      description: ['Designed social media creatives and assisted in managing presence.']
    },
    {
      company: 'Freelance',
      role: 'Graphic Designer, Packaging Designs, Flyers',
      duration: 'Ongoing',
      description: ['Designed packaging layouts, flyers, banners, and backdrops.']
    }
  ];

  for (const e of experiences) {
    await prisma.experience.create({ data: e });
  }

  console.log(`Database seeded successfully with ${projects.length} projects!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
