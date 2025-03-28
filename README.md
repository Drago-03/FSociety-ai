# FSociety AI Content Moderation System

FSociety AI is a real-time content moderation system leveraging Google's AI services to provide intelligent content filtering and analysis. Built by Indie Hub, this system offers enterprise-grade content moderation capabilities with a focus on accuracy and scalability.

![FSociety AI Dashboard](https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## Features

- 🤖 AI-Powered Content Analysis
- 🚀 Real-time Processing
- 📊 Advanced Analytics Dashboard
- 👥 Team Collaboration Tools
- 🔒 Enterprise-grade Security
- 📱 Mobile Responsive Interface

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Firebase Auth
- **AI Services**: Google Cloud AI & ML APIs
- **Analytics**: Custom Analytics Dashboard

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Google Cloud Account
- Firebase Project

### Installation

1. Clone the repository:

```bash
git clone https://github.com/indiehub/fsociety-ai.git
cd fsociety-ai
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your Firebase and Google Cloud credentials.

5. Start the development server:

```bash
npm run dev
```

### Configuration

1. Firebase Setup:
   - Create a new Firebase project
   - Enable Authentication with Email/Password
   - Copy the Firebase configuration to `src/context/AuthContext.tsx`

2. Google Cloud Setup:
   - Enable required APIs (Perspective, Natural Language, etc.)
   - Create service account and download credentials
   - Set up API access and permissions

## Usage

### Admin Login

```
Email: eliot@indiehub.co
Password: fsociety
```

### Content Moderation

1. Access the dashboard
2. Navigate to Content Queue
3. Review flagged content
4. Take moderation actions
5. Monitor analytics

## Development

### Project Structure

```
fsociety-ai/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   └── utils/          # Utility functions
├── public/             # Static assets
└── docs/              # Documentation
```

### Building for Production

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email <contact@indiehub.co> or join our Slack community.

## Acknowledgments

- Google Cloud Platform
- Firebase Team
- React Community
- Indie Hub Development Team
