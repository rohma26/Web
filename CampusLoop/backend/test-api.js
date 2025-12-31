// backend/test-api.js
const axios = require('axios');

async function testEndpoints() {
  const baseURL = 'http://localhost:5000';
  
  console.log('Testing backend endpoints...\n');
  
  try {
    // Test basic endpoint
    const response1 = await axios.get(`${baseURL}/`);
    console.log('✓ Basic endpoint:', response1.data.message);
    
    // Test tasks endpoint
    const response2 = await axios.get(`${baseURL}/api/tasks`);
    console.log('✓ Tasks endpoint: OK (', response2.data.length, 'tasks)');
    
    // Test dashboard endpoint
    const response3 = await axios.get(`${baseURL}/api/dashboard/stats`);
    console.log('✓ Dashboard endpoint: OK');
    console.log('  Total tasks:', response3.data.tasks?.total);
    
    console.log('\n✅ All endpoints working!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testEndpoints();