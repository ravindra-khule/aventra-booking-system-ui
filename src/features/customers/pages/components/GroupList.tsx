import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  BarChart3,
  Download,
  ChevronDown,
  Tag,
  Users,
} from 'lucide-react';
import { CustomerGroup } from '../../types/group.types';
import { CustomerGroupService } from '../../services/group.service';
import { GroupForm } from './GroupForm';
import { GroupAnalyticsDialog } from './GroupAnalytics';
import { BulkActionsDialog } from './BulkActions';
import styles from '../styles/GroupList.module.css';

interface GroupListProps {
  onRefresh?: () => void;
}

// Helper function to generate CSV
const generateCSV = (exportData: any): string => {
  const headers = ['Name', 'Email', 'Total Spent', 'Booking Count'];
  const rows = exportData.members.map((m: any) => [
    m.name,
    m.email,
    m.totalSpent,
    m.bookingCount,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
};

// Helper function to download CSV
const downloadCSV = (csv: string, filename: string) => {
  const link = document.createElement('a');
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  link.download = filename;
  link.click();
};

export const GroupList: React.FC<GroupListProps> = ({ onRefresh }) => {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<CustomerGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [analyticsGroup, setAnalyticsGroup] = useState<CustomerGroup | null>(null);
  const [bulkActionsOpen, setBulkActionsOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await CustomerGroupService.getAll();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await CustomerGroupService.search(query);
      setFilteredGroups(results);
    } else {
      setFilteredGroups(groups);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupId)) {
      newSelected.delete(groupId);
    } else {
      newSelected.add(groupId);
    }
    setSelectedGroups(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedGroups.size === filteredGroups.length) {
      setSelectedGroups(new Set());
    } else {
      setSelectedGroups(new Set(filteredGroups.map((g) => g.id)));
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await CustomerGroupService.delete(groupId);
      loadGroups();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleExportGroup = async (groupId: string) => {
    try {
      const exportData = await CustomerGroupService.exportGroup(groupId);
      const csv = generateCSV(exportData);
      downloadCSV(csv, `${exportData.groupName}_members.csv`);
    } catch (error) {
      console.error('Failed to export group:', error);
    }
  };

  const handleFormClose = () => {
    setFormDialogOpen(false);
    setEditingGroup(null);
  };

  const handleFormSubmit = async () => {
    loadGroups();
    handleFormClose();
    if (onRefresh) onRefresh();
  };

  const handleBulkActionsClose = () => {
    setBulkActionsOpen(false);
    loadGroups();
    setSelectedGroups(new Set());
  };

  return (
    <div className={styles['group-list']}>
      {/* Header */}
      <div className={styles['group-list-header']}>
        <div className={styles['header-title']}>
          <h2>Customer Groups</h2>
          <p>Manage customer segments and groups</p>
        </div>
        <div className={styles['header-actions']}>
          {selectedGroups.size > 0 && (
            <button
              className={`${styles.btn} ${styles['btn-secondary']}`}
              onClick={() => setBulkActionsOpen(true)}
            >
              Bulk Actions ({selectedGroups.size})
            </button>
          )}
          <button
            className={`${styles.btn} ${styles['btn-primary']}`}
            onClick={() => {
              setEditingGroup(null);
              setFormDialogOpen(true);
            }}
          >
            <Plus size={18} />
            New Group
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles['group-list-search']}>
        <Search size={18} className={styles['search-icon']} />
        <input
          type="text"
          placeholder="Search groups by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles['search-input']}
        />
      </div>

      {/* Groups Table */}
      <div className={styles['group-list-container']}>
        {loading ? (
          <div className={styles.loading}>Loading groups...</div>
        ) : filteredGroups.length === 0 ? (
          <div className={styles['empty-state']}>
            <Users size={48} />
            <h3>No customer groups yet</h3>
            <p>Create your first customer group to get started</p>
            <button
              className={`${styles.btn} ${styles['btn-primary']}`}
              onClick={() => {
                setEditingGroup(null);
                setFormDialogOpen(true);
              }}
            >
              <Plus size={18} />
              Create Group
            </button>
          </div>
        ) : (
          <div className={styles['group-table']}>
            <div className={styles['table-header']}>
              <div className={`${styles.cell} ${styles.checkbox}`}>
                <input
                  type="checkbox"
                  checked={
                    filteredGroups.length > 0 &&
                    selectedGroups.size === filteredGroups.length
                  }
                  onChange={handleSelectAll}
                />
              </div>
              <div className={`${styles.cell} ${styles.name}`}>Name</div>
              <div className={`${styles.cell} ${styles.type}`}>Type</div>
              <div className={`${styles.cell} ${styles.members}`}>Members</div>
              <div className={`${styles.cell} ${styles.tags}`}>Tags</div>
              <div className={`${styles.cell} ${styles.status}`}>Status</div>
              <div className={`${styles.cell} ${styles.actions}`}>Actions</div>
            </div>

            {filteredGroups.map((group) => (
              <div key={group.id} className={styles['table-row']}>
                <div className={`${styles.cell} ${styles.checkbox}`}>
                  <input
                    type="checkbox"
                    checked={selectedGroups.has(group.id)}
                    onChange={() => handleSelectGroup(group.id)}
                  />
                </div>

                <div className={`${styles.cell} ${styles.name}`}>
                  <div className={styles['group-name-info']}>
                    <div
                      className={styles['color-badge']}
                      style={{ backgroundColor: group.color || '#3B82F6' }}
                      title={group.color}
                    />
                    <div>
                      <div className={styles['group-name']}>{group.name}</div>
                      {group.description && (
                        <div className={styles['group-description']}>
                          {group.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.type}`}>
                  <span className={`${styles.badge} ${styles[`badge-${group.type}`]}`}>
                    {group.type === 'manual' ? 'Manual' : 'Smart'}
                  </span>
                </div>

                <div className={`${styles.cell} ${styles.members}`}>
                  <span className={styles['member-count']}>{group.memberCount}</span>
                </div>

                <div className={`${styles.cell} ${styles.tags}`}>
                  <div className={styles['tags-container']}>
                    {group.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className={styles.tag}>
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                    {group.tags.length > 2 && (
                      <span className={styles['tag-more']}>
                        +{group.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`${styles.cell} ${styles.status}`}>
                  <span
                    className={`${styles.status} ${styles[group.isActive ? 'active' : 'inactive']}`}
                  >
                    {group.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className={`${styles.cell} ${styles.actions}`}>
                  <div className={styles['action-buttons']}>
                    <button
                      className={styles['action-btn']}
                      title="View Analytics"
                      onClick={() => setAnalyticsGroup(group)}
                    >
                      <BarChart3 size={16} />
                    </button>
                    <button
                      className={styles['action-btn']}
                      title="Edit Group"
                      onClick={() => {
                        setEditingGroup(group);
                        setFormDialogOpen(true);
                      }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className={styles['action-btn']}
                      title="Export Members"
                      onClick={() => handleExportGroup(group.id)}
                    >
                      <Download size={16} />
                    </button>
                    <div className={styles.dropdown}>
                      <button className={styles['action-btn']} title="More options">
                        <ChevronDown size={16} />
                      </button>
                      <div className={styles['dropdown-menu']}>
                        <button
                          onClick={() => setDeleteConfirm(group.id)}
                          className={styles['delete-option']}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {deleteConfirm === group.id && (
                    <div className={styles['delete-confirm']}>
                      <p>Delete this group?</p>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-sm']}`}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className={`${styles.btn} ${styles['btn-secondary']} ${styles['btn-sm']}`}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {formDialogOpen && (
        <GroupForm
          group={editingGroup}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      {analyticsGroup && (
        <GroupAnalyticsDialog
          group={analyticsGroup}
          onClose={() => setAnalyticsGroup(null)}
        />
      )}

      {bulkActionsOpen && (
        <BulkActionsDialog
          groupIds={Array.from(selectedGroups)}
          onClose={handleBulkActionsClose}
        />
      )}
    </div>
  );
};
