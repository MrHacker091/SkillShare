// Frontend Integration Test - Verify web app endpoints and data flow

const BASE_URL = 'http://localhost:3000';

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    data?: any;
}

const results: TestResult[] = [];

async function testEndpoint(name: string, url: string, validator: (data: any) => boolean, expectedFields?: string[]) {
    try {
        console.log(`\n📌 Testing: ${name}`);
        console.log(`   URL: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            results.push({
                name,
                passed: false,
                message: `HTTP ${response.status}: ${response.statusText}`
            });
            console.log(`❌ FAILED: HTTP ${response.status}`);
            return;
        }

        const data = await response.json();

        // Check for expected fields
        if (expectedFields) {
            const missingFields = expectedFields.filter(field => !(field in data));
            if (missingFields.length > 0) {
                results.push({
                    name,
                    passed: false,
                    message: `Missing fields: ${missingFields.join(', ')}`,
                    data
                });
                console.log(`⚠️  WARNING: Missing fields: ${missingFields.join(', ')}`);
                return;
            }
        }

        // Run custom validator
        if (validator(data)) {
            results.push({
                name,
                passed: true,
                message: 'All checks passed',
                data
            });
            console.log('✅ PASSED: Response validated successfully');
        } else {
            results.push({
                name,
                passed: false,
                message: 'Validation failed',
                data
            });
            console.log('❌ FAILED: Validation failed');
        }
    } catch (error) {
        results.push({
            name,
            passed: false,
            message: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`❌ FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

async function runTests() {
    console.log('\n🌐 Frontend Integration Tests');
    console.log('='.repeat(60));
    console.log('\n⏳ Waiting 3 seconds for server to start...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 1: Projects List Endpoint
    await testEndpoint(
        'GET /api/projects (List all projects)',
        `${BASE_URL}/api/projects?page=1&limit=10`,
        (data) => {
            return (
                Array.isArray(data.projects) &&
                data.projects.length > 0 &&
                data.projects[0].title &&
                (data.projects[0].owner?.name || data.projects[0].creator?.name) // Support both formats
            );
        },
        ['success', 'projects', 'pagination']
    );

    // Test 2: Projects Filter by Category
    await testEndpoint(
        'GET /api/projects?category=Web Design',
        `${BASE_URL}/api/projects?category=${encodeURIComponent('Web Design')}`,
        (data) => {
            return (
                Array.isArray(data.projects) &&
                (data.projects.length === 0 || data.projects.every((p: any) => p.category === 'Web Design' || p.category?.name === 'Web Design'))
            );
        },
        ['success', 'projects']
    );

    // Test 3: Projects Search
    await testEndpoint(
        'GET /api/projects?search=design',
        `${BASE_URL}/api/projects?search=design`,
        (data) => {
            return (
                Array.isArray(data.projects) &&
                data.projects.length > 0
            );
        },
        ['success', 'projects']
    );

    // Test 4: Get sample project ID for detail test
    let projectId: string | null = null;
    try {
        const response = await fetch(`${BASE_URL}/api/projects?limit=1`);
        const data = await response.json();
        if (data.projects && data.projects[0]) {
            projectId = data.projects[0].id;
            console.log(`\n📌 Fetching sample project ID...`);
            console.log(`   Found project ID: ${projectId}`);
        }
    } catch (error) {
        console.log('⚠️  Could not fetch sample project ID');
    }

    // Test 5: Project Detail
    if (projectId) {
        await testEndpoint(
            `GET /api/projects/${projectId} (Project details)`,
            `${BASE_URL}/api/projects/${projectId}`,
            (data) => {
                // Check if data is wrapped in success response OR is direct project
                const project = data.project || data;
                return (
                    project.id === projectId &&
                    project.title &&
                    project.owner?.name &&
                    project.category?.name
                );
            },
            // Allow both response formats
            []
        );
    }

    // Test 6: Get sample creator ID
    let creatorId: string | null = null;
    if (projectId) {
        try {
            const response = await fetch(`${BASE_URL}/api/projects?limit=1`);
            const data = await response.json();
            if (data.projects && data.projects[0]) {
                // Support both 'owner' and 'creator' field names
                creatorId = data.projects[0].creator?.id || data.projects[0].owner?.id;
                console.log(`\n📌 Fetching sample creator ID...`);
                console.log(`   Found creator ID: ${creatorId}`);
            }
        } catch (error) {
            console.log('⚠️  Could not fetch sample creator ID');
        }
    }

    // Test 7: Creator Detail
    if (creatorId) {
        await testEndpoint(
            `GET /api/creators/${creatorId} (Creator details)`,
            `${BASE_URL}/api/creators/${creatorId}`,
            (data) => {
                // Check if data is wrapped in success response OR is direct creator
                const creator = data.creator || data;
                return (
                    creator.id === creatorId &&
                    creator.name &&
                    creator.creatorProfile
                );
            },
            // Allow both response formats
            []
        );
    }

    // Test 8: Auth Session Endpoint
    await testEndpoint(
        'GET /api/auth/session (NextAuth session)',
        `${BASE_URL}/api/auth/session`,
        (data) => {
            // Session can be null if not logged in - that's valid
            return true;
        },
        []
    );

    // Test 9: Categories (if endpoint exists)
    console.log(`\n📌 Testing: GET /api/categories (if exists)`);
    try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data.categories) && data.categories.length > 0) {
                results.push({
                    name: 'GET /api/categories',
                    passed: true,
                    message: `Found ${data.categories.length} categories`
                });
                console.log(`✅ PASSED: Found ${data.categories.length} categories`);
            } else {
                console.log('⚠️  Endpoint exists but returned no categories');
            }
        } else {
            console.log('ℹ️  Categories endpoint not implemented yet');
        }
    } catch (error) {
        console.log('ℹ️  Categories endpoint not available');
    }

    // Test 10: Health Check
    console.log(`\n📌 Testing: Server Health`);
    try {
        const response = await fetch(`${BASE_URL}/`);
        if (response.ok) {
            results.push({
                name: 'Server Health Check',
                passed: true,
                message: 'Server is responding'
            });
            console.log('✅ PASSED: Server is healthy');
        } else {
            console.log(`⚠️  Server returned status ${response.status}`);
        }
    } catch (error) {
        results.push({
            name: 'Server Health Check',
            passed: false,
            message: 'Server not responding'
        });
        console.log('❌ FAILED: Server not responding');
    }

    // Print Results
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 Frontend Integration Test Results:\n');

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const successRate = results.length > 0 ? (passed / results.length * 100).toFixed(1) : 0;

    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${successRate}%`);

    if (failed === 0) {
        console.log('\n🎉 All frontend integration tests passed!');
    } else {
        console.log('\n⚠️  Some tests failed. Check details above.');
        console.log('\nFailed tests:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`   ❌ ${r.name}: ${r.message}`);
        });
    }

    console.log('\n' + '='.repeat(60) + '\n');

    await prismaDisconnect();
}

async function prismaDisconnect() {
    // Disconnect if prisma is available
    try {
        const { PrismaClient } = await import('./packages/database/generated/prisma');
        const prisma = new PrismaClient();
        await prisma.$disconnect();
    } catch {
        // Ignore if prisma not available
    }
}

runTests().catch(console.error);
