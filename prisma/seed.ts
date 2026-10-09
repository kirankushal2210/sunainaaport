import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.contactMessage.deleteMany();

  const projects = [
    {
      title: 'Future Kids - Scholarship Poster',
      category: 'Print',
      client: 'Future Kids',
      year: '2025',
      posterAsset: '/projects/fk-scholarship.jpg',
      aspectRatio: 'vertical',
      metrics: ['10k+ Impressions', '+25% Signups'],
      content: 'Promotional poster for 100% scholarship and aptitude test, highlighting academic excellence.',
    },
    {
      title: 'Future Kids - Admissions Open',
      category: 'Social Media',
      client: 'Future Kids',
      year: '2025',
      posterAsset: '/projects/fk-admissions.jpg',
      aspectRatio: 'vertical',
      metrics: ['+140% Engagement'],
      content: 'Creative typography-led admissions open graphic with a welcoming campus environment.',
    },
    {
      title: 'Future Kids - Sankranthi Banner',
      category: 'Print',
      client: 'Future Kids',
      year: '2025',
      posterAsset: '/projects/fk-sankranthi.jpg',
      aspectRatio: 'horizontal',
      metrics: ['Event Highlight'],
      content: 'Festive backdrop banner for Sankranthi celebrations featuring cultural elements.',
    },
    {
      title: 'Future Kids - Notebook Designs',
      category: 'Print',
      client: 'Future Kids',
      year: '2024',
      posterAsset: '/projects/fk-notebooks.jpg',
      aspectRatio: 'vertical',
      metrics: ['5000+ Prints'],
      content: 'Custom notebook cover designs featuring space and academic themes for students.',
    },
    {
      title: 'The Park Arabian Mandi',
      category: 'Branding',
      client: 'The Park',
      year: '2025',
      posterAsset: '/projects/park-mandi-card.jpg',
      aspectRatio: 'horizontal',
      metrics: ['Brand Identity Established'],
      content: 'Premium business card design with gold foil accents and elegant typography.',
    },

    {
      title: 'Janmashtami Special',
      category: 'Social Media',
      client: 'Retail Client',
      year: '2024',
      posterAsset: '/projects/janmashtami.jpg',
      aspectRatio: 'square',
      metrics: ['Festive Viral Reach'],
      content: 'Festive social media post celebrating Janmashtami with custom illustrations.',
    },
    {
      title: 'Artisan Coffee Promo',
      category: 'Branding',
      client: 'Artisan Coffee',
      year: '2024',
      posterAsset: '/projects/coffee-promo.jpg',
      aspectRatio: 'vertical',
      metrics: ['Conversion +15%'],
      content: 'Minimalist, earth-toned promotional asset for a coffee shop.',
    },
    {
      title: 'Wittelsbach - Branding Impact',
      category: 'Social Media',
      client: 'Wittelsbach',
      year: '2025',
      posterAsset: '/projects/branding-impact.jpg',
      aspectRatio: 'square',
      metrics: ['High CTR'],
      content: 'Informative social media carousel/infographic explaining the impact of branding.',
    },
    {
      title: 'Wittelsbach - Content Strategy',
      category: 'Social Media',
      client: 'Wittelsbach',
      year: '2025',
      posterAsset: '/projects/content-strategy.jpg',
      aspectRatio: 'vertical',
      metrics: ['Lead Gen Asset'],
      content: 'Bold, visually striking promotional graphic for content strategy services.',
    },
    {
      title: 'Palm Vistara x Daawat - Grand Opening',
      category: 'Print',
      client: 'Palm Vistara',
      year: '2024',
      posterAsset: '/projects/grand-opening.jpg',
      aspectRatio: 'vertical',
      metrics: ['Community Event'],
      content: 'Elegant grand opening poster for a restaurant collaboration.',
    },
    {
      title: 'Nag\'s Kitchen - Moving Announcement',
      category: 'Social Media',
      client: 'Nag\'s Kitchen',
      year: '2025',
      posterAsset: '/projects/nags-moving.jpg',
      aspectRatio: 'square',
      metrics: ['Customer Retention'],
      content: 'Vibrant moving announcement social media post with location details.',
    },
    {
      title: 'Gal Punjabi Dhaba - Menu Design',
      category: 'Print',
      client: 'Gal Punjabi Dhaba',
      year: '2025',
      posterAsset: '/projects/punjabi-menu.jpg',
      aspectRatio: 'vertical',
      metrics: ['Dine-in Utility'],
      content: 'Traditional and extensive dine-in menu design for a Punjabi restaurant.',
    },
    {
      title: 'The Park Arabian Mandi - Packaging',
      category: 'Packaging',
      client: 'The Park',
      year: '2025',
      posterAsset: '/projects/mandi-bottle.jpg',
      aspectRatio: 'vertical',
      metrics: ['Custom FMCG'],
      content: 'Custom water bottle label packaging design with premium forest/animal elements.',
    },
    {
      title: 'Bagara - Friendship Day',
      category: 'Social Media',
      client: 'Bagara',
      year: '2024',
      posterAsset: '/projects/bagara-friendship.jpg',
      aspectRatio: 'square',
      metrics: ['+200% Shares'],
      content: 'Creative and playful social media post for Friendship Day featuring food illustrations.',
    },

    {
      title: 'Minus - Friendship Day',
      category: 'Social Media',
      client: 'Minus',
      year: '2024',
      posterAsset: '/projects/minus-friendship.jpg',
      aspectRatio: 'square',
      metrics: ['Engagement Boost'],
      content: 'Clever social media creative for a weight loss brand celebrating Friendship Day.',
    },
    {
      title: 'MAMS Hospitals - Awareness Day',
      category: 'Print',
      client: 'MAMS Hospitals',
      year: '2024',
      posterAsset: '/projects/mams-awareness.jpg',
      aspectRatio: 'vertical',
      metrics: ['Healthcare Campaign'],
      content: 'Clean, informative poster for Chronic Disease Awareness Day.',
    },
    {
      title: 'Dr. Shashank - YouTube Thumbnail',
      category: 'Social Media',
      client: 'Dr. Shashank',
      year: '2025',
      posterAsset: '/projects/shashank-thumbnail.jpg',
      aspectRatio: 'horizontal',
      metrics: ['+12% CTR'],
      content: 'Engaging, high-contrast YouTube thumbnail design for a medical channel.',
    },
    {
      title: 'Bandi Babu - Brand Logo',
      category: 'Branding',
      client: 'Bandi Babu',
      year: '2024',
      posterAsset: '/projects/bandi-babu-logo.jpg',
      aspectRatio: 'square',
      metrics: ['Identity Relaunch'],
      content: 'Character-driven logo design for a traditional food brand featuring custom Telugu typography.',
    },
    {
      title: 'Chai & Chutneys - Logo Identity',
      category: 'Branding',
      client: 'Chai & Chutneys',
      year: '2025',
      posterAsset: '/projects/chai-chutneys-logo.jpg',
      aspectRatio: 'square',
      metrics: ['Modern Identity'],
      content: 'Playful, modern typography logo mockup for a cafe, featuring integrated iconography.',
    },
    {
      title: 'Mastaru Gari Military Hotel - Signage',
      category: 'Branding',
      client: 'Mastaru Gari Military Hotel',
      year: '2025',
      posterAsset: '/projects/mastaru-gari-logo.jpg',
      aspectRatio: 'horizontal',
      metrics: ['Brand Identity'],
      content: 'Rustic, vintage-inspired logo and signage mockup for a traditional military hotel.',
    },
    {
      title: 'ABNA Group - Real Estate Investment',
      category: 'Social Media',
      client: 'ABNA Group',
      year: '2025',
      posterAsset: '/projects/abna-invest.jpg',
      aspectRatio: 'vertical',
      metrics: ['Lead Generation'],
      content: 'Informational social media post detailing 5 reasons to invest in real estate.',
    },
    {
      title: 'ABNA Group - Shadnagar Campaign',
      category: 'Social Media',
      client: 'ABNA Group',
      year: '2025',
      posterAsset: '/projects/abna-shadnagar.jpg',
      aspectRatio: 'vertical',
      metrics: ['+35% Inquiries'],
      content: 'Creative capsule concept for real estate investment in Shadnagar.',
    },
    {
      title: 'Neemsboro Group - Luxury Apartments',
      category: 'Print',
      client: 'Neemsboro Group',
      year: '2025',
      posterAsset: '/projects/neemsboro-billboard.jpg',
      aspectRatio: 'horizontal',
      metrics: ['OOH Billboard'],
      content: 'Bus stop billboard mockup for 2 and 3 BHK luxury apartments.',
    }
  ];

  for (const p of projects) {
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

  console.log('Database seeded successfully with all 10 projects!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
