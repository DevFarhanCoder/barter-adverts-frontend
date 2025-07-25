// Modified Marketplace.tsx (UPDATED)
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Shield, User, Handshake, X } from 'lucide-react';

interface Listing {
  _id?: string;
  type: string;
  title: string;
  location: string;
  rating: number;
  description: string;
  seeking: string;
  contact: string;
  verified: boolean;
  image: string;
}

interface MarketplaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
}

const Marketplace: React.FC<MarketplaceProps> = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  listings,
  setListings,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newListing, setNewListing] = useState<Listing>({
    type: 'Add Barter',
    title: '',
    location: '',
    rating: 4.5,
    description: '',
    seeking: '',
    contact: '',
    verified: true,
    image: '',
  });

  useEffect(() => {
    fetch('https://barter-adverts-backend.onrender.com/api/barters')
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error('Failed to fetch listings', err));
  }, [setListings]);

  const handleAddListing = async () => {
    try {
      const res = await fetch('https://barter-adverts-backend.onrender.com/api/barters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newListing),
      });
      const data = await res.json();
      if (res.ok) {
        setListings(prev => [...prev, data.barter]);
        setShowModal(false);
        setNewListing({
          type: 'Add Barter',
          title: '',
          location: '',
          rating: 4.5,
          description: '',
          seeking: '',
          contact: '',
          verified: true,
          image: '',
        });
      } else {
        console.error('Error saving listing', data);
      }
    } catch (err) {
      console.error('Error posting listing', err);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === 'All' || listing.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <section id="marketplace" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing barter deals and advertising opportunities
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for barters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                {["All", "Add Barter", "Available Barters"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      if (filter === 'Add Barter') setShowModal(true);
                      else setSelectedFilter(filter);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedFilter === filter ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Popup for Add Barter */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl relative">
                <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold mb-4">Add New Barter</h3>
                <input className="mb-2 w-full border rounded p-2" placeholder="Title" value={newListing.title} onChange={e => setNewListing({ ...newListing, title: e.target.value })} />
                <input className="mb-2 w-full border rounded p-2" placeholder="Location" value={newListing.location} onChange={e => setNewListing({ ...newListing, location: e.target.value })} />
                <textarea className="mb-2 w-full border rounded p-2" placeholder="Description" value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })}></textarea>
                <input className="mb-2 w-full border rounded p-2" placeholder="Seeking" value={newListing.seeking} onChange={e => setNewListing({ ...newListing, seeking: e.target.value })} />
                <input className="mb-2 w-full border rounded p-2" placeholder="Contact Info" value={newListing.contact} onChange={e => setNewListing({ ...newListing, contact: e.target.value })} />
                <button onClick={handleAddListing} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Done
                </button>
              </div>
            </div>
          )}

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing._id || listing.title + listing.contact} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-6xl">📷</div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${listing.type === 'Add Barter' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {listing.type}
                    </span>
                  </div>
                  {listing.verified && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{listing.location}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{listing.description}</p>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">Seeking:</p>
                    <p className="text-sm text-gray-700">{listing.seeking}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{listing.contact}</span>
                    </div>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Marketplace;