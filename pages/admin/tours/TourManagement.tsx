import React, { useEffect, useState } from 'react';
import { Tour, TourStatus, TourDifficulty, TourCategory, TourTag } from '../../../src/features/tours/types/tour.types';
import { TourService } from '../../../src/features/tours/services/tour.service';
import { TourCard, TourFilters, TourStatusBadge, TourDetailPanel, TourCreateModal } from '../../../src/features/tours/components';
import { 
  Search, Plus, Grid, List, Download, Upload, Settings, 
  Eye, Edit2, Copy, Trash2, MoreVertical, MapPin, Calendar,
  Users, DollarSign, TrendingUp, Star, Tag, Folder
} from 'lucide-react';
import { Button } from '../../../src/shared/components/ui';
import { formatCurrency, formatDate } from '../../../src/shared/utils';
import { useToast } from '../../../src/shared/context/ToastContext';
import { useTranslation } from 'react-i18next';

type ViewMode = 'grid' | 'list';

export const TourManagement: React.FC = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<TourCategory[]>([]);
  const [tags, setTags] = useState<TourTag[]>([]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    totalRevenue: 0,
    totalBookings: 0
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [toursData, categoriesData, tagsData] = await Promise.all([
        TourService.getAll(),
        TourService.getCategories(),
        TourService.getTags()
      ]);
      setTours(toursData);
      setCategories(categoriesData);
      setTags(tagsData);
      
      // Calculate stats
      const stats = {
        total: toursData.length,
        active: toursData.filter(t => t.status === TourStatus.ACTIVE).length,
        draft: toursData.filter(t => t.status === TourStatus.DRAFT).length,
        totalRevenue: toursData.reduce((sum, t) => sum + (t.revenue || 0), 0),
        totalBookings: toursData.reduce((sum, t) => sum + (t.totalBookings || 0), 0)
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch tours:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = tours;

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.location.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(t => t.status === statusFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'ALL') {
      result = result.filter(t => t.difficulty === difficultyFilter);
    }

    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(t => t.categories.includes(categoryFilter));
    }

    setFilteredTours(result);
  }, [search, statusFilter, difficultyFilter, categoryFilter, tours]);

  const handleView = (tour: Tour) => {
    setSelectedTour(tour);
  };

  const handleEdit = (tour: Tour) => {
    setSelectedTour(tour);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (updatedTour: Tour) => {
    try {
      await TourService.update(updatedTour.id, updatedTour);
      setTours(prev => prev.map(t => t.id === updatedTour.id ? updatedTour : t));
      setIsEditModalOpen(false);
      setSelectedTour(null);
      toast.success('Tour updated successfully!');
    } catch (error) {
      console.error('Failed to update tour:', error);
      toast.error('Failed to update tour. Please try again.');
    }
  };

  const handleDuplicate = async (tour: Tour) => {
    try {
      await TourService.duplicate(tour.id);
      await fetchData();
      toast.success(`Tour "${tour.title}" has been duplicated successfully!`);
    } catch (error) {
      console.error('Failed to duplicate tour:', error);
      toast.error('Failed to duplicate tour. Please try again.');
    }
  };

  const handleDelete = async (tour: Tour) => {
    if (window.confirm(`Are you sure you want to delete "${tour.title}"?`)) {
      try {
        await TourService.delete(tour.id);
        await fetchData();
        if (selectedTour?.id === tour.id) {
          setSelectedTour(null);
        }
        toast.success('Tour deleted successfully!');
      } catch (error) {
        console.error('Failed to delete tour:', error);
        toast.error('Failed to delete tour. Please try again.');
      }
    }
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (newTour: Tour) => {
    try {
      const createdTour = await TourService.create(newTour);
      setTours(prev => [createdTour, ...prev]);
      setIsCreateModalOpen(false);
      toast.success(`Tour "${newTour.title}" created successfully!`);
    } catch (error) {
      console.error('Failed to create tour:', error);
      toast.error('Failed to create tour. Please try again.');
    }
  };

  const clearFilters = () => {
    setStatusFilter('ALL');
    setDifficultyFilter('ALL');
    setCategoryFilter('ALL');
    setSearch('');
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{t('admin:loadingTours')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('admin:tourManagementTitle')}</h1>
            <p className="text-gray-500 mt-1">{t('admin:manageTourPackagesPricing')}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              icon={<Download className="h-4 w-4" />}
              onClick={() => alert('Export functionality to be implemented')}
            >
              {t('admin:export')}
            </Button>
            <Button 
              variant="primary" 
              icon={<Plus className="h-4 w-4" />}
              onClick={handleCreateNew}
            >
              {t('admin:createTour')}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('admin:totalToursCount')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Folder className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('admin:activeToursCount')}</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('admin:draftToursCount')}</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Edit2 className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('admin:toursTotalBookings')}</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalBookings}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{t('admin:toursTotalRevenue')}</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-4 space-y-4">
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                placeholder={t('admin:searchToursPlaceholder')}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={t('admin:tourGridView')}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={t('admin:tourListView')}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <TourFilters 
            statusFilter={statusFilter}
            difficultyFilter={difficultyFilter}
            categoryFilter={categoryFilter}
            onStatusChange={setStatusFilter}
            onDifficultyChange={setDifficultyFilter}
            onCategoryChange={setCategoryFilter}
            onClear={clearFilters}
            categories={categories}
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        {t('admin:showingToursOf')} {filteredTours.length} {t('admin:ofCommunications')} {tours.length} {t('admin:toursText')}
      </div>

      {/* Tours Display */}
      {filteredTours.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-2">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('admin:noToursFound')}</h3>
          <p className="text-gray-500">{t('admin:tryAdjustingSearchFilters')}</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map(tour => (
            <TourCard
              key={tour.id}
              tour={tour}
              onView={handleView}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:tourTableHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:locationHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:statusHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:difficultyHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:priceHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:capacityHeader')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin:bookingsHeader')}</th>
                  <th className="relative px-6 py-3"><span className="sr-only">{t('admin:actions')}</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTours.map(tour => (
                  <tr key={tour.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={tour.imageUrl} 
                          alt={tour.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                          <div className="text-xs text-gray-500">{tour.durationDays} days</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tour.location}</div>
                      <div className="text-xs text-gray-500">{tour.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TourStatusBadge status={tour.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tour.difficulty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(tour.price)}</div>
                      <div className="text-xs text-gray-500">Deposit: {formatCurrency(tour.depositPrice)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tour.availableSpots} / {tour.maxCapacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tour.totalBookings || 0}</div>
                      {tour.revenue && tour.revenue > 0 && (
                        <div className="text-xs text-gray-500">{formatCurrency(tour.revenue)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleView(tour)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(tour)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Edit"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(tour)}
                          className="text-green-600 hover:text-green-900"
                          title="Duplicate"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tour)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tour Detail Panel (view only) */}
      {selectedTour && !isEditModalOpen && (
        <TourDetailPanel
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onUpdate={() => {}}
          categories={categories}
          tags={tags}
        />
      )}

      {/* Edit Tour Modal (same as Create Tour) */}
      {isEditModalOpen && selectedTour && (
        <TourCreateModal
          isOpen={isEditModalOpen}
          categories={categories}
          tags={tags}
          onClose={() => { setIsEditModalOpen(false); setSelectedTour(null); }}
          onSubmit={handleUpdate}
          initialTour={selectedTour}
        />
      )}

      {/* Tour Create Modal */}
      <TourCreateModal
        isOpen={isCreateModalOpen}
        categories={categories}
        tags={tags}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};
