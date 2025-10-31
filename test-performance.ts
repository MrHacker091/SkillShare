// Performance & Load Testing
const BASE_URL = 'http://localhost:3000';

interface PerformanceResult {
    name: string;
    avgTime: number;
    minTime: number;
    maxTime: number;
    passed: boolean;
    threshold: number;
}

const results: PerformanceResult[] = [];

async function measureEndpoint(url: string, iterations: number = 10): Promise<number[]> {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await fetch(url);
        const end = performance.now();
        times.push(end - start);

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return times;
}

function calculateStats(times: number[]) {
    const sum = times.reduce((a, b) => a + b, 0);
    const avg = sum / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { avg, min, max };
}

async function testResponseTimes() {
    console.log('\n⚡ RESPONSE TIME TESTS');
    console.log('='.repeat(60));

    // Test 1: Projects List Performance
    console.log('\n📌 Test 1: Projects List Endpoint (10 requests)');
    try {
        const times = await measureEndpoint(`${BASE_URL}/api/projects?page=1&limit=10`, 10);
        const stats = calculateStats(times);
        const threshold = 500; // 500ms threshold
        const passed = stats.avg < threshold;

        results.push({
            name: 'Projects List Response Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
        console.log(`   Threshold: ${threshold}ms`);
    } catch (error) {
        console.log('❌ FAILED: Request error');
    }

    // Test 2: Project Detail Performance
    console.log('\n📌 Test 2: Project Detail Endpoint (10 requests)');
    try {
        // Get a project ID first
        const listResponse = await fetch(`${BASE_URL}/api/projects?limit=1`);
        const listData = await listResponse.json();
        const projectId = listData.projects[0]?.id;

        if (projectId) {
            const times = await measureEndpoint(`${BASE_URL}/api/projects/${projectId}`, 10);
            const stats = calculateStats(times);
            const threshold = 600; // 600ms threshold
            const passed = stats.avg < threshold;

            results.push({
                name: 'Project Detail Response Time',
                avgTime: stats.avg,
                minTime: stats.min,
                maxTime: stats.max,
                passed,
                threshold
            });

            if (passed) {
                console.log('✅ PASSED');
            } else {
                console.log('❌ FAILED: Exceeds threshold');
            }
            console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
            console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
            console.log(`   Threshold: ${threshold}ms`);
        }
    } catch (error) {
        console.log('❌ FAILED: Request error');
    }

    // Test 3: Creator Profile Performance
    console.log('\n📌 Test 3: Creator Profile Endpoint (10 requests)');
    try {
        // Get a creator ID first
        const listResponse = await fetch(`${BASE_URL}/api/projects?limit=1`);
        const listData = await listResponse.json();
        const creatorId = listData.projects[0]?.creator?.id || listData.projects[0]?.owner?.id;

        if (creatorId) {
            const times = await measureEndpoint(`${BASE_URL}/api/creators/${creatorId}`, 10);
            const stats = calculateStats(times);
            const threshold = 700; // 700ms threshold (more complex query)
            const passed = stats.avg < threshold;

            results.push({
                name: 'Creator Profile Response Time',
                avgTime: stats.avg,
                minTime: stats.min,
                maxTime: stats.max,
                passed,
                threshold
            });

            if (passed) {
                console.log('✅ PASSED');
            } else {
                console.log('❌ FAILED: Exceeds threshold');
            }
            console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
            console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
            console.log(`   Threshold: ${threshold}ms`);
        }
    } catch (error) {
        console.log('❌ FAILED: Request error');
    }

    // Test 4: Search Performance
    console.log('\n📌 Test 4: Search Endpoint (10 requests)');
    try {
        const times = await measureEndpoint(`${BASE_URL}/api/projects?search=design`, 10);
        const stats = calculateStats(times);
        const threshold = 500; // 500ms threshold
        const passed = stats.avg < threshold;

        results.push({
            name: 'Search Response Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
        console.log(`   Threshold: ${threshold}ms`);
    } catch (error) {
        console.log('❌ FAILED: Request error');
    }

    // Test 5: Filter Performance
    console.log('\n📌 Test 5: Category Filter Endpoint (10 requests)');
    try {
        const times = await measureEndpoint(`${BASE_URL}/api/projects?category=Web%20Design`, 10);
        const stats = calculateStats(times);
        const threshold = 500; // 500ms threshold
        const passed = stats.avg < threshold;

        results.push({
            name: 'Filter Response Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
        console.log(`   Threshold: ${threshold}ms`);
    } catch (error) {
        console.log('❌ FAILED: Request error');
    }
}

async function testConcurrentRequests() {
    console.log('\n\n🔀 CONCURRENT REQUEST TESTS');
    console.log('='.repeat(60));

    // Test 6: Concurrent Requests (Stress Test)
    console.log('\n📌 Test 6: 20 Concurrent Requests');
    try {
        const start = performance.now();
        const requests = Array(20).fill(null).map(() =>
            fetch(`${BASE_URL}/api/projects?limit=5`)
        );

        const responses = await Promise.all(requests);
        const end = performance.now();

        const allSuccessful = responses.every(r => r.ok);
        const totalTime = end - start;
        const avgTime = totalTime / 20;

        const threshold = 1000; // Average should be under 1s
        const passed = allSuccessful && avgTime < threshold;

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED');
        }
        console.log(`   All requests successful: ${allSuccessful}`);
        console.log(`   Total time: ${totalTime.toFixed(2)}ms`);
        console.log(`   Average per request: ${avgTime.toFixed(2)}ms`);
        console.log(`   Success rate: ${responses.filter(r => r.ok).length}/20`);
    } catch (error) {
        console.log('❌ FAILED: Concurrent requests error');
    }
}

async function testDatabasePerformance() {
    console.log('\n\n💾 DATABASE PERFORMANCE TESTS');
    console.log('='.repeat(60));

    const { PrismaClient } = await import('./packages/database/generated/prisma');
    const prisma = new PrismaClient();

    // Test 7: Simple Query Performance
    console.log('\n📌 Test 7: Simple Database Query (10 iterations)');
    try {
        const times: number[] = [];

        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await prisma.project.findMany({ take: 10 });
            const end = performance.now();
            times.push(end - start);
        }

        const stats = calculateStats(times);
        const threshold = 100; // 100ms threshold for simple query
        const passed = stats.avg < threshold;

        results.push({
            name: 'Simple Query Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
    } catch (error) {
        console.log('❌ FAILED: Query error');
    }

    // Test 8: Complex Query with Relations Performance
    console.log('\n📌 Test 8: Complex Query with Relations (10 iterations)');
    try {
        const times: number[] = [];

        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await prisma.project.findMany({
                take: 10,
                include: {
                    owner: { select: { name: true, avatar: true } },
                    category: { select: { name: true } },
                    products: { take: 3 }
                }
            });
            const end = performance.now();
            times.push(end - start);
        }

        const stats = calculateStats(times);
        const threshold = 200; // 200ms threshold for complex query
        const passed = stats.avg < threshold;

        results.push({
            name: 'Complex Query Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
    } catch (error) {
        console.log('❌ FAILED: Query error');
    }

    // Test 9: Search Query Performance
    console.log('\n📌 Test 9: Search Query Performance (10 iterations)');
    try {
        const times: number[] = [];

        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            await prisma.project.findMany({
                where: {
                    OR: [
                        { title: { contains: 'design', mode: 'insensitive' } },
                        { description: { contains: 'design', mode: 'insensitive' } }
                    ]
                },
                take: 10
            });
            const end = performance.now();
            times.push(end - start);
        }

        const stats = calculateStats(times);
        const threshold = 150; // 150ms threshold for search
        const passed = stats.avg < threshold;

        results.push({
            name: 'Search Query Time',
            avgTime: stats.avg,
            minTime: stats.min,
            maxTime: stats.max,
            passed,
            threshold
        });

        if (passed) {
            console.log('✅ PASSED');
        } else {
            console.log('❌ FAILED: Exceeds threshold');
        }
        console.log(`   Average: ${stats.avg.toFixed(2)}ms`);
        console.log(`   Min: ${stats.min.toFixed(2)}ms, Max: ${stats.max.toFixed(2)}ms`);
    } catch (error) {
        console.log('❌ FAILED: Query error');
    }

    await prisma.$disconnect();
}

function printResults() {
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE TEST RESULTS');
    console.log('='.repeat(60));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const successRate = results.length > 0 ? ((passed / results.length) * 100).toFixed(1) : '0.0';

    console.log('\n📈 Summary:');
    console.log(`   ✅ Passed: ${passed}/${results.length}`);
    console.log(`   ❌ Failed: ${failed}/${results.length}`);
    console.log(`   📈 Success Rate: ${successRate}%`);

    console.log('\n⏱️  Performance Metrics:');
    console.log('   ' + '-'.repeat(56));
    console.log('   Test Name                          Avg Time  Threshold');
    console.log('   ' + '-'.repeat(56));

    results.forEach(r => {
        const status = r.passed ? '✅' : '❌';
        const name = r.name.padEnd(35);
        const avg = `${r.avgTime.toFixed(0)}ms`.padEnd(8);
        const threshold = `${r.threshold}ms`;
        console.log(`   ${status} ${name} ${avg} ${threshold}`);
    });

    console.log('\n' + '='.repeat(60));

    if (failed === 0) {
        console.log('🎉 All performance tests passed! System performs well.\n');
    } else {
        console.log('⚠️  Some tests failed. Consider optimization.\n');
    }

    // Overall performance rating
    const avgResponseTime = results.reduce((sum, r) => sum + r.avgTime, 0) / results.length;
    console.log(`📊 Overall Average Response Time: ${avgResponseTime.toFixed(2)}ms`);

    if (avgResponseTime < 200) {
        console.log('🚀 EXCELLENT - Very fast response times!');
    } else if (avgResponseTime < 500) {
        console.log('✅ GOOD - Response times are acceptable.');
    } else if (avgResponseTime < 1000) {
        console.log('⚠️  FAIR - Consider optimization for better performance.');
    } else {
        console.log('❌ SLOW - Optimization needed!');
    }

    console.log('\n');
}

async function runTests() {
    console.log('\n⚡ PERFORMANCE & LOAD TESTING');
    console.log('Testing response times and system performance...');
    console.log('\n⏳ Waiting for server to be ready...\n');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        await testResponseTimes();
        await testConcurrentRequests();
        await testDatabasePerformance();
        printResults();
    } catch (error) {
        console.error('\n❌ Fatal error during tests:', error);
    }
}

runTests().catch(console.error);
