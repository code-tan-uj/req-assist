'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ApplicationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (selection: ApplicationSelection) => void;
  title?: string;
}

export interface ApplicationSelection {
  applicationName: string;
  categoryDomain: string;
  moduleSubDomain: string;
  functionalComponent: string;
}

const APPLICATIONS = [
  'Core Banking System',
  'Payment Gateway',
  'Customer Portal',
  'Mobile Banking App',
  'Risk Management Platform',
  'Loan Origination System',
  'Wealth Management Suite',
  'Insurance Claims System',
];

const CATEGORIES = [
  'Banking',
  'Insurance',
  'Payments',
  'Investment',
  'Lending',
  'Risk & Compliance',
  'Customer Experience',
  'Operations',
];

const MODULES = [
  'Account Management',
  'Transaction Processing',
  'User Authentication',
  'Reporting & Analytics',
  'Notification Services',
  'Integration Layer',
  'Admin Console',
  'API Gateway',
];

const COMPONENTS = [
  'Login Module',
  'Dashboard',
  'User Profile',
  'Transaction History',
  'Settings Panel',
  'Search Functionality',
  'Export Module',
  'Audit Trail',
];

export default function ApplicationSelectionModal({
  isOpen,
  onClose,
  onProceed,
  title = 'Select Application',
}: ApplicationSelectionModalProps) {
  const [applicationName, setApplicationName] = useState('');
  const [categoryDomain, setCategoryDomain] = useState('');
  const [moduleSubDomain, setModuleSubDomain] = useState('');
  const [functionalComponent, setFunctionalComponent] = useState('');

  const [showAppDropdown, setShowAppDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showModuleDropdown, setShowModuleDropdown] = useState(false);
  const [showComponentDropdown, setShowComponentDropdown] = useState(false);

  const filteredApps = APPLICATIONS.filter((app) =>
    app.toLowerCase().includes(applicationName.toLowerCase())
  );
  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(categoryDomain.toLowerCase())
  );
  const filteredModules = MODULES.filter((mod) =>
    mod.toLowerCase().includes(moduleSubDomain.toLowerCase())
  );
  const filteredComponents = COMPONENTS.filter((comp) =>
    comp.toLowerCase().includes(functionalComponent.toLowerCase())
  );

  const handleProceed = () => {
    if (!applicationName.trim()) return;
    
    onProceed({
      applicationName,
      categoryDomain,
      moduleSubDomain,
      functionalComponent,
    });
    
    // Reset form
    setApplicationName('');
    setCategoryDomain('');
    setModuleSubDomain('');
    setFunctionalComponent('');
  };

  const isValid = applicationName.trim().length > 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-end p-4 pb-0">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-red-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 pt-2 space-y-5">
            {/* Application Name - Required */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Select Application Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  onFocus={() => setShowAppDropdown(true)}
                  onBlur={() => setTimeout(() => setShowAppDropdown(false), 200)}
                  placeholder="Search Application Name"
                  className="w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-all bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {showAppDropdown && filteredApps.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 shadow-lg z-10 max-h-48 overflow-y-auto bg-white">
                  {filteredApps.map((app) => (
                    <button
                      key={app}
                      onMouseDown={() => {
                        setApplicationName(app);
                        setShowAppDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm text-gray-800"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category/Domain */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Category/Domain
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={categoryDomain}
                  onChange={(e) => setCategoryDomain(e.target.value)}
                  onFocus={() => setShowCategoryDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                  placeholder="Search Category/Domain"
                  className="w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-all bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {showCategoryDropdown && filteredCategories.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 shadow-lg z-10 max-h-48 overflow-y-auto bg-white">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat}
                      onMouseDown={() => {
                        setCategoryDomain(cat);
                        setShowCategoryDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm text-gray-800"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Module/Sub domain */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Module/Sub domain
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={moduleSubDomain}
                  onChange={(e) => setModuleSubDomain(e.target.value)}
                  onFocus={() => setShowModuleDropdown(true)}
                  onBlur={() => setTimeout(() => setShowModuleDropdown(false), 200)}
                  placeholder="Search Module/Sub domain"
                  className="w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-all bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {showModuleDropdown && filteredModules.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 shadow-lg z-10 max-h-48 overflow-y-auto bg-white">
                  {filteredModules.map((mod) => (
                    <button
                      key={mod}
                      onMouseDown={() => {
                        setModuleSubDomain(mod);
                        setShowModuleDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm text-gray-800"
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Functional Component */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2 text-gray-800">
                Functional Component
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={functionalComponent}
                  onChange={(e) => setFunctionalComponent(e.target.value)}
                  onFocus={() => setShowComponentDropdown(true)}
                  onBlur={() => setTimeout(() => setShowComponentDropdown(false), 200)}
                  placeholder="Search Functional Component"
                  className="w-full px-4 py-3 pr-10 rounded-xl border outline-none transition-all bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
                />
                <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {showComponentDropdown && filteredComponents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-gray-200 shadow-lg z-10 max-h-48 overflow-y-auto bg-white">
                  {filteredComponents.map((comp) => (
                    <button
                      key={comp}
                      onMouseDown={() => {
                        setFunctionalComponent(comp);
                        setShowComponentDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors text-sm text-gray-800"
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Proceed Button */}
            <motion.button
              whileHover={{ scale: isValid ? 1.02 : 1 }}
              whileTap={{ scale: isValid ? 0.98 : 1 }}
              onClick={handleProceed}
              disabled={!isValid}
              className="w-full py-3.5 rounded-full font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: isValid
                  ? 'linear-gradient(135deg, #9d7cc4 0%, #c4a0e8 50%, #e8c4f0 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
              }}
            >
              PROCEED
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
