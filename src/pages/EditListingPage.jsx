import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/Admin_components/ui/Button';
import { Input } from '@/components/Admin_components/ui/Input';
import { Label } from '@/components/Admin_components/ui/Label';
import { Textarea } from '@/components/Admin_components/ui/Textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Admin_components/ui/Select';
import ImageUploadDropzone from '@/components/ImageUploadDropzone';

function EditProductForm({
  product,
  user,
  editHook,
  onSave,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    isSaving,
    categories,
    loadingCategories,
  } = editHook;

  const images = watch('images', []);
  const status = watch('status', 'active');
  const categoryId = watch('category_id');

  const isAdmin = user?.user_role === 'admin' || user?.user_role === 'super_admin';

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">
          ชื่อสินค้า <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          {...register('title', { required: 'กรุณากรอกชื่อสินค้า' })}
          placeholder="เช่น iPhone 15 Pro Max 256GB"
          disabled={isSaving}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          รายละเอียด <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          {...register('description', { required: 'กรุณากรอกรายละเอียด' })}
          placeholder="อธิบายสภาพสินค้า คุณสมบัติ และข้อมูลที่สำคัญ"
          rows={6}
          disabled={isSaving}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price">
            ราคา (บาท) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'กรุณากรอกราคา',
              min: { value: 0, message: 'ราคาต้องมากกว่าหรือเท่ากับ 0' },
            })}
            placeholder="0.00"
            disabled={isSaving}
          />
          {errors.price && (
            <p className="text-sm text-red-500">{errors.price.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category_id">
            หมวดหมู่ <span className="text-red-500">*</span>
          </Label>
          <Select
            value={categoryId}
            onValueChange={(value) => setValue('category_id', value)}
            disabled={isSaving || loadingCategories}
          >
            <SelectTrigger>
              <SelectValue placeholder={loadingCategories ? "กำลังโหลด..." : "เลือกหมวดหมู่"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category.category_id}
                  value={category.category_id.toString()}
                >
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-red-500">{errors.category_id.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">สถานที่</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="เช่น กรุงเทพมหานคร"
          disabled={isSaving}
        />
      </div>

      {/* Status (Admin Only) */}
      {isAdmin && (
        <div className="space-y-2">
          <Label htmlFor="status">
            สถานะ <span className="text-red-500">*</span>
          </Label>
          <Select
            value={status}
            onValueChange={(value) => setValue('status', value)}
            disabled={isSaving}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">เปิดใช้งาน</SelectItem>
              <SelectItem value="pending">รอตรวจสอบ</SelectItem>
              <SelectItem value="sold">ขายแล้ว</SelectItem>
              <SelectItem value="rejected">ปฏิเสธ</SelectItem>
              <SelectItem value="deleted">ลบแล้ว</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Images - UploadThing */}
      <div className="space-y-2">
        <Label>
          รูปภาพสินค้า <span className="text-red-500">*</span>
        </Label>
        
        {/* UploadThing Dropzone */}
        <ImageUploadDropzone
          maxImages={18}
          initialImages={images}
          onImagesChange={(uploadedImages) => {
            // แปลง format จาก ImageUploadDropzone เป็น array of URLs
            const imageUrls = uploadedImages.map(img => img.url || img);
            setValue('images', imageUrls);
          }}
          onUploadError={(error) => {
            console.error('Upload error:', error);
            // อาจจะแสดง toast error ที่นี่
          }}
          disabled={isSaving}
        />
        
        <p className="text-xs text-muted-foreground">
          กรุณาใส่รูปภาพสินค้าอย่างน้อย 1 รูป (สูงสุด 18 รูป)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSaving}
          className="flex-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              บันทึกการแก้ไข
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="w-4 h-4 mr-2" />
          ยกเลิก
        </Button>
      </div>
    </form>
  );
}

export default EditProductForm;