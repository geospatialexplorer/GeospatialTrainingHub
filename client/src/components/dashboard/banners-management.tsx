import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash, Plus, Image, Link, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  linkText: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BannerFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  isActive: boolean;
  displayOrder: number;
}

export default function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    subtitle: "",
    imageUrl: "",
    linkUrl: "",
    linkText: "",
    isActive: true,
    displayOrder: 0
  });

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      if (!response.ok) {
        throw new Error("Failed to fetch banners");
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      linkUrl: "",
      linkText: "",
      isActive: true,
      displayOrder: 0
    });
    setEditingBannerId(null);
  };

  const handleEditBanner = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || "",
      linkText: banner.linkText || "",
      isActive: banner.isActive,
      displayOrder: banner.displayOrder
    });
    setEditingBannerId(banner.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        subtitle: formData.subtitle || null,
        linkUrl: formData.linkUrl || null,
        linkText: formData.linkText || null
      };

      let response;
      if (editingBannerId) {
        // Update existing banner
        response = await fetch(`/api/banners/${editingBannerId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // Create new banner
        response = await fetch("/api/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save banner");
      }

      toast.success(editingBannerId ? "Banner updated successfully" : "Banner created successfully");
      resetForm();
      setShowForm(false);
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete banner");
      }

      toast.success("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Banner Management</h2>
        <Button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2"
        >
          {showForm ? "Cancel" : <><Plus className="h-4 w-4" /> Add Banner</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>{editingBannerId ? "Edit Banner" : "Add New Banner"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Banner Title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Banner Subtitle (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="flex items-center gap-2">
                  <Image className="h-4 w-4" /> Image URL *
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkUrl" className="flex items-center gap-2">
                    <Link className="h-4 w-4" /> Link URL
                  </Label>
                  <Input
                    id="linkUrl"
                    name="linkUrl"
                    value={formData.linkUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/page"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkText">Link Text</Label>
                  <Input
                    id="linkText"
                    name="linkText"
                    value={formData.linkText}
                    onChange={handleInputChange}
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    name="displayOrder"
                    type="number"
                    value={formData.displayOrder.toString()}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="flex items-center space-x-2 h-full pt-8">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBannerId ? "Update Banner" : "Create Banner"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading banners...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No banners found. Create your first banner to display in the carousel.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className={`border ${banner.isActive ? 'border-green-200' : 'border-slate-200'}`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/4 h-40 bg-slate-100 rounded-md overflow-hidden">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{banner.title}</h3>
                        {banner.subtitle && <p className="text-slate-600">{banner.subtitle}</p>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-slate-500">
                      <p>Display Order: {banner.displayOrder}</p>
                      {banner.linkUrl && (
                        <p className="truncate">Link: {banner.linkUrl} {banner.linkText ? `(${banner.linkText})` : ''}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleEditBanner(banner)}
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}