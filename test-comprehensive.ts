// Comprehensive Test Suite - Run all tests and generate report
import { PrismaClient } from './packages/database/generated/prisma';

const BASE_URL = 'http://localhost:3000';
const prisma = new PrismaClient();

interface TestSuite {
    name: string;
    tests: TestResult[];
}

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    duration?: number;
}

const suites: TestSuite[] = [];

async function runDatabaseTests(): Promise<TestSuite> {
    console.log('\n🗄️  DATABASE TESTS');
    console.log('='.repeat(60));

    const tests: TestResult[] = [];

    // Test 1: Connection
    try {
        await prisma.$connect();
        tests.push({ name: 'Database Connection', passed: true, message: 'Connected successfully' });
    } catch (error) {
        tests.push({ name: 'Database Connection', passed: false, message: 'Connection failed' });
        return { name: 'Database Tests', tests };
    }

    // Test 2: Categories
    try {
        const count = await prisma.category.count();
        tests.push({
            name: 'Categories Seeded',
            passed: count === 9,
            message: `Found ${count} categories (expected 9)`
        });
    } catch (error) {
        tests.push({ name: 'Categories Seeded', passed: false, message: 'Query failed' });
    }

    // Test 3: Creators
    try {
        const creators = await prisma.user.count({ where: { role: 'CREATOR' } });
        const profiles = await prisma.creatorProfile.count();
        tests.push({
            name: 'Creators & Profiles',
            passed: creators === 4 && profiles === 4,
            message: `${creators} creators, ${profiles} profiles`
        });
    } catch (error) {
        tests.push({ name: 'Creators & Profiles', passed: false, message: 'Query failed' });
    }

    // Test 4: Projects
    try {
        const count = await prisma.project.count({ where: { status: 'PUBLISHED' } });
        tests.push({
            name: 'Projects Published',
            passed: count === 4,
            message: `Found ${count} published projects`
        });
    } catch (error) {
        tests.push({ name: 'Projects Published', passed: false, message: 'Query failed' });
    }

    // Test 5: Products
    try {
        const count = await prisma.product.count({ where: { status: 'ACTIVE' } });
        tests.push({
            name: 'Products Active',
            passed: count === 4,
            message: `Found ${count} active products`
        });
    } catch (error) {
        tests.push({ name: 'Products Active', passed: false, message: 'Query failed' });
    }

    // Test 6: Relations
    try {
        const project = await prisma.project.findFirst({
            include: {
                owner: { select: { name: true } },
                category: { select: { name: true } },
                products: true
            }
        });
        const hasRelations = !!(project?.owner && project?.category);
        tests.push({
            name: 'Project Relations',
            passed: hasRelations,
            message: hasRelations ? 'All relations working' : 'Missing relations'
        });
    } catch (error) {
        tests.push({ name: 'Project Relations', passed: false, message: 'Query failed' });
    }

    return { name: 'Database Tests', tests };
}

async function runAPITests(): Promise<TestSuite> {
    console.log('\n🌐 API ENDPOINT TESTS');
    console.log('='.repeat(60));

    const tests: TestResult[] = [];

    // Test: Projects List
    try {
        const response = await fetch(`${BASE_URL}/api/projects?page=1&limit=10`);
        const data = await response.json();
        const valid = data.success && Array.isArray(data.projects) && data.projects.length > 0;
        tests.push({
            name: 'GET /api/projects',
            passed: valid,
            message: valid ? `${data.projects.length} projects returned` : 'Invalid response'
        });
    } catch (error) {
        tests.push({ name: 'GET /api/projects', passed: false, message: 'Request failed' });
    }

    // Test: Projects Filter
    try {
        const response = await fetch(`${BASE_URL}/api/projects?category=Web%20Design`);
        const data = await response.json();
        const valid = data.success && Array.isArray(data.projects);
        tests.push({
            name: 'GET /api/projects (filter)',
            passed: valid,
            message: valid ? `${data.projects.length} projects matched` : 'Invalid response'
        });
    } catch (error) {
        tests.push({ name: 'GET /api/projects (filter)', passed: false, message: 'Request failed' });
    }

    // Test: Projects Search
    try {
        const response = await fetch(`${BASE_URL}/api/projects?search=design`);
        const data = await response.json();
        const valid = data.success && Array.isArray(data.projects);
        tests.push({
            name: 'GET /api/projects (search)',
            passed: valid,
            message: valid ? `${data.projects.length} results found` : 'Invalid response'
        });
    } catch (error) {
        tests.push({ name: 'GET /api/projects (search)', passed: false, message: 'Request failed' });
    }

    // Test: Project Detail
    try {
        const listResponse = await fetch(`${BASE_URL}/api/projects?limit=1`);
        const listData = await listResponse.json();
        const projectId = listData.projects[0]?.id;

        if (projectId) {
            const response = await fetch(`${BASE_URL}/api/projects/${projectId}`);
            const data = await response.json();
            const project = data.project || data;
            const valid = project.id === projectId && project.title;
            tests.push({
                name: 'GET /api/projects/[id]',
                passed: valid,
                message: valid ? `Project details loaded` : 'Invalid response'
            });
        } else {
            tests.push({ name: 'GET /api/projects/[id]', passed: false, message: 'No project ID' });
        }
    } catch (error) {
        tests.push({ name: 'GET /api/projects/[id]', passed: false, message: 'Request failed' });
    }

    // Test: Creator Detail
    try {
        const listResponse = await fetch(`${BASE_URL}/api/projects?limit=1`);
        const listData = await listResponse.json();
        const creatorId = listData.projects[0]?.creator?.id || listData.projects[0]?.owner?.id;

        if (creatorId) {
            const response = await fetch(`${BASE_URL}/api/creators/${creatorId}`);
            const data = await response.json();
            const creator = data.creator || data;
            const valid = creator.id === creatorId && creator.name;
            tests.push({
                name: 'GET /api/creators/[id]',
                passed: valid,
                message: valid ? `Creator profile loaded` : 'Invalid response'
            });
        } else {
            tests.push({ name: 'GET /api/creators/[id]', passed: false, message: 'No creator ID' });
        }
    } catch (error) {
        tests.push({ name: 'GET /api/creators/[id]', passed: false, message: 'Request failed' });
    }

    // Test: Auth Session
    try {
        const response = await fetch(`${BASE_URL}/api/auth/session`);
        const data = await response.json();
        tests.push({
            name: 'GET /api/auth/session',
            passed: response.ok,
            message: 'Session endpoint accessible'
        });
    } catch (error) {
        tests.push({ name: 'GET /api/auth/session', passed: false, message: 'Request failed' });
    }

    return { name: 'API Endpoint Tests', tests };
}

async function runIntegrationTests(): Promise<TestSuite> {
    console.log('\n🔗 INTEGRATION TESTS');
    console.log('='.repeat(60));

    const tests: TestResult[] = [];

    // Test: Data Consistency
    try {
        const dbProjects = await prisma.project.count({ where: { status: 'PUBLISHED' } });
        const apiResponse = await fetch(`${BASE_URL}/api/projects?page=1&limit=100`);
        const apiData = await apiResponse.json();
        const apiProjects = apiData.projects?.length || 0;

        tests.push({
            name: 'Database-API Consistency',
            passed: dbProjects === apiProjects,
            message: `DB: ${dbProjects}, API: ${apiProjects}`
        });
    } catch (error) {
        tests.push({ name: 'Database-API Consistency', passed: false, message: 'Check failed' });
    }

    // Test: Creator Projects Count
    try {
        const creator = await prisma.user.findFirst({
            where: { role: 'CREATOR' },
            include: { createdProjects: true }
        });

        if (creator) {
            const apiResponse = await fetch(`${BASE_URL}/api/creators/${creator.id}`);
            const apiData = await apiResponse.json();
            const apiCreator = apiData.creator || apiData;
            const dbCount = creator.createdProjects.length;
            const apiCount = apiCreator.projects?.length || 0;

            tests.push({
                name: 'Creator Projects Consistency',
                passed: dbCount === apiCount,
                message: `DB: ${dbCount}, API: ${apiCount}`
            });
        } else {
            tests.push({ name: 'Creator Projects Consistency', passed: false, message: 'No creator found' });
        }
    } catch (error) {
        tests.push({ name: 'Creator Projects Consistency', passed: false, message: 'Check failed' });
    }

    // Test: Category Filtering
    try {
        const category = await prisma.category.findFirst();
        if (category) {
            const dbProjects = await prisma.project.count({
                where: { categoryId: category.id, status: 'PUBLISHED' }
            });
            const apiResponse = await fetch(`${BASE_URL}/api/projects?category=${encodeURIComponent(category.name)}`);
            const apiData = await apiResponse.json();
            const apiProjects = apiData.projects?.length || 0;

            tests.push({
                name: 'Category Filter Consistency',
                passed: dbProjects === apiProjects,
                message: `DB: ${dbProjects}, API: ${apiProjects}`
            });
        } else {
            tests.push({ name: 'Category Filter Consistency', passed: false, message: 'No category found' });
        }
    } catch (error) {
        tests.push({ name: 'Category Filter Consistency', passed: false, message: 'Check failed' });
    }

    return { name: 'Integration Tests', tests };
}

function printSummary() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE TEST REPORT');
    console.log('='.repeat(60));

    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    for (const suite of suites) {
        const passed = suite.tests.filter(t => t.passed).length;
        const failed = suite.tests.filter(t => !t.passed).length;
        totalTests += suite.tests.length;
        totalPassed += passed;
        totalFailed += failed;

        console.log(`\n${suite.name}:`);
        console.log(`  ✅ Passed: ${passed}/${suite.tests.length}`);
        if (failed > 0) {
            console.log(`  ❌ Failed: ${failed}`);
            suite.tests.filter(t => !t.passed).forEach(t => {
                console.log(`     - ${t.name}: ${t.message}`);
            });
        }
    }

    const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

    console.log('\n' + '='.repeat(60));
    console.log('OVERALL RESULTS:');
    console.log(`  Total Tests: ${totalTests}`);
    console.log(`  ✅ Passed: ${totalPassed}`);
    console.log(`  ❌ Failed: ${totalFailed}`);
    console.log(`  📈 Success Rate: ${successRate}%`);
    console.log('='.repeat(60));

    if (totalFailed === 0) {
        console.log('\n🎉 ALL TESTS PASSED! System is fully operational.');
    } else {
        console.log('\n⚠️  Some tests failed. Please review the issues above.');
    }

    console.log('\n');
}

async function runAllTests() {
    console.log('\n🧪 SKILLSHARE PLATFORM - COMPREHENSIVE TEST SUITE');
    console.log('Date: ' + new Date().toLocaleDateString());
    console.log('Time: ' + new Date().toLocaleTimeString());
    console.log('='.repeat(60));

    console.log('\n⏳ Waiting 3 seconds for server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
        // Run all test suites
        suites.push(await runDatabaseTests());
        suites.push(await runAPITests());
        suites.push(await runIntegrationTests());

        // Print summary
        printSummary();
    } catch (error) {
        console.error('\n❌ Fatal error during test execution:', error);
    } finally {
        await prisma.$disconnect();
    }
}

runAllTests().catch(console.error);
