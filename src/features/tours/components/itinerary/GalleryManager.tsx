/**
 * Gallery Manager - Manage photos for itinerary days
 */

import React, { useState } from 'react';
import { GalleryImage } from '../../types/itinerary.types';
import { Button } from '../../../../shared/components/ui';
import { Plus, X, Save, Trash2 } from 'lucide-react';
import styles from './GalleryManager.module.css';

interface GalleryManagerProps {
  images: GalleryImage[];
  onSave: (images: GalleryImage[]) => void;
  onCancel: () => void;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  images,
  onSave,
  onCancel
}) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(images);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    alt: '',
    caption: '',
    photographer: ''
  });

  const addImage = () => {
    if (!formData.url.trim() || !formData.alt.trim()) {
      alert('Please enter image URL and alt text');
      return;
    }

    const newImage: GalleryImage = {
      id: Math.random().toString(36).substr(2, 9),
      url: formData.url,
      alt: formData.alt,
      caption: formData.caption || undefined,
      photographer: formData.photographer || undefined,
      tags: []
    };

    setGalleryImages([...galleryImages, newImage]);
    setFormData({ url: '', alt: '', caption: '', photographer: '' });
    setShowForm(false);
  };

  const removeImage = (id: string) => {
    setGalleryImages(galleryImages.filter(img => img.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>Manage Photos</h4>
      </div>

      {showForm ? (
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label>Image URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className={styles.input}
              placeholder="https://..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Alt Text *</label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
              className={styles.input}
              placeholder="Describe the image"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Caption (optional)</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className={styles.input}
              placeholder="Photo caption"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Photographer (optional)</label>
            <input
              type="text"
              value={formData.photographer}
              onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
              className={styles.input}
              placeholder="Credit the photographer"
            />
          </div>

          <div className={styles.formActions}>
            <Button
              onClick={() => setShowForm(false)}
              variant="ghost"
              size="sm"
              icon={<X className="h-4 w-4" />}
            >
              Cancel
            </Button>
            <Button
              onClick={addImage}
              variant="primary"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
            >
              Add Photo
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          className={styles.addButton}
        >
          Add Photo
        </Button>
      )}

      {galleryImages.length === 0 ? (
        <p className={styles.empty}>No photos added</p>
      ) : (
        <div className={styles.gallery}>
          {galleryImages.map((image) => (
            <div key={image.id} className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                <img src={image.url} alt={image.alt} />
                <button
                  onClick={() => removeImage(image.id)}
                  className={styles.deleteButton}
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className={styles.imageInfo}>
                <p className={styles.alt}>{image.alt}</p>
                {image.caption && <p className={styles.caption}>{image.caption}</p>}
                {image.photographer && <p className={styles.photographer}>© {image.photographer}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button onClick={onCancel} variant="ghost">
          Cancel
        </Button>
        <Button onClick={() => onSave(galleryImages)} variant="primary" icon={<Save className="h-4 w-4" />}>
          Save Photos
        </Button>
      </div>
    </div>
  );
};
