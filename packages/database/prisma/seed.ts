import { PrismaClient, UserRole, ProjectStatus, ProductStatus, LicenseType } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Step 1: Create Categories
  console.log('📁 Creating categories...');
  const categories = [
    { name: 'Web Design', slug: 'web-design', description: 'UI/UX and web design projects', icon: '🎨', color: '#3B82F6' },
    { name: 'Branding', slug: 'branding', description: 'Logo and brand identity work', icon: '🎯', color: '#8B5CF6' },
    { name: 'Development', slug: 'development', description: 'Software development projects', icon: '💻', color: '#10B981' },
    { name: 'Social Media', slug: 'social-media', description: 'Social media content and marketing', icon: '📱', color: '#EC4899' },
    { name: 'Photography', slug: 'photography', description: 'Professional photography services', icon: '📸', color: '#F59E0B' },
    { name: 'Video Editing', slug: 'video-editing', description: 'Video production and editing', icon: '🎬', color: '#EF4444' },
    { name: '3D Design', slug: '3d-design', description: '3D modeling and animation', icon: '🎭', color: '#06B6D4' },
    { name: 'Writing', slug: 'writing', description: 'Content writing and copywriting', icon: '✍️', color: '#84CC16' },
    { name: 'Marketing', slug: 'marketing', description: 'Digital marketing and strategy', icon: '📊', color: '#F97316' }
  ];

  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      return prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    })
  );
  console.log(`✅ Created ${createdCategories.length} categories\n`);

  // Step 2: Create Creator Users with Profiles
  console.log('👤 Creating creators...');
  const creatorsData = [
    {
      email: 'sarah.chen@example.com',
      username: 'sarah_designs',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning UI/UX Designer with 8+ years of experience creating beautiful, user-centered digital experiences.',
      location: 'San Francisco, CA',
      website: 'https://sarahchen.design',
      role: UserRole.CREATOR,
      isVerified: true,
      emailVerified: new Date(),
      creatorProfile: {
        headline: 'Senior UI/UX Designer & Product Strategist',
        skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
        experience: '8 years',
        hourlyRate: 95,
        portfolioCount: 24,
        totalSales: 186,
        averageRating: 4.9,
        totalReviews: 98,
        isVerifiedCreator: true,
        badges: ['Top Rated', 'Fast Delivery', 'Expert Designer']
      }
    },
    {
      email: 'marcus.johnson@example.com',
      username: 'marcus_brand',
      name: 'Marcus Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Creative brand designer and motion graphics artist helping businesses build memorable visual identities.',
      location: 'New York, NY',
      website: 'https://marcusjohnson.studio',
      role: UserRole.CREATOR,
      isVerified: true,
      emailVerified: new Date(),
      creatorProfile: {
        headline: 'Brand Designer & Motion Graphics Artist',
        skills: ['After Effects', 'Illustrator', 'Photoshop', 'Cinema 4D', 'Branding'],
        experience: '6 years',
        hourlyRate: 85,
        portfolioCount: 32,
        totalSales: 214,
        averageRating: 4.8,
        totalReviews: 127,
        isVerifiedCreator: true,
        badges: ['Creative Excellence', 'Brand Expert', 'Top Rated']
      }
    },
    {
      email: 'alex.rivera@example.com',
      username: 'alex_dev',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack developer passionate about creating scalable web applications using modern technologies.',
      location: 'Austin, TX',
      website: 'https://alexrivera.dev',
      role: UserRole.CREATOR,
      isVerified: true,
      emailVerified: new Date(),
      creatorProfile: {
        headline: 'Full-Stack Web Developer',
        skills: ['React', 'Node.js', 'TypeScript', 'Next.js', 'PostgreSQL', 'AWS'],
        experience: '5 years',
        hourlyRate: 105,
        portfolioCount: 19,
        totalSales: 87,
        averageRating: 4.9,
        totalReviews: 56,
        isVerifiedCreator: true,
        badges: ['Code Quality', 'Fast Delivery', 'Reliable']
      }
    },
    {
      email: 'emma.thompson@example.com',
      username: 'emma_social',
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Social media marketing expert helping brands grow their online presence.',
      location: 'Los Angeles, CA',
      website: 'https://emmathompson.social',
      role: UserRole.CREATOR,
      isVerified: true,
      emailVerified: new Date(),
      creatorProfile: {
        headline: 'Social Media Marketing Specialist',
        skills: ['Instagram Marketing', 'Content Creation', 'Canva', 'TikTok', 'Analytics'],
        experience: '4 years',
        hourlyRate: 65,
        portfolioCount: 28,
        totalSales: 342,
        averageRating: 4.7,
        totalReviews: 189,
        isVerifiedCreator: true,
        badges: ['Marketing Pro', 'Fast Response']
      }
    }
  ];

  const createdCreators = [];
  for (const creatorData of creatorsData) {
    const { creatorProfile, ...userFields } = creatorData;
    const creator = await prisma.user.upsert({
      where: { email: creatorData.email },
      update: {},
      create: {
        ...userFields,
        creatorProfile: {
          create: creatorProfile
        }
      },
      include: { creatorProfile: true }
    });
    createdCreators.push(creator);
    console.log(`   ✓ ${creator.name}`);
  }
  console.log(`✅ Created ${createdCreators.length} creators\n`);

  // Step 3: Create Customer Users
  console.log('🛒 Creating customers...');
  const customersData = [
    {
      email: 'john.smith@example.com',
      username: 'john_buyer',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Entrepreneur looking for creative services to grow my business',
      location: 'Seattle, WA',
      role: UserRole.CUSTOMER,
      isVerified: true,
      emailVerified: new Date()
    },
    {
      email: 'lisa.wong@example.com',
      username: 'lisa_customer',
      name: 'Lisa Wong',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Marketing manager at a tech startup',
      location: 'Boston, MA',
      role: UserRole.CUSTOMER,
      isVerified: true,
      emailVerified: new Date()
    }
  ];

  const createdCustomers = [];
  for (const customerData of customersData) {
    const customer = await prisma.user.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData
    });
    createdCustomers.push(customer);
    console.log(`   ✓ ${customer.name}`);
  }
  console.log(`✅ Created ${createdCustomers.length} customers\n`);

  // Step 4: Create Projects
  console.log('🎨 Creating projects...');
  const projectsData = [
    {
      title: 'Modern E-Commerce Website Design',
      slug: 'modern-ecommerce-website-design',
      description: 'Complete UI/UX design for a luxury fashion e-commerce platform with mobile app mockups. Includes user research, wireframes, high-fidelity designs, and interactive prototypes.',
      content: `# Project Overview\n\nModern e-commerce website design featuring:\n- Clean, minimal aesthetic\n- Mobile-responsive layouts\n- Smooth checkout flow\n- Product filtering\n- Customer reviews`,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
      ],
      tags: ['Figma', 'Mobile Design', 'E-commerce', 'UI/UX', 'Prototype'],
      categorySlug: 'web-design',
      creatorEmail: 'sarah.chen@example.com',
      status: ProjectStatus.PUBLISHED,
      visibility: true,
      views: 1247,
      likes: 89
    },
    {
      title: 'Animated Logo & Brand Identity Package',
      slug: 'animated-logo-brand-identity',
      description: 'Complete brand package including animated logo, business cards, letterhead, and social media templates.',
      content: `# Brand Identity Package\n\nIncludes:\n- Logo design (4 variations)\n- Animated logo\n- Business card design\n- Letterhead\n- Social media templates\n- Brand guidelines PDF`,
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop'
      ],
      tags: ['After Effects', 'Illustrator', 'Branding', 'Logo Design', 'Animation'],
      categorySlug: 'branding',
      creatorEmail: 'marcus.johnson@example.com',
      status: ProjectStatus.PUBLISHED,
      visibility: true,
      views: 892,
      likes: 67
    },
    {
      title: 'React Admin Dashboard Template',
      slug: 'react-admin-dashboard-template',
      description: 'Full-featured admin dashboard built with React, TypeScript, and Tailwind CSS. Includes authentication, charts, and data tables.',
      content: `# Dashboard Features\n\n- User authentication\n- Real-time charts\n- Data tables with sorting/filtering\n- Responsive design\n- Dark mode support\n- API integration examples`,
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
      ],
      tags: ['React', 'TypeScript', 'Tailwind', 'Dashboard', 'Admin Panel'],
      categorySlug: 'development',
      creatorEmail: 'alex.rivera@example.com',
      status: ProjectStatus.PUBLISHED,
      visibility: true,
      views: 654,
      likes: 43
    },
    {
      title: 'Instagram Content Pack for Wellness Brands',
      slug: 'instagram-content-pack-wellness',
      description: '30 custom Instagram post templates and stories designed specifically for fitness and wellness brands.',
      content: `# Content Pack Includes\n\n- 30 Instagram post templates\n- 15 Story templates\n- Canva editable files\n- Font & color guide\n- Usage instructions`,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop'
      ],
      tags: ['Instagram', 'Social Media', 'Canva', 'Marketing', 'Content'],
      categorySlug: 'social-media',
      creatorEmail: 'emma.thompson@example.com',
      status: ProjectStatus.PUBLISHED,
      visibility: true,
      views: 2134,
      likes: 234
    }
  ];

  const createdProjects = [];
  for (const projectData of projectsData) {
    const category = createdCategories.find(c => c.slug === projectData.categorySlug);
    const creator = createdCreators.find(c => c.email === projectData.creatorEmail);
    
    if (!category || !creator) continue;

    const { categorySlug, creatorEmail, ...projectFields } = projectData;
    
    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: {
        ...projectFields,
        categoryId: category.id,
        ownerId: creator.id
      }
    });
    createdProjects.push(project);
    console.log(`   ✓ ${project.title}`);
  }
  console.log(`✅ Created ${createdProjects.length} projects\n`);

  // Step 5: Create Products (Services for Sale)
  console.log('💼 Creating products...');
  const productsData = [
    {
      projectSlug: 'modern-ecommerce-website-design',
      title: 'E-Commerce UI Kit - Complete Package',
      slug: 'ecommerce-ui-kit-complete',
      description: 'Get all source files, assets, and documentation for the e-commerce design. Includes Figma files, exported assets, and usage guide.',
      price: 149.99,
      licenseType: LicenseType.COMMERCIAL,
      files: JSON.stringify([
        { name: 'ecommerce-design.fig', size: '24MB', type: 'Figma' },
        { name: 'assets-exported.zip', size: '156MB', type: 'Images' },
        { name: 'documentation.pdf', size: '2.3MB', type: 'PDF' }
      ]),
      views: 1247,
      sales: 98
    },
    {
      projectSlug: 'animated-logo-brand-identity',
      title: 'Brand Identity Package - Full Rights',
      slug: 'brand-identity-package-full',
      description: 'Complete brand identity package with full commercial rights. Includes all source files and usage guidelines.',
      price: 299.99,
      licenseType: LicenseType.EXCLUSIVE,
      files: JSON.stringify([
        { name: 'brand-identity.ai', size: '45MB', type: 'Illustrator' },
        { name: 'animated-logo.aep', size: '120MB', type: 'After Effects' },
        { name: 'brand-guidelines.pdf', size: '8MB', type: 'PDF' }
      ]),
      views: 892,
      sales: 67
    },
    {
      projectSlug: 'react-admin-dashboard-template',
      title: 'React Dashboard - Source Code',
      slug: 'react-dashboard-source-code',
      description: 'Full source code with documentation and 6 months of updates. Includes deployment guide.',
      price: 79.99,
      licenseType: LicenseType.COMMERCIAL,
      files: JSON.stringify([
        { name: 'dashboard-source.zip', size: '89MB', type: 'Code' },
        { name: 'documentation.md', size: '234KB', type: 'Markdown' },
        { name: 'deployment-guide.pdf', size: '3.2MB', type: 'PDF' }
      ]),
      views: 654,
      sales: 43
    },
    {
      projectSlug: 'instagram-content-pack-wellness',
      title: 'Instagram Wellness Pack - Canva Templates',
      slug: 'instagram-wellness-pack-canva',
      description: '30 fully editable Canva templates for Instagram. Perfect for wellness and fitness brands.',
      price: 49.99,
      licenseType: LicenseType.COMMERCIAL,
      files: JSON.stringify([
        { name: 'canva-templates-link.txt', size: '1KB', type: 'Link' },
        { name: 'usage-guide.pdf', size: '2.1MB', type: 'PDF' }
      ]),
      views: 2134,
      sales: 189
    }
  ];

  const createdProducts = [];
  for (const productData of productsData) {
    const project = createdProjects.find(p => p.slug === productData.projectSlug);
    if (!project) continue;

    const { projectSlug, ...productFields } = productData;
    const category = createdCategories.find(c => c.id === project.categoryId);

    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productFields,
        currency: 'USD',
        version: '1.0.0',
        downloadCount: 0,
        stock: null, // Unlimited digital products
        status: ProductStatus.ACTIVE,
        revenue: productData.price * productData.sales,
        ownerId: project.ownerId,
        projectId: project.id,
        categoryId: category?.id
      }
    });
    createdProducts.push(product);
    console.log(`   ✓ ${product.title} ($${product.price})`);
  }
  console.log(`✅ Created ${createdProducts.length} products\n`);

  // Step 6: Admin Settings
  console.log('⚙️  Creating admin settings...');
  const adminSettings = [
    { key: 'platform_commission_rate', value: '10.00', description: 'Platform commission percentage' },
    { key: 'min_payout_amount', value: '50.00', description: 'Minimum payout amount in USD' },
    { key: 'max_file_size_mb', value: '500', description: 'Maximum file upload size in MB' }
  ];

  for (const setting of adminSettings) {
    await prisma.adminSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  }
  console.log(`✅ Created ${adminSettings.length} admin settings\n`);

  // Step 7: Commission Rates
  console.log('💰 Creating commission rates...');
  const existingCommission = await prisma.commission.findFirst({
    where: { name: 'Standard Commission' }
  });
  
  if (!existingCommission) {
    await prisma.commission.create({
      data: {
        name: 'Standard Commission',
        percentage: 10.00,
        isDefault: true
      }
    });
  }
  console.log(`✅ Created commission rates\n`);

  // Final Summary
  console.log('=' .repeat(50));
  console.log('✨ DATABASE SEEDING COMPLETE! ✨\n');
  console.log('📊 Summary:');
  console.log(`   - Categories: ${createdCategories.length}`);
  console.log(`   - Creators: ${createdCreators.length}`);
  console.log(`   - Customers: ${createdCustomers.length}`);
  console.log(`   - Projects: ${createdProjects.length}`);
  console.log(`   - Products: ${createdProducts.length}`);
  console.log(`   - Admin Settings: ${adminSettings.length}`);
  console.log('=' .repeat(50));
  console.log('\n🎉 You can now browse these items in your app!');
  console.log('🔗 Visit: http://localhost:3000/projects');
  console.log('🔗 Visit: http://localhost:3000/creators\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });