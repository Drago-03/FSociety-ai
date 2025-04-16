import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, X, Shield, Award, Check, ExternalLink } from 'lucide-react';
import { create } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  ipfsHash?: string;
  ethereumAddress?: string;
  nftBadges?: {
    id: string;
    name: string;
    image: string;
  }[];
  verificationProof?: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Mantej Singh Arora',
    role: 'Lead Developer & Project Manager',
    image: '/images/Mantej.png',
    ipfsHash: 'QmYgtfRMQvZqhk6vY6zE6HYFtCkHwZtQwxHGv7FYHmGYx1',
    ethereumAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    bio: 'Full-stack developer with expertise in AI and security systems. Leading the development of FSociety AI.',
    nftBadges: [
      { id: '1', name: 'Lead Developer', image: '/badges/lead-dev.svg' },
      { id: '2', name: 'Project Manager', image: '/badges/project-manager.svg' }
    ],
    social: {
      github: 'https://github.com/mantejsingh',
      linkedin: 'https://linkedin.com/in/mantejsingh',
      twitter: 'https://x.com/mantejsingh'
    }
  },
  {
    name: 'Gagandeep',
    role: 'Security Specialist',
    image: '/images/Gagandeep.png',
    bio: 'Cybersecurity expert focused on implementing robust security measures and threat detection systems.',
    social: {
      github: 'https://github.com/gagandeep',
      linkedin: 'https://linkedin.com/in/gagandeep'
    }
  },
  {
    name: 'Ishaan Sharma',
    role: 'AI Research Engineer',
    image: '/images/Ishaan.png',
    bio: 'AI/ML specialist working on content moderation algorithms and pattern recognition systems.',
    social: {
      github: 'https://github.com/ishaansharma',
      linkedin: 'https://linkedin.com/in/ishaansharma',
      twitter: 'https://x.com/ishaansharma'
    }
  },
  {
    name: 'Ayush Saini',
    role: 'Frontend Developer',
    image: '/images/ayush.png',
    bio: 'UI/UX expert specializing in creating intuitive and responsive user interfaces for security applications.',
    social: {
      github: 'https://github.com/ayushsaini',
      linkedin: 'https://linkedin.com/in/ayushsaini',
      twitter: 'https://x.com/ayushsaini'
    }
  }
];

const Team = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [verifiedMembers, setVerifiedMembers] = useState<Record<string, boolean>>({});
  const [ipfsImages, setIpfsImages] = useState<Record<string, string>>({});
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);

  useEffect(() => {
    initializeWeb3();
    loadIPFSImages();
    verifyTeamMembers();
  }, []);

  const initializeWeb3 = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        setIsWeb3Connected(true);
        toast.success('Connected to Web3');
      }
    } catch (error) {
      console.error('Web3 initialization error:', error);
      toast.error('Failed to connect to Web3');
    }
  };

  const loadIPFSImages = async () => {
    const web3Storage = new Web3Storage({ token: process.env.VITE_WEB3_STORAGE_TOKEN! });
    
    for (const member of teamMembers) {
      if (member.ipfsHash) {
        try {
          const res = await web3Storage.get(member.ipfsHash);
          if (res) {
            const files = await res.files();
            const imageUrl = URL.createObjectURL(files[0]);
            setIpfsImages(prev => ({ ...prev, [member.name]: imageUrl }));
          }
        } catch (error) {
          console.error(`Failed to load IPFS image for ${member.name}:`, error);
        }
      }
    }
  };

  const verifyTeamMembers = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    for (const member of teamMembers) {
      if (member.ethereumAddress && member.verificationProof) {
        try {
          const message = `Verify ${member.name} as FSociety AI team member`;
          const address = ethers.utils.verifyMessage(message, member.verificationProof);
          
          if (address.toLowerCase() === member.ethereumAddress.toLowerCase()) {
            setVerifiedMembers(prev => ({ ...prev, [member.name]: true }));
          }
        } catch (error) {
          console.error(`Verification failed for ${member.name}:`, error);
        }
      }
    }
  };

  const handleImageError = (memberName: string) => {
    setImageErrors(prev => ({ ...prev, [memberName]: true }));
  };

  const getImageUrl = (member: TeamMember) => {
    if (ipfsImages[member.name]) {
      return ipfsImages[member.name];
    }
    if (imageErrors[member.name]) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&size=400&bold=true&color=fff&background=6366F1`;
    }
    return member.image;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${isWeb3Connected ? 'text-green-500' : 'text-gray-400'}`} />
            <span className="text-sm font-medium">
              {isWeb3Connected ? 'Web3 Connected' : 'Web3 Disconnected'}
            </span>
          </div>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-500">
            The passionate individuals behind FSociety AI's content moderation platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative pb-[100%] bg-gradient-to-br from-indigo-50 to-purple-50">
                <img
                  src={getImageUrl(member)}
                  alt={member.name}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                  onError={() => handleImageError(member.name)}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                {verifiedMembers[member.name] && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                </div>
                <p className="text-sm font-medium text-indigo-600 mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{member.bio}</p>
                
                {member.nftBadges && member.nftBadges.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {member.nftBadges.map(badge => (
                      <div
                        key={badge.id}
                        className="bg-indigo-50 rounded-full px-3 py-1 flex items-center gap-1"
                        title={badge.name}
                      >
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-medium text-indigo-700">{badge.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-4">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title={`${member.name}'s GitHub Profile`}
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      title={`${member.name}'s LinkedIn Profile`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title={`${member.name}'s X Profile`}
                    >
                      <X className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;