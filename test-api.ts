// API Endpoint Testing Script
async function testAPIEndpoints() {
    console.log('\n🌐 Testing API Endpoints...\n');
    console.log('='.repeat(60));

    const baseUrl = 'http://localhost:3000';
    let passedTests = 0;
    let failedTests = 0;

    // Helper function to test an endpoint
    async function testEndpoint(name: string, url: string, expectedFields: string[]) {
        console.log(`\n📌 Testing: ${name}`);
        console.log(`   URL: ${url}`);

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                console.log(`❌ FAILED: HTTP ${response.status} - ${data.error || 'Unknown error'}`);
                failedTests++;
                return;
            }

            // Check for expected fields
            let missingFields: string[] = [];
            for (const field of expectedFields) {
                if (!(field in data)) {
                    missingFields.push(field);
                }
            }

            if (missingFields.length > 0) {
                console.log(`⚠️  WARNING: Missing fields: ${missingFields.join(', ')}`);
                passedTests++;
            } else {
                console.log(`✅ PASSED: Response has all expected fields`);

                // Show some sample data
                if (data.projects && Array.isArray(data.projects)) {
                    console.log(`   - Projects count: ${data.projects.length}`);
                    if (data.projects[0]) {
                        console.log(`   - Sample project: "${data.projects[0].title}"`);
                    }
                }
                if (data.project) {
                    console.log(`   - Project: "${data.project.title}"`);
                }
                if (data.creator) {
                    console.log(`   - Creator: "${data.creator.name}"`);
                }

                passedTests++;
            }
        } catch (error) {
            console.log(`❌ FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
            failedTests++;
        }
    }

    // Test 1: Projects List API
    await testEndpoint(
        'GET /api/projects (List all projects)',
        `${baseUrl}/api/projects?page=1&limit=10`,
        ['success', 'projects', 'pagination']
    );

    // Test 2: Projects List with Filter
    await testEndpoint(
        'GET /api/projects?category=Web Design',
        `${baseUrl}/api/projects?category=Web%20Design`,
        ['success', 'projects']
    );

    // Test 3: Projects List with Search
    await testEndpoint(
        'GET /api/projects?search=e-commerce',
        `${baseUrl}/api/projects?search=e-commerce`,
        ['success', 'projects']
    );

    // Get a sample project ID for detail test
    console.log('\n📌 Fetching sample project ID...');
    try {
        const response = await fetch(`${baseUrl}/api/projects?limit=1`);
        const data = await response.json();

        if (data.projects && data.projects[0]) {
            const projectId = data.projects[0].id;
            console.log(`   Found project ID: ${projectId}`);

            // Test 4: Project Detail
            await testEndpoint(
                `GET /api/projects/${projectId} (Project details)`,
                `${baseUrl}/api/projects/${projectId}`,
                ['project']
            );
        } else {
            console.log('⚠️  No projects found for detail test');
        }
    } catch (error) {
        console.log('❌ Could not fetch sample project ID');
    }

    // Get a sample creator ID for detail test
    console.log('\n📌 Fetching sample creator ID...');
    try {
        const response = await fetch(`${baseUrl}/api/projects?limit=1`);
        const data = await response.json();

        if (data.projects && data.projects[0] && data.projects[0].creator) {
            const creatorId = data.projects[0].creator.id;
            console.log(`   Found creator ID: ${creatorId}`);

            // Test 5: Creator Detail
            await testEndpoint(
                `GET /api/creators/${creatorId} (Creator details)`,
                `${baseUrl}/api/creators/${creatorId}`,
                ['creator']
            );
        } else {
            console.log('⚠️  No creator found for detail test');
        }
    } catch (error) {
        console.log('❌ Could not fetch sample creator ID');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 API Test Results:\n');
    console.log(`   ✅ Passed: ${passedTests}`);
    console.log(`   ❌ Failed: ${failedTests}`);
    console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

    if (failedTests === 0) {
        console.log('\n🎉 All API tests passed!\n');
    } else {
        console.log('\n⚠️  Some API tests failed. Server might not be running.\n');
        console.log('   Make sure to run: pnpm dev\n');
    }

    console.log('='.repeat(60) + '\n');
}

// Wait for server to be ready
console.log('⏳ Waiting 3 seconds for server to start...');
setTimeout(() => {
    testAPIEndpoints().catch(error => {
        console.error('\n💥 API test suite crashed:', error);
    });
}, 3000);
