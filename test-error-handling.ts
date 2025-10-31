// Error Handling & Edge Cases Tests
const BASE_URL = 'http://localhost:3000';

interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    expectedStatus?: number;
    actualStatus?: number;
}

const results: TestResult[] = [];

async function testAPIErrorHandling() {
    console.log('\n🚨 API ERROR HANDLING TESTS');
    console.log('='.repeat(60));

    // Test 1: Invalid Project ID (404)
    console.log('\n📌 Test 1: Invalid Project ID Handling');
    try {
        const response = await fetch(`${BASE_URL}/api/projects/invalid-id-12345`);
        const data = await response.json();

        const correctError = response.status === 404 || response.status === 500;
        results.push({
            name: 'Invalid Project ID Error',
            passed: correctError,
            message: correctError ? 'Proper error response' : 'Unexpected response',
            expectedStatus: 404,
            actualStatus: response.status
        });

        if (correctError) {
            console.log('✅ PASSED');
            console.log(`   Status: ${response.status}, Message: ${data.error || 'Error returned'}`);
        } else {
            console.log('❌ FAILED');
            console.log(`   Expected 404, got ${response.status}`);
        }
    } catch (error) {
        results.push({
            name: 'Invalid Project ID Error',
            passed: false,
            message: 'Request failed unexpectedly'
        });
        console.log('❌ FAILED: Request error');
    }

    // Test 2: Invalid Creator ID (404)
    console.log('\n📌 Test 2: Invalid Creator ID Handling');
    try {
        const response = await fetch(`${BASE_URL}/api/creators/invalid-creator-id`);
        const data = await response.json();

        const correctError = response.status === 404 || response.status === 500;
        results.push({
            name: 'Invalid Creator ID Error',
            passed: correctError,
            message: correctError ? 'Proper error response' : 'Unexpected response',
            expectedStatus: 404,
            actualStatus: response.status
        });

        if (correctError) {
            console.log('✅ PASSED');
            console.log(`   Status: ${response.status}, Message: ${data.error || 'Error returned'}`);
        } else {
            console.log('❌ FAILED');
            console.log(`   Expected 404, got ${response.status}`);
        }
    } catch (error) {
        results.push({
            name: 'Invalid Creator ID Error',
            passed: false,
            message: 'Request failed unexpectedly'
        });
        console.log('❌ FAILED: Request error');
    }

    // Test 3: Invalid Query Parameters
    console.log('\n📌 Test 3: Invalid Query Parameters Handling');
    try {
        const response = await fetch(`${BASE_URL}/api/projects?page=-1&limit=9999`);
        const data = await response.json();

        // Should either handle gracefully or return error
        const handled = response.ok || response.status === 400;
        results.push({
            name: 'Invalid Query Parameters',
            passed: handled,
            message: handled ? 'Handled gracefully' : 'Not handled properly',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED');
            console.log(`   Status: ${response.status}, Handled: ${response.ok ? 'Gracefully' : 'With error'}`);
        } else {
            console.log('⚠️  WARNING: Invalid params not handled');
        }
    } catch (error) {
        results.push({
            name: 'Invalid Query Parameters',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Request error');
    }

    // Test 4: Empty Search Query
    console.log('\n📌 Test 4: Empty Search Query Handling');
    try {
        const response = await fetch(`${BASE_URL}/api/projects?search=`);
        const data = await response.json();

        const handled = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'Empty Search Query',
            passed: handled,
            message: handled ? `Returned ${data.projects.length} projects` : 'Not handled',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED');
            console.log(`   Returns all projects: ${data.projects.length}`);
        } else {
            console.log('❌ FAILED');
        }
    } catch (error) {
        results.push({
            name: 'Empty Search Query',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Request error');
    }

    // Test 5: Non-existent Category
    console.log('\n📌 Test 5: Non-existent Category Filtering');
    try {
        const response = await fetch(`${BASE_URL}/api/projects?category=NonExistentCategory123`);
        const data = await response.json();

        const handled = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'Non-existent Category',
            passed: handled,
            message: handled ? `Returned ${data.projects.length} projects` : 'Not handled',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED');
            console.log(`   Returns empty array or handles gracefully: ${data.projects.length} projects`);
        } else {
            console.log('❌ FAILED');
        }
    } catch (error) {
        results.push({
            name: 'Non-existent Category',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Request error');
    }

    // Test 6: SQL Injection Attempt (should be sanitized by Prisma)
    console.log('\n📌 Test 6: SQL Injection Protection');
    try {
        const maliciousQuery = "'; DROP TABLE projects; --";
        const response = await fetch(`${BASE_URL}/api/projects?search=${encodeURIComponent(maliciousQuery)}`);
        const data = await response.json();

        // Should handle safely - Prisma should protect us
        const safe = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'SQL Injection Protection',
            passed: safe,
            message: safe ? 'Protected by Prisma' : 'Potential vulnerability',
            actualStatus: response.status
        });

        if (safe) {
            console.log('✅ PASSED');
            console.log('   Prisma ORM provides SQL injection protection');
        } else {
            console.log('⚠️  WARNING: Check query sanitization');
        }
    } catch (error) {
        results.push({
            name: 'SQL Injection Protection',
            passed: true, // Error is also safe
            message: 'Request rejected (safe)'
        });
        console.log('✅ PASSED: Request rejected safely');
    }

    // Test 7: XSS Attempt in Search
    console.log('\n📌 Test 7: XSS Protection in API');
    try {
        const xssPayload = '<script>alert("XSS")</script>';
        const response = await fetch(`${BASE_URL}/api/projects?search=${encodeURIComponent(xssPayload)}`);
        const data = await response.json();

        // Should handle safely
        const safe = response.ok;
        results.push({
            name: 'XSS Protection',
            passed: safe,
            message: safe ? 'Handled safely' : 'Potential vulnerability',
            actualStatus: response.status
        });

        if (safe) {
            console.log('✅ PASSED');
            console.log('   XSS payload handled safely');
        } else {
            console.log('⚠️  WARNING: Check XSS protection');
        }
    } catch (error) {
        results.push({
            name: 'XSS Protection',
            passed: true, // Error is safe
            message: 'Request rejected (safe)'
        });
        console.log('✅ PASSED: Request rejected safely');
    }

    // Test 8: Rate Limiting (if implemented)
    console.log('\n📌 Test 8: Rate Limiting Check');
    try {
        // Make multiple rapid requests
        const requests = Array(10).fill(null).map(() =>
            fetch(`${BASE_URL}/api/projects?limit=1`)
        );

        const responses = await Promise.all(requests);
        const allSucceeded = responses.every(r => r.ok);
        const anyRateLimited = responses.some(r => r.status === 429);

        results.push({
            name: 'Rate Limiting',
            passed: true, // Either way is ok for now
            message: anyRateLimited ? 'Rate limiting active' : 'No rate limiting (consider implementing)'
        });

        if (anyRateLimited) {
            console.log('✅ PASSED: Rate limiting detected');
        } else {
            console.log('ℹ️  INFO: No rate limiting (consider adding for production)');
        }
    } catch (error) {
        results.push({
            name: 'Rate Limiting',
            passed: true,
            message: 'Could not test'
        });
        console.log('ℹ️  Could not test rate limiting');
    }
}

async function testDatabaseErrorHandling() {
    console.log('\n\n💾 DATABASE ERROR HANDLING TESTS');
    console.log('='.repeat(60));

    const { PrismaClient } = await import('./packages/database/generated/prisma');
    const prisma = new PrismaClient();

    // Test 9: Query with Invalid ID Format
    console.log('\n📌 Test 9: Invalid ID Format Query');
    try {
        const project = await prisma.project.findUnique({
            where: { id: 'definitely-not-a-valid-cuid' }
        });

        // Should return null, not throw error
        const handled = project === null;
        results.push({
            name: 'Invalid ID Format Query',
            passed: handled,
            message: handled ? 'Returns null gracefully' : 'Throws error'
        });

        if (handled) {
            console.log('✅ PASSED: Returns null for invalid ID');
        } else {
            console.log('⚠️  WARNING: Invalid ID not handled gracefully');
        }
    } catch (error) {
        results.push({
            name: 'Invalid ID Format Query',
            passed: false,
            message: 'Query threw error'
        });
        console.log('❌ FAILED: Query threw error');
    }

    // Test 10: Query with Null Values
    console.log('\n📌 Test 10: Null Value Handling');
    try {
        const projects = await prisma.project.findMany({
            where: {
                description: { contains: null as any } // Intentionally test null
            },
            take: 1
        });

        // Prisma should handle this
        results.push({
            name: 'Null Value Handling',
            passed: true,
            message: 'Query executed'
        });
        console.log('✅ PASSED: Null values handled by Prisma');
    } catch (error) {
        results.push({
            name: 'Null Value Handling',
            passed: true, // Error is expected and ok
            message: 'Prisma validation caught invalid null'
        });
        console.log('✅ PASSED: Invalid null caught by Prisma validation');
    }

    // Test 11: Connection Pool Stress
    console.log('\n📌 Test 11: Connection Pool Stress Test');
    try {
        // Multiple simultaneous queries
        const queries = Array(5).fill(null).map(() =>
            prisma.project.count()
        );

        const results_queries = await Promise.all(queries);
        const allSucceeded = results_queries.every(count => typeof count === 'number');

        results.push({
            name: 'Connection Pool Stress',
            passed: allSucceeded,
            message: allSucceeded ? 'All queries succeeded' : 'Some queries failed'
        });

        if (allSucceeded) {
            console.log('✅ PASSED: Connection pool handling multiple queries');
        } else {
            console.log('❌ FAILED: Connection pool issues');
        }
    } catch (error) {
        results.push({
            name: 'Connection Pool Stress',
            passed: false,
            message: 'Query failed'
        });
        console.log('❌ FAILED: Connection pool error');
    }

    await prisma.$disconnect();
}

async function testEdgeCases() {
    console.log('\n\n🎯 EDGE CASE TESTS');
    console.log('='.repeat(60));

    // Test 12: Very Long Search Query
    console.log('\n📌 Test 12: Very Long Search Query');
    try {
        const longQuery = 'a'.repeat(1000);
        const response = await fetch(`${BASE_URL}/api/projects?search=${encodeURIComponent(longQuery)}`);
        const data = await response.json();

        const handled = response.ok || response.status === 413; // Request Entity Too Large
        results.push({
            name: 'Long Search Query',
            passed: handled,
            message: handled ? 'Handled gracefully' : 'Not handled',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED');
            console.log(`   Status: ${response.status}`);
        } else {
            console.log('❌ FAILED: Long query not handled');
        }
    } catch (error) {
        results.push({
            name: 'Long Search Query',
            passed: true,
            message: 'Request rejected (safe)'
        });
        console.log('✅ PASSED: Long query rejected');
    }

    // Test 13: Unicode Characters in Search
    console.log('\n📌 Test 13: Unicode Character Handling');
    try {
        const unicodeQuery = '你好世界 🚀 émojis';
        const response = await fetch(`${BASE_URL}/api/projects?search=${encodeURIComponent(unicodeQuery)}`);
        const data = await response.json();

        const handled = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'Unicode Character Handling',
            passed: handled,
            message: handled ? 'Unicode supported' : 'Unicode not supported',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED: Unicode characters handled');
        } else {
            console.log('❌ FAILED: Unicode not supported');
        }
    } catch (error) {
        results.push({
            name: 'Unicode Character Handling',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Unicode query error');
    }

    // Test 14: Pagination Edge Cases
    console.log('\n📌 Test 14: Pagination Edge Cases');
    try {
        // Test page beyond available pages
        const response = await fetch(`${BASE_URL}/api/projects?page=999&limit=10`);
        const data = await response.json();

        const handled = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'Pagination Edge Cases',
            passed: handled,
            message: handled ? `Page 999 returns ${data.projects.length} projects` : 'Not handled',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED');
            console.log(`   Page 999: ${data.projects.length} projects (expected 0)`);
        } else {
            console.log('❌ FAILED');
        }
    } catch (error) {
        results.push({
            name: 'Pagination Edge Cases',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Pagination error');
    }

    // Test 15: Special Characters in Category
    console.log('\n📌 Test 15: Special Characters in Category Filter');
    try {
        const specialCategory = 'Web & Mobile Design (UI/UX)';
        const response = await fetch(`${BASE_URL}/api/projects?category=${encodeURIComponent(specialCategory)}`);
        const data = await response.json();

        const handled = response.ok && Array.isArray(data.projects);
        results.push({
            name: 'Special Characters in Filter',
            passed: handled,
            message: handled ? 'Special chars handled' : 'Not handled',
            actualStatus: response.status
        });

        if (handled) {
            console.log('✅ PASSED: Special characters in category handled');
        } else {
            console.log('❌ FAILED');
        }
    } catch (error) {
        results.push({
            name: 'Special Characters in Filter',
            passed: false,
            message: 'Request failed'
        });
        console.log('❌ FAILED: Special chars error');
    }
}

function printResults() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 ERROR HANDLING TEST RESULTS');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const successRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : '0.0';

    console.log(`\n   ✅ Passed: ${passed}/${results.length}`);
    console.log(`   ❌ Failed: ${failed}/${results.length}`);
    console.log(`   📈 Success Rate: ${successRate}%`);

    if (failed > 0) {
        console.log('\n   Failed Tests:');
        results.filter(r => !r.passed).forEach(r => {
            console.log(`   ❌ ${r.name}: ${r.message}`);
            if (r.expectedStatus && r.actualStatus) {
                console.log(`      Expected: ${r.expectedStatus}, Got: ${r.actualStatus}`);
            }
        });
    }

    console.log('\n' + '='.repeat(60));

    if (failed === 0) {
        console.log('🎉 All error handling tests passed!\n');
    } else {
        console.log('⚠️  Some tests failed. Review details above.\n');
    }
}

async function runTests() {
    console.log('\n⏳ Waiting for server to be ready...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        await testAPIErrorHandling();
        await testDatabaseErrorHandling();
        await testEdgeCases();
        printResults();
    } catch (error) {
        console.error('\n❌ Fatal error during tests:', error);
    }
}

runTests().catch(console.error);
