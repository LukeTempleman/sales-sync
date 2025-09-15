import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, FileText, Video, Mail, Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const faqs = [
  {
    id: 1,
    question: 'How do I create a new visit?',
    answer: 'To create a new visit, navigate to the "New Visit" page from your dashboard. Select the visit type (consumer or shop), fill in the required information, and submit the form. Make sure to capture all required photos and information during your visit.'
  },
  {
    id: 2,
    question: 'How do I view my assigned goals?',
    answer: 'You can view your assigned goals on the "Goals" page accessible from your dashboard. This page displays all your daily, weekly, monthly, and quarterly goals along with their progress and deadlines.'
  },
  {
    id: 3,
    question: 'What is a call cycle?',
    answer: 'A call cycle is a recurring schedule of locations/visits assigned to you to ensure coverage of your territory. Your manager creates and assigns call cycles, which you can view in the "Call Cycles" section. Each cycle includes specific locations you need to visit within a defined timeframe.'
  },
  {
    id: 4,
    question: 'How do I complete a shelf analysis?',
    answer: 'During a shop visit, you\'ll be prompted to take a photo of the product shelf. After uploading the photo, you\'ll see a grid overlay tool. Mark the quadrants occupied by your brand\'s products, and the system will automatically calculate the shelf share percentage.'
  },
  {
    id: 5,
    question: 'How do I update my profile information?',
    answer: 'You can update your profile information by navigating to the "Profile" page from the sidebar or user menu. Click on "Edit Profile," make your changes, and save them. You can update your name, contact information, and password from this page.'
  },
  {
    id: 6,
    question: 'What should I do if I can\'t complete a scheduled visit?',
    answer: 'If you can\'t complete a scheduled visit, you should notify your team leader as soon as possible. You can also mark the visit as "Cancelled" in your visit history and provide a reason for cancellation. This helps maintain accurate records and allows for rescheduling if necessary.'
  },
  {
    id: 7,
    question: 'How do I view my visit history?',
    answer: 'Your visit history is available on the "Visit History" page accessible from your dashboard. This page displays all your past visits, including details such as date, location, visit type, and status. You can filter and search through your history to find specific visits.'
  },
  {
    id: 8,
    question: 'How are my performance metrics calculated?',
    answer: 'Your performance metrics are calculated based on various factors including completed visits, conversion rates, goal achievement, call cycle adherence, and shelf share improvements. These metrics are updated in real-time and displayed on your dashboard for easy tracking.'
  }
];

const HelpPage = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-gray-500 mt-2">
            Find answers to common questions and learn how to use Sales-sync
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Documentation
              </CardTitle>
              <CardDescription>
                Browse our comprehensive documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Documentation</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="mr-2 h-5 w-5 text-blue-600" />
                Video Tutorials
              </CardTitle>
              <CardDescription>
                Watch step-by-step video guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Watch Tutorials</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-left font-medium focus:outline-none"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span>{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="p-4 bg-gray-50 border-t">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-4 text-gray-500">No results found for "{searchQuery}"</p>
                <Button 
                  variant="link" 
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-blue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Get help via email within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  support@sales-sync.com
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-blue-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>
                  Available Monday-Friday, 9am-5pm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  +1 (555) 123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;