import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function useEditListing(productId, initialData) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialData || {},
  });

  // Load categories when entering edit mode
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoriesAPI.getCategories();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดหมวดหมู่ได้',
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Enter edit mode
  const startEditing = async () => {
    setIsEditing(true);
    await loadCategories();

    // Reset form with current product data
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        location: initialData.location || '',
        category_id: initialData.category_id?.toString(),
        images: initialData.images || [],
        status: initialData.status,
      });
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    reset(initialData);
  };

  // Save changes
  const saveChanges = async (data, user, refetch) => {
    try {
      setIsSaving(true);

      const updateData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        location: data.location,
        categoryId: parseInt(data.category_id),
        images: data.images,
      };

      // Check if user is admin
      const isAdmin = user?.user_role === 'admin' || user?.user_role === 'super_admin';

      // If admin, include status in update
      if (isAdmin) {
        updateData.status = data.status;
      }

      // Update listing
      await listingsAPI.updateListing(productId, updateData);

      toast({
        title: 'บันทึกสำเร็จ',
        description: 'แก้ไขประกาศเรียบร้อยแล้ว',
      });

      setIsEditing(false);

      // Refetch product data
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    isEditing,
    isSaving,
    categories,
    loadingCategories,
    isDirty,

    // Form
    register,
    handleSubmit,
    setValue,
    watch,
    errors,

    // Actions
    startEditing,
    cancelEditing,
    saveChanges,
  };
}
