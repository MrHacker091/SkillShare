// Quick debug test to see actual API response
async function debugTest() {
    console.log('🔍 Debugging API Response...\n');

    try {
        const response = await fetch('http://localhost:3000/api/projects?page=1&limit=10');
        const data = await response.json();

        console.log('Response structure:');
        console.log(JSON.stringify(data, null, 2));

        console.log('\n📊 Analysis:');
        console.log('- Has success field:', 'success' in data);
        console.log('- Has projects field:', 'projects' in data);
        console.log('- Has pagination field:', 'pagination' in data);

        if (data.projects) {
            console.log('- Projects count:', data.projects.length);
            if (data.projects[0]) {
                console.log('- First project has title:', !!data.projects[0].title);
                console.log('- First project has owner:', !!data.projects[0].owner);
                console.log('- First project owner has name:', !!data.projects[0].owner?.name);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

debugTest();
