import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Team = () => {
  const team = [
    {
      name: 'Elliot Alderson',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Cybersecurity expert and lead developer at FSociety AI.',
    },
    {
      name: 'Darlene Alderson',
      role: 'Security Specialist',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Expert in penetration testing and system security.',
    },
    {
      name: 'Angela Moss',
      role: 'UI/UX Designer',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Creating beautiful and intuitive user experiences.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Meet Our Team</h2>
          <p className="mt-4 text-lg text-gray-500">
            The brilliant minds behind FSociety AI's content moderation system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          {team.map((member, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-w-3 aspect-h-3">
                <img
                  className="object-cover shadow-lg rounded-lg"
                  src={member.image}
                  alt={member.name}
                />
              </div>
              <div className="text-lg leading-6 font-medium space-y-1">
                <h3 className="text-gray-900">{member.name}</h3>
                <p className="text-indigo-600">{member.role}</p>
              </div>
              <div className="text-gray-500">
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;