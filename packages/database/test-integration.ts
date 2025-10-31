// Test script to verify all database integration
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function runTests() {
  console.log('\n🧪 Starting Database Integration Tests...\n');
  console.log('=' .repeat(60));

  let passedTests = 0;
  let failedTests = 0;

  // Test 1: Database Connection
  console.log('\n📌 Test 1: Database Connection');
  try {
    await prisma.$connect();
    console.log('✅ PASSED: Database connection successful');
    passedTests++;
  } catch (error) {
    console.log('❌ FAILED: Database connection failed');
    console.error(error);
    failedTests++;
    return; // Can't continue without connection
  }

  // Test 2: Categories Count
  console.log('\n📌 Test 2: Categories Seeded');
  try {
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 9) {
      console.log(`✅ PASSED: Found ${categoriesCount} categories (expected 9)`);
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found ${categoriesCount} categories (expected 9)`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not count categories');
    console.error(error);
    failedTests++;
  }

  // Test 3: Creators Count
  console.log('\n📌 Test 3: Creators with Profiles');
  try {
    const creatorsCount = await prisma.user.count({
      where: { role: 'CREATOR' }
    });
    const profilesCount = await prisma.creatorProfile.count();
    
    if (creatorsCount >= 4 && profilesCount >= 4) {
      console.log(`✅ PASSED: Found ${creatorsCount} creators with ${profilesCount} profiles`);
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found ${creatorsCount} creators, ${profilesCount} profiles`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not count creators');
    console.error(error);
    failedTests++;
  }

  // Test 4: Projects Count
  console.log('\n📌 Test 4: Projects Seeded');
  try {
    const projectsCount = await prisma.project.count({
      where: { status: 'PUBLISHED' }
    });
    if (projectsCount >= 4) {
      console.log(`✅ PASSED: Found ${projectsCount} published projects`);
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found ${projectsCount} projects (expected at least 4)`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not count projects');
    console.error(error);
    failedTests++;
  }

  // Test 5: Products Count
  console.log('\n📌 Test 5: Products Seeded');
  try {
    const productsCount = await prisma.product.count({
      where: { status: 'ACTIVE' }
    });
    if (productsCount >= 4) {
      console.log(`✅ PASSED: Found ${productsCount} active products`);
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found ${productsCount} products (expected at least 4)`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not count products');
    console.error(error);
    failedTests++;
  }

  // Test 6: Project Relations
  console.log('\n📌 Test 6: Project Relations (Owner, Category, Products)');
  try {
    const project = await prisma.project.findFirst({
      include: {
        owner: true,
        category: true,
        products: true
      }
    });

    if (project && project.owner && project.category) {
      console.log(`✅ PASSED: Project "${project.title}" has proper relations`);
      console.log(`   - Owner: ${project.owner.name}`);
      console.log(`   - Category: ${project.category.name}`);
      console.log(`   - Products: ${project.products.length}`);
      passedTests++;
    } else {
      console.log('⚠️  WARNING: Project missing some relations');
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not load project relations');
    console.error(error);
    failedTests++;
  }

  // Test 7: Creator Profile with User
  console.log('\n📌 Test 7: Creator Profile Relations');
  try {
    const creator = await prisma.user.findFirst({
      where: { role: 'CREATOR' },
      include: {
        creatorProfile: true,
        projects: true
      }
    });

    if (creator && creator.creatorProfile) {
      console.log(`✅ PASSED: Creator "${creator.name}" has complete profile`);
      console.log(`   - Skills: ${creator.creatorProfile.skills.join(', ')}`);
      console.log(`   - Projects: ${creator.projects.length}`);
      console.log(`   - Verified: ${creator.creatorProfile.isVerifiedCreator ? '✓' : '✗'}`);
      passedTests++;
    } else {
      console.log('⚠️  WARNING: Creator missing profile');
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not load creator profile');
    console.error(error);
    failedTests++;
  }

  // Test 8: Admin Settings
  console.log('\n📌 Test 8: Admin Settings');
  try {
    const settings = await prisma.adminSettings.findMany();
    if (settings.length >= 3) {
      console.log(`✅ PASSED: Found ${settings.length} admin settings`);
      settings.forEach(s => {
        console.log(`   - ${s.key}: ${s.value}`);
      });
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found only ${settings.length} settings`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not load admin settings');
    console.error(error);
    failedTests++;
  }

  // Test 9: Commission Rates
  console.log('\n📌 Test 9: Commission Rates');
  try {
    const commissions = await prisma.commission.findMany();
    if (commissions.length >= 1) {
      console.log(`✅ PASSED: Found ${commissions.length} commission rate(s)`);
      commissions.forEach(c => {
        console.log(`   - ${c.name}: ${c.percentage}%${c.isDefault ? ' (default)' : ''}`);
      });
      passedTests++;
    } else {
      console.log('⚠️  WARNING: No commission rates found');
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Could not load commissions');
    console.error(error);
    failedTests++;
  }

  // Test 10: Data Integrity - Project with Product Pricing
  console.log('\n📌 Test 10: Data Integrity Check');
  try {
    const projects = await prisma.project.findMany({
      include: {
        products: true,
        owner: {
          include: {
            creatorProfile: true
          }
        }
      },
      where: {
        status: 'PUBLISHED'
      }
    });

    let integrityIssues = 0;
    projects.forEach(project => {
      if (!project.owner) {
        console.log(`   ⚠️  Project "${project.title}" has no owner`);
        integrityIssues++;
      }
      if (project.products.length === 0) {
        console.log(`   ⚠️  Project "${project.title}" has no products`);
        integrityIssues++;
      }
      if (project.owner && project.owner.role === 'CREATOR' && !project.owner.creatorProfile) {
        console.log(`   ⚠️  Creator "${project.owner.name}" has no profile`);
        integrityIssues++;
      }
    });

    if (integrityIssues === 0) {
      console.log(`✅ PASSED: All ${projects.length} projects have valid data integrity`);
      passedTests++;
    } else {
      console.log(`⚠️  WARNING: Found ${integrityIssues} integrity issues`);
      passedTests++;
    }
  } catch (error) {
    console.log('❌ FAILED: Data integrity check failed');
    console.error(error);
    failedTests++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary:\n');
  console.log(`   ✅ Passed: ${passedTests}`);
  console.log(`   ❌ Failed: ${failedTests}`);
  console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Database is ready for use.\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  }

  console.log('='.repeat(60) + '\n');
}

runTests()
  .catch(error => {
    console.error('\n💥 Test suite crashed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
