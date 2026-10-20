import React, { useState, useEffect, useMemo } from 'react';
import { LanguageProvider, useLanguage, toBengaliNumerals } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { INITIAL_LISTINGS, INITIAL_LEADS } from './data/mirsaraiData';
import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import FilterBar from './components/FilterBar';
import ListingCard from './components/ListingCard';
import TableView from './components/TableView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LeadsManager from './components/LeadsManager';
import PublicPortalView from './components/PublicPortalView';
import ListingModal from './components/ListingModal';
import ListingDetailModal from './components/ListingDetailModal';
import NewLeadModal from './components/NewLeadModal';
import AuthModal from './components/AuthModal';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import { Home, PlusCircle, CheckCircle, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';

function DashboardApp() {
  const { lang, t } = useLanguage();
  const { currentUser, isAdmin, isLandlord, logout } = useAuth();

  // Guest Mode State: if not logged in and not in guest mode, show LoginPage
  const [isGuestMode, setIsGuestMode] = useState(false);

  // 1. Listings State (LocalStorage persisted)
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem('tolet_mirsarai_listings');
      return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  // 2. Leads State (LocalStorage persisted)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('tolet_mirsarai_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  useEffect(() => {
    localStorage.setItem('tolet_mirsarai_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('tolet_mirsarai_leads', JSON.stringify(leads));
  }, [leads]);

  // Tab State: 'listings' | 'table' | 'analytics' | 'leads' | 'public'
  const [currentTab, setCurrentTab] = useState('listings');

  // Filter & Sort State
  const [filters, setFilters] = useState({
    search: '',
    locality: 'all',
    propertyType: 'all',
    tenant: 'all',
    status: 'all',
    bedrooms: 'all',
    minRent: '',
    maxRent: '',
    amenities: []
  });

  const [sortBy, setSortBy] = useState('newest');

  // Modal States
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [detailListing, setDetailListing] = useState(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [leadTargetListing, setLeadTargetListing] = useState(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    setIsGuestMode(false);
    logout();
    showToast(t('logoutSuccess'));
  };

  // CRUD Handlers for Listings
  const handleSaveListing = (listingData) => {
    if (editingListing) {
      setListings((prev) => prev.map((l) => (l.id === listingData.id ? listingData : l)));
      showToast(t('listingUpdated'));
    } else {
      setListings((prev) => [listingData, ...prev]);
      showToast(t('listingCreated'));
    }
    setEditingListing(null);
  };

  const handleDeleteListing = (id) => {
    if (!currentUser) {
      showToast(t('loginRequiredNotice'));
      handleOpenAuth('login');
      return;
    }
    if (window.confirm(t('confirmDelete'))) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast(t('listingDeleted'));
    }
  };

  const handleToggleStatus = (id) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'available' ? 'rented' : 'available';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
    showToast(t('statusUpdated'));
  };

  // CRUD Handlers for Leads
  const handleSaveLead = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
    showToast(t('leadAdded'));
  };

  const handleUpdateLeadStatus = (id, newStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    showToast(t('statusUpdated'));
  };

  const handleDeleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // Reset to Sample Mirsarai Data
  const handleResetData = () => {
    if (window.confirm(t('confirmReset'))) {
      setListings(INITIAL_LISTINGS);
      setLeads(INITIAL_LEADS);
      showToast(lang === 'bn' ? 'মীরসরাই ডেমো ডেটায় রিসেট সম্পন্ন হয়েছে!' : 'Data reset to Mirsarai sample defaults!');
    }
  };

  // Export Data (JSON)
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ listings, leads }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tolet_mirsarai_data_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(t('dataExported'));
  };

  // Filter & Sort Logic
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Search
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const searchTarget = `${item.titleEn} ${item.titleBn} ${item.localityName} ${item.localityNameBn} ${item.address} ${item.addressBn} ${item.ownerName} ${item.ownerPhone}`.toLowerCase();
        if (!searchTarget.includes(query)) return false;
      }

      // 2. Locality
      if (filters.locality !== 'all' && item.localityId !== filters.locality) {
        return false;
      }

      // 3. Property Type
      if (filters.propertyType !== 'all' && item.propertyType !== filters.propertyType) {
        return false;
      }

      // 4. Tenant Preference
      if (filters.tenant !== 'all' && item.tenantPreference !== filters.tenant && item.tenantPreference !== 'anyTenant') {
        return false;
      }

      // 5. Status
      if (filters.status !== 'all' && item.status !== filters.status) {
        return false;
      }

      // 6. Bedrooms
      if (filters.bedrooms !== 'all') {
        if (filters.bedrooms === '4') {
          if (item.bedrooms < 4) return false;
        } else if (String(item.bedrooms) !== filters.bedrooms) {
          return false;
        }
      }

      // 7. Price Range
      if (filters.minRent && Number(item.rentAmount) < Number(filters.minRent)) {
        return false;
      }
      if (filters.maxRent && Number(item.rentAmount) > Number(filters.maxRent)) {
        return false;
      }

      // 8. Amenities
      if (filters.amenities && filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((aId) => item.amenities && item.amenities.includes(aId));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rentLow') return a.rentAmount - b.rentAmount;
      if (sortBy === 'rentHigh') return b.rentAmount - a.rentAmount;
      if (sortBy === 'sizeHigh') return b.sqft - a.sqft;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [listings, filters, sortBy]);

  // Open modal helpers
  const handleOpenEdit = (listing) => {
    if (!currentUser) {
      showToast(t('loginRequiredNotice'));
      handleOpenAuth('login');
      return;
    }
    setEditingListing(listing);
    setIsListingModalOpen(true);
  };

  const handleOpenAdd = () => {
    if (!currentUser) {
      showToast(t('loginRequiredNotice'));
      handleOpenAuth('login');
      return;
    }
    setEditingListing(null);
    setIsListingModalOpen(true);
  };

  const handleInquire = (listing) => {
    setLeadTargetListing(listing);
    setIsNewLeadModalOpen(true);
  };

  // OPENING PAGE CHECK:
  // If user is not logged in and has not entered as guest, show the Opening Login Page!
  if (!currentUser && !isGuestMode) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LoginPage
          onEnterAsGuest={() => setIsGuestMode(true)}
          onSuccess={(msg) => showToast(msg)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Guest Mode Banner (if user skipped login) */}
      {!currentUser && isGuestMode && (
        <div className="bg-slate-900 text-white px-4 py-2 text-xs font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {lang === 'bn' 
                  ? 'আপনি সাধারণ ভিজিটর মোডে আছেন। প্রপার্টি পোস্ট বা সম্পাদনা করতে লগইন করুন।' 
                  : 'You are browsing in Guest Mode. Sign in to add or edit properties.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsGuestMode(false)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{lang === 'bn' ? 'লগইন পেজে ফিরুন' : 'Back to Login Page'}</span>
              </button>
              <button
                onClick={() => handleOpenAuth('login')}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors"
              >
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={handleOpenAdd}
        onResetData={handleResetData}
        onExportData={handleExportData}
        onOpenAuthModal={handleOpenAuth}
        totalListings={listings.length}
        activeLeadsCount={leads.filter((l) => l.status !== 'converted' && l.status !== 'cancelled').length}
      />

      {/* Admin Logged-In Top Status Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white px-4 py-2 text-xs font-medium border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0" />
              <span>
                {lang === 'bn' 
                  ? 'অ্যাডমিন মোড সক্রিয়: আরমান হোসেন (armanhossain.eee.info@gmail.com) • পূর্ণ নিয়ন্ত্রণ ও সম্পাদনার ক্ষমতা'
                  : 'Administrator Mode Active: Engr. Arman Hossain (armanhossain.eee.info@gmail.com) • Full system access'}
              </span>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-md text-[10px] font-bold">
              SUPER ADMIN
            </span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Render Tab Contents */}
        {currentTab === 'listings' && (
          <div className="space-y-6">
            {/* Stat Cards & Quick Filter Chips */}
            <StatsCards
              listings={listings}
              leads={leads}
              filters={filters}
              setFilters={setFilters}
              onSelectLeadTab={() => setCurrentTab('leads')}
            />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              setFilters={setFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalResults={filteredListings.length}
              totalCount={listings.length}
            />

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Home className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {lang === 'bn' ? 'কোনো বাড়ি বা ফ্ল্যাট পাওয়া যায়নি' : 'No properties found'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {lang === 'bn' 
                      ? 'আপনার ফিল্টারের শর্তাবলী শিথিল করুন অথবা নতুন প্রপার্টির বিজ্ঞাপন দিন।' 
                      : 'Try broadening your filter criteria or add a new property listing.'}
                  </p>
                </div>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t('addListing')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((item) => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    onViewDetails={(l) => setDetailListing(l)}
                    onEdit={handleOpenEdit}
                    onDelete={handleDeleteListing}
                    onToggleStatus={handleToggleStatus}
                    onInquire={handleInquire}
                    isPublicView={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {currentTab === 'table' && (
          <div className="space-y-6">
            <StatsCards
              listings={listings}
              leads={leads}
              filters={filters}
              setFilters={setFilters}
              onSelectLeadTab={() => setCurrentTab('leads')}
            />
            <TableView
              listings={listings}
              onViewDetails={(l) => setDetailListing(l)}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteListing}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            listings={listings}
            leads={leads}
          />
        )}

        {currentTab === 'leads' && (
          <LeadsManager
            leads={leads}
            onUpdateStatus={handleUpdateLeadStatus}
            onDeleteLead={handleDeleteLead}
            onOpenNewLeadModal={() => {
              setLeadTargetListing(null);
              setIsNewLeadModalOpen(true);
            }}
            listings={listings}
          />
        )}

        {currentTab === 'public' && (
          <PublicPortalView
            listings={filteredListings}
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onViewDetails={(l) => setDetailListing(l)}
            onInquire={handleInquire}
            onExitPreview={() => setCurrentTab('listings')}
          />
        )}
      </main>

      {/* Global Modals */}
      <ListingModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setEditingListing(null);
        }}
        onSave={handleSaveListing}
        editingListing={editingListing}
      />

      <ListingDetailModal
        listing={detailListing}
        onClose={() => setDetailListing(null)}
        onInquire={handleInquire}
      />

      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => {
          setIsNewLeadModalOpen(false);
          setLeadTargetListing(null);
        }}
        onSave={handleSaveLead}
        listings={listings}
        preselectedListing={leadTargetListing}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Footer */}
      <Footer
        onSelectLocality={(locId) => {
          setFilters((prev) => ({ ...prev, locality: locId }));
          setCurrentTab('listings');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <DashboardApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
