import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const addSampleContent = async (userId: string) => {
  const sampleContent = [
    {
      content: 'This is a test message that needs moderation.',
      status: 'pending',
      confidence: 85,
      category: 'Text',
      timestamp: Timestamp.now()
    },
    {
      content: 'Another message requiring review and analysis.',
      status: 'approved',
      confidence: 92,
      category: 'Text',
      timestamp: Timestamp.now()
    },
    {
      content: 'This content has been flagged for review.',
      status: 'rejected',
      confidence: 78,
      category: 'Text',
      timestamp: Timestamp.now()
    }
  ];

  const contentRef = collection(db, 'users', userId, 'content');
  
  for (const content of sampleContent) {
    await addDoc(contentRef, content);
  }
};

export const addSamplePosts = async (userId: string) => {
  const samplePosts = [
    {
      title: 'New Sophisticated Phishing Campaign Detected',
      content: `We've identified a new phishing campaign targeting content moderators. The attackers are using AI-generated content to bypass traditional filters.

Key characteristics:
- Highly personalized messages
- Use of deep fake technology
- Multiple language variations

Please update your filters and train your team to identify these new patterns.`,
      author: {
        id: userId,
        name: 'Alex Thompson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=random'
      },
      timestamp: Timestamp.now(),
      likes: 15,
      comments: 7,
      category: 'threat-alert',
      threatLevel: 'high',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: 'Mental Health Tips for Content Moderators',
      content: `After years of dealing with sensitive content, here are some essential practices for maintaining mental well-being:

1. Regular breaks between moderation sessions
2. Implementing the "two-minute rule" for particularly challenging content
3. Weekly team check-ins
4. Access to professional support

What strategies have worked for your team?`,
      author: {
        id: userId,
        name: 'Sarah Chen',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=random'
      },
      timestamp: Timestamp.now(),
      likes: 8,
      comments: 12,
      category: 'best-practices',
      threatLevel: 'low',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    },
    {
      title: 'Emerging Trend: Coordinated Disinformation Campaigns',
      content: `We're seeing an increase in coordinated disinformation campaigns using multiple channels. Key findings:

- Cross-platform coordination
- Use of automated posting tools
- Pattern of content recycling
- Sophisticated evasion techniques

Recommended Actions:
1. Update detection algorithms
2. Cross-reference suspicious patterns
3. Implement network analysis tools

Has anyone else noticed similar patterns?`,
      author: {
        id: userId,
        name: 'Marcus Rodriguez',
        avatar: 'https://ui-avatars.com/api/?name=Marcus+Rodriguez&background=random'
      },
      timestamp: Timestamp.now(),
      likes: 23,
      comments: 15,
      category: 'incident-report',
      threatLevel: 'medium',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
  ];

  try {
    const postsRef = collection(db, 'posts');
    const promises = samplePosts.map(post => addDoc(postsRef, post));
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error adding sample posts:', error);
    return false;
  }
}; 