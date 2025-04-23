export const initialMessages = [
    {
        role: "user" as const,
        content: "Hello! Can you help me with some JavaScript code? 👋",
    },
    {
        role: "assistant" as const,
        content: `Hi! I'd be happy to help you with JavaScript. What would you like to learn? 😊`,
    },
    {
        role: "user" as const,
        content: "Can you show me how to use async/await with try/catch?",
    },
    {
        role: "assistant" as const,
        content: `I'll show you a practical example of async/await with try/catch error handling:
  
  \`\`\`javascript
  async function fetchUserData(userId) {
    try {
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      throw error; // Re-throw to handle it in the calling function
    }
  }
    // Usage example:
  async function displayUserProfile(userId) {
    try {
      const userData = await fetchUserData(userId);
      console.log('User data:', userData);
    } catch (error) {
      console.log('Failed to load user profile:', error.message);
    }
  }
  \`\`\`
  
  Key points about this code:
  1. The \`async\` keyword declares an asynchronous function
  2. \`await\` pauses execution until the Promise resolves
  3. \`try/catch\` blocks handle potential errors
  4. We can chain multiple await operations
  
  Would you like me to explain any part in more detail?`,
    },
];