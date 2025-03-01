// import { Helmet } from 'react-helmet-async';

// const Home = () => {
//     return (
//         <>
//             <Helmet>
//                 <title>Home | People Voice</title>
//                 <meta name="description" content="Welcome to People Voice - Share your voice and connect with others" />
//             </Helmet>
//             <div className="container mx-auto px-4 py-8">
//                 <h1 className="text-4xl font-bold mb-6">Welcome to People Voice</h1>
//                 <p className="text-lg text-gray-600">
//                     Share your thoughts, connect with others, and make your voice heard.
//                 </p>
//             </div>
//         </>
//     );
// };

// export default Home; 


import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bell, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  ArrowRight, 
  Zap,
  MessageCircle,
  Settings,
  Shield,
  Building,
  FileText,
  Menu,
  X,
  HelpCircle,
  Users,
  BarChart2,
  Award,
  Camera
} from 'lucide-react';
import { Link } from 'react-router-dom';


const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('public');
  const [issueCount, setIssueCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  
  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (issueCount < 1250) setIssueCount(prev => Math.min(prev + 15, 1250));
      if (resolvedCount < 1048) setResolvedCount(prev => Math.min(prev + 12, 1048));
      if (userCount < 3500) setUserCount(prev => Math.min(prev + 40, 3500));
    }, 30);

    return () => clearInterval(interval);
  }, [issueCount, resolvedCount, userCount]);

  // Categories with better icons and organization
  const categories = [
    { name: 'Infrastructure', icon: <Building className="h-6 w-6" />, description: "Roads, bridges, public facilities" },
    { name: 'Public Safety', icon: <Shield className="h-6 w-6" />, description: "Security concerns, hazards" },
    { name: 'Environment', icon: <MapPin className="h-6 w-6" />, description: "Pollution, parks, green spaces" },
    { name: 'Transportation', icon: <MapPin className="h-6 w-6" />, description: "Public transit, traffic issues" },
    { name: 'Govt. Services', icon: <FileText className="h-6 w-6" />, description: "Documentation, assistance" },
    { name: 'Social Welfare', icon: <Users className="h-6 w-6" />, description: "Community support programs" },
  ];

  // Process steps with better descriptions
  const processSteps = [
    {
      title: "Report an Issue",
      description: "Take a photo, add location details, and describe the community problem you've spotted.",
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: "Counselor Review",
      description: "Your area counselor validates the issue and commits to a resolution timeline.",
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      title: "Track Progress",
      description: "Follow real-time status updates as your issue moves through the resolution pipeline.",
      icon: <BarChart2 className="h-6 w-6" />
    },
    {
      title: "Verified Resolution",
      description: "Authorities provide photographic proof of the completed work and issue closure.",
      icon: <Award className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with improved nav */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <Zap size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PeopleVoice</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-800 font-medium hover:text-blue-600 transition">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">How It Works</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Report Issue</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">Services</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition">About Us</a>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-medium">
                Log In
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
                Sign Up
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? 
                <X className="h-6 w-6" /> : 
                <Menu className="h-6 w-6" />
              }
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-gray-800 font-medium hover:text-blue-600 transition">Home</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">How It Works</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Report Issue</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">Services</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">About Us</a>
                <div className="flex flex-col space-y-3 pt-3">
                  <Link to="/login" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-medium">
                    Log In
                  </Link>
                  <Link to="/signup" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
                    Sign Up
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Modern and engaging */}
      <section className="relative bg-gradient-to-r from-blue-700 to-blue-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/70 to-blue-600/70 z-10" />
        
        {/* Abstract shapes for visual interest */}
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-20">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Your Voice. Your Community. <span className="text-blue-200">Real Change.</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                Connect with your local government, report community issues, and track real progress in your neighborhood.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg">
                  Report an Issue
                </button>
                <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition border border-blue-400">
                  Find Services
                </button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                {/* Phone mockup with app UI */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 w-64 md:w-80">
                  <div className="bg-blue-50 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="bg-blue-600 text-white p-1 rounded-md">
                          <Zap size={16} />
                        </div>
                        <span className="ml-2 font-medium text-gray-800">PeopleVoice</span>
                      </div>
                      <User size={18} className="text-gray-600" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-center text-sm mb-1">
                        <MapPin size={12} className="text-blue-600 mr-1" />
                        <span className="font-medium text-gray-600">Report new issue</span>
                      </div>
                      <div className="w-full h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                        <Camera size={24} className="text-gray-400" />
                      </div>
                      <div className="h-2 w-2/3 bg-gray-200 rounded-full mb-1"></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm font-medium">Recent Issues</span>
                        </div>
                        <span className="text-xs text-blue-600">View all</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2 flex items-center mb-2">
                        <AlertTriangle size={14} className="text-orange-500 mr-2" />
                        <div className="flex-1">
                          <div className="text-xs font-medium">Pothole on Main St</div>
                          <div className="text-xs text-gray-500">In Progress</div>
                        </div>
                        <Clock size={14} className="text-gray-400" />
                      </div>
                      <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                        <CheckCircle size={14} className="text-green-500 mr-2" />
                        <div className="flex-1">
                          <div className="text-xs font-medium">Street Light Repair</div>
                          <div className="text-xs text-gray-500">Resolved</div>
                        </div>
                        <Clock size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-sm transform transition hover:scale-105 hover:shadow-md">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">{issueCount.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Issues Reported</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center shadow-sm transform transition hover:scale-105 hover:shadow-md">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-green-600 mb-2">{resolvedCount.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Issues Resolved</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-sm transform transition hover:scale-105 hover:shadow-md">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-purple-600 mb-2">{userCount.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">Active Citizens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect. Report. Resolve.</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A transparent platform connecting citizens and local government to solve community issues faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg inline-block mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Reporting</h3>
              <p className="text-gray-600">
                Easily report public issues with photos, descriptions, and precise location data for faster resolution.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg inline-block mb-4">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transparent Progress</h3>
              <p className="text-gray-600">
                Track the status of your reports from submission through verification and resolution with real-time updates.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg inline-block mb-4">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Service Connection</h3>
              <p className="text-gray-600">
                Find and connect with trusted local service providers for your private household and business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Would You Like to Report?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From infrastructure problems to public safety concerns, we connect you with the right authorities.
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button 
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'public' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setActiveTab('public')}
              >
                Public Issues
              </button>
              <button 
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'private' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setActiveTab('private')}
              >
                Private Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:border-blue-100 transition cursor-pointer">
                <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  {category.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500">{category.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <button className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition inline-flex items-center">
              {activeTab === 'public' ? 'Report Public Issue' : 'Find Service Provider'} 
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How PeopleVoice Works</h2>
            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              A simple, transparent process designed to get results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Line connecting steps (not visible on mobile) */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/4 left-full w-full h-0.5 bg-blue-400 transform -translate-y-1/2 z-0" style={{ width: '50%' }}></div>
                )}
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-400/30 hover:bg-white/20 transition relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center text-blue-600">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-blue-100">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Citizen & Government Cooperation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bridging Citizens and Local Government</h2>
              <p className="text-lg text-gray-600 mb-6">
                PeopleVoice creates a direct channel between citizens and authorities, ensuring:
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Faster Issue Resolution</h4>
                    <p className="text-gray-600">Area counselors accountable with clear deadlines and transparent progress tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Escalation System</h4>
                    <p className="text-gray-600">Automatic issue escalation to Municipal Corporation if deadlines are missed</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-green-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Visual Evidence</h4>
                    <p className="text-gray-600">Photo verification of both issues and resolutions for complete transparency</p>
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition inline-flex items-center">
                Learn More About The Process <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="md:w-1/2 relative">
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
                    <Building size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Issue Resolution Workflow</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Citizen Reports Issue</h4>
                      <p className="text-sm text-gray-600">Issue is submitted with location data and visual evidence</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Area Counselor Verification</h4>
                      <p className="text-sm text-gray-600">Issue validated and assigned a resolution deadline</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div className="w-0.5 h-full bg-blue-200 mt-2"></div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Resolution or Escalation</h4>
                      <p className="text-sm text-gray-600">Issue resolved with proof or escalated to Municipal Corporation</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">✓</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Verified Completion</h4>
                      <p className="text-sm text-gray-600">Citizens confirm resolution with feedback</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-5/12 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-50 p-2 rounded-md mr-2">
                      <MapPin size={16} className="text-blue-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Plumber</h4>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Find trusted pros near you</div>
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded inline-block">4.8 ★ Rated</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-50 p-2 rounded-md mr-2">
                      <MapPin size={16} className="text-purple-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Electrician</h4>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Certified experts nearby</div>
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded inline-block">4.9 ★ Rated</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                  <div className="flex items-center mb-3">
                    <div className="bg-red-50 p-2 rounded-md mr-2">
                      <MapPin size={16} className="text-red-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Painter</h4>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Quality work guaranteed</div>
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded inline-block">4.7 ★ Rated</div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
                <div className="flex items-center mb-3">
                    <div className="bg-amber-50 p-2 rounded-md mr-2">
                      <MapPin size={16} className="text-amber-600" />
                    </div>
                    <h4 className="font-medium text-gray-900">Carpenter</h4>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Custom solutions for your home</div>
                  <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded inline-block">4.6 ★ Rated</div>
                </div>
              </div>

              <div className="mt-6 text-center md:text-left">
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                  View All Service Providers <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            <div className="md:w-7/12 order-1 md:order-2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Find Trusted Service Providers</h2>
              <p className="text-lg text-gray-600 mb-6">
                Beyond public infrastructure, we connect you with verified local service providers for your private household needs.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="mt-1 bg-blue-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Verified Professionals</h4>
                    <p className="text-gray-600">Every service provider undergoes background verification and skill certification</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-blue-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Fair Pricing</h4>
                    <p className="text-gray-600">Transparent pricing with no hidden charges or commissions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 bg-blue-100 rounded-full p-1 mr-3">
                    <CheckCircle size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Quality Guarantee</h4>
                    <p className="text-gray-600">Rate and review services, with platform support for dispute resolution</p>
                  </div>
                </div>
              </div>
              
              <button className="px-6 py-3 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition inline-flex items-center">
                Connect with Service Providers <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Citizen Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Voices of Change</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Citizens making a difference in their communities through PeopleVoice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center text-blue-600 font-bold">RP</div>
                <div>
                  <h4 className="font-medium text-gray-900">Raj Patel</h4>
                  <p className="text-sm text-gray-500">Local Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The broken streetlight outside my shop was fixed within a week after reporting it on PeopleVoice. Previously, I'd been calling the municipal office for months with no response."
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full mr-4 flex items-center justify-center text-green-600 font-bold">AM</div>
                <div>
                  <h4 className="font-medium text-gray-900">Anita Mehta</h4>
                  <p className="text-sm text-gray-500">School Teacher</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Our neighborhood park was filled with garbage for months. I reported it on PeopleVoice with photos, and within days, not only was it cleaned, but new waste bins were installed."
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full mr-4 flex items-center justify-center text-purple-600 font-bold">SK</div>
                <div>
                  <h4 className="font-medium text-gray-900">Sanjay Kumar</h4>
                  <p className="text-sm text-gray-500">Senior Citizen</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I hired a plumber through PeopleVoice's private services section. The verified reviews helped me choose the right person, and the work was excellent with transparent pricing."
              </p>
              <div className="flex text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference in Your Community?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of citizens who are transforming their neighborhoods through active participation and real-time issue reporting.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg">
              Download PeopleVoice
            </button>
            <button className="px-8 py-4 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition border border-blue-400">
              Join Our Community
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                  <Zap size={20} />
                </div>
                <h3 className="text-xl font-bold">PeopleVoice</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting citizens and government for transparent, effective community improvement.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.319.64-.599.92-.28.28.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Report Issue</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Service Providers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">User Guidelines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Government Helplines</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Community Forums</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Service Standards</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin size={16} className="text-blue-500 mr-2" />
                  <span className="text-gray-400">123 Community Street, City</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-500 mr-2" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
