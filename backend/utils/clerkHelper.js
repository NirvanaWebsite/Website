const { clerkClient } = require('@clerk/express');

async function getClerkUserData(userId) {
  try {
    // Fetch full user data from Clerk API
    const user = await clerkClient.users.getUser(userId);
    
    console.log('🔍 Full Clerk User Data:', JSON.stringify(user, null, 2));
    
    return {
      email: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || '',
      firstName: user.firstName || user.publicMetadata?.firstName || '',
      lastName: user.lastName || user.publicMetadata?.lastName || '',
      profileImage: user.imageUrl || user.profileImageUrl || '',
      fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      username: user.username || '',
      phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || ''
    };
  } catch (error) {
    console.error('❌ Error fetching Clerk user data:', error);
    return null;
  }
}

module.exports = { getClerkUserData };
