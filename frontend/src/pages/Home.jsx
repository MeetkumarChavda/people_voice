import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
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
  Camera,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('public');
  const [issueCount, setIssueCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'gu', name: 'ગુજરાતી' }
  ];

  const changeLanguage = (languageCode) => {
    i18n.changeLanguage(languageCode);
    setLanguageMenuOpen(false);
  };
  
  //Counter Effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (issueCount < 1250) setIssueCount(prev => Math.min(prev + 15, 1250));
      if (resolvedCount < 1048) setResolvedCount(prev => Math.min(prev + 12, 1048));
      if (userCount < 3500) setUserCount(prev => Math.min(prev + 40, 3500));
    }, 30);

    return () => clearInterval(interval);
  }, [issueCount, resolvedCount, userCount]);

  // Categories 
  const categories = [
    { name: t('categories.publicIssues.infrastructure.name'), icon: <Building className="h-6 w-6" />, description: t('categories.publicIssues.infrastructure.description') },
    { name: t('categories.publicIssues.publicSafety.name'), icon: <Shield className="h-6 w-6" />, description: t('categories.publicIssues.publicSafety.description') },
    { name: t('categories.publicIssues.environment.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.publicIssues.environment.description') },
    { name: t('categories.publicIssues.transportation.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.publicIssues.transportation.description') },
    { name: t('categories.publicIssues.govtServices.name'), icon: <FileText className="h-6 w-6" />, description: t('categories.publicIssues.govtServices.description') },
    { name: t('categories.publicIssues.socialWelfare.name'), icon: <Users className="h-6 w-6" />, description: t('categories.publicIssues.socialWelfare.description') }
  ];

  // private services
  const privateServices = [
    { name: t('categories.privateServices.plumber.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.privateServices.plumber.description') },
    { name: t('categories.privateServices.electrician.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.privateServices.electrician.description') },
    { name: t('categories.privateServices.painter.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.privateServices.painter.description') },
    { name: t('categories.privateServices.doctor.name'), icon: <MapPin className="h-6 w-6" />, description: t('categories.privateServices.doctor.description') }
  ];

  // Process steps with better descriptions
  const processSteps = [
    {
      title: t('process.steps.report.title'),
      description: t('process.steps.report.description'),
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: t('process.steps.review.title'),
      description: t('process.steps.review.description'),
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      title: t('process.steps.track.title'),
      description: t('process.steps.track.description'),
      icon: <BarChart2 className="h-6 w-6" />
    },
    {
      title: t('process.steps.resolve.title'),
      description: t('process.steps.resolve.description'),
      icon: <Award className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Home | People Voice</title>
        <meta name="description" content="Welcome to People Voice - Share your voice and connect with others" />
      </Helmet>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <Zap size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PeopleVoice</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-800 font-medium hover:text-blue-600 transition">{t('nav.home')}</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">{t('nav.howItWorks')}</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">{t('nav.reportIssue')}</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">{t('nav.services')}</a>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition">{t('nav.aboutUs')}</a>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-500 transition"
                >
                  <Globe size={20} className="mr-2" />
                  <span>{languages.find(lang => lang.code === i18n.language)?.name || 'English'}</span>
                </button>
                
                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/login" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-medium">
                {t('nav.login')}
              </Link>
              <Link to="/signup" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
                {t('nav.signup')}
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
                <a href="#" className="text-gray-800 font-medium hover:text-blue-600 transition">{t('nav.home')}</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">{t('nav.howItWorks')}</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">{t('nav.reportIssue')}</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">{t('nav.services')}</a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition">{t('nav.aboutUs')}</a>
                
                {/* Language Selector for Mobile */}
                <div className="py-2">
                  <div className="text-sm text-gray-500 mb-2">Select Language</div>
                  <div className="space-y-2">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          i18n.language === language.code
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {language.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-3">
                  <Link to="/login" className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition font-medium">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium">
                    {t('nav.signup')}
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
                {t('hero.title')} <span className="text-blue-200">{t('hero.highlight')}</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-lg">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition shadow-lg">
                  {t('hero.reportButton')}
                </button>
                <button className="px-8 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition border border-blue-400">
                  {t('hero.findServices')}
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
              <p className="text-gray-600 font-medium">{t('stats.issuesReported')}</p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center shadow-sm transform transition hover:scale-105 hover:shadow-md">
              <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-green-600 mb-2">{resolvedCount.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">{t('stats.issuesResolved')}</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-sm transform transition hover:scale-105 hover:shadow-md">
              <div className="bg-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-4xl font-bold text-purple-600 mb-2">{userCount.toLocaleString()}</h3>
              <p className="text-gray-600 font-medium">{t('stats.activeCitizens')}</p>
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
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'public' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:text-blue-600 cursor-pointer'}`}
                onClick={() => setActiveTab('public')}
              >
                Public Issues
              </button>
              <button 
                className={`px-6 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'private' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:text-blue-600 cursor-pointer'}`}
                onClick={() => setActiveTab('private')}
              >
                Private Services
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {activeTab === 'public' ? (
              categories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:border-blue-100 transition cursor-pointer">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.description}</p>
                </div>
              ))
            ) : (
              privateServices.map((service, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:border-blue-100 transition cursor-pointer">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    {service.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              ))
            )}
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

   {/* Feature Highlights Section */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Explore the innovative tools that make PeopleVoice a comprehensive community solution.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Reporting</h3>
        <p className="text-gray-600">
          Document community issues with photos and location data for faster resolution by local authorities.
        </p>
      </div>
      
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Service Providers</h3>
        <p className="text-gray-600">
          Connect with trusted local professionals through our secure verification system.
        </p>
      </div>
      
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Forums</h3>
        <p className="text-gray-600">
          Discuss local initiatives and share ideas with neighbors to build stronger communities.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Interactive Dashboard Preview Section */}
<section className="py-20 bg-gradient-to-b from-white to-blue-50">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Left side content */}
      <div className="lg:w-2/5">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Community at a Glance</h2>
        <p className="text-xl text-gray-600 mb-8">
          Access real-time insights about your neighborhood through our intuitive dashboard.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Analytics Overview</h3>
              <p className="text-gray-600">Track resolved issues and response times in your area.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Community Mapping</h3>
              <p className="text-gray-600">Visualize issue hotspots and service coverage in your neighborhood.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Priority Indicators</h3>
              <p className="text-gray-600">Identify which community issues need the most urgent attention.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side dashboard preview */}
      <div className="lg:w-3/5 relative">
        <div className="bg-white rounded-xl shadow-xl p-6 relative z-10">
          <div className="bg-blue-600 rounded-t-lg p-4 flex justify-between items-center">
            <h4 className="text-white font-medium">Community Dashboard</h4>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Active Issues</h5>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">24</span>
                <span className="text-sm text-green-600 pb-1">↓ 12%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Avg. Resolution Time</h5>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">3.2d</span>
                <span className="text-sm text-green-600 pb-1">↓ 0.8d</span>
              </div>
            </div>
            
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-2">Issue Categories</h5>
              <div className="flex justify-between mt-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">35%</span>
              </div>
              <div className="flex justify-between mt-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">25%</span>
              </div>
              <div className="flex justify-between mt-2">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div className="bg-yellow-500 h-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-sm text-gray-600 ml-3 whitespace-nowrap">20%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <h5 className="text-sm font-medium text-gray-500 mb-3">Recent Activity</h5>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-700">Pothole on Main St. - <span className="text-green-600">Resolved</span></span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-700">Park Cleanup - <span className="text-yellow-600">In Progress</span></span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-700">Streetlight Outage - <span className="text-blue-600">Assigned</span></span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-200 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
      </div>
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
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white transition">Home</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition">How It Works</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition">Report Issue</a></li>
                <li><a href="/" className="text-gray-400 hover:text-white transition">Service Providers</a></li>
              </ul>
            </div>
            
           
            
            <div>
              <h4 className="text-lg font-medium mb-4">Contact Us</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MapPin size={16} className="text-blue-500 mr-2" />
                  <span className="text-gray-400">Team EngageX</span>
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
