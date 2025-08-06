import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Edit, Save, Plus } from "lucide-react";
import { toast } from "sonner";

interface WebsiteSetting {
  id: number;
  key: string;
  value: string;
  type: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SettingFormData {
  key: string;
  value: string;
  type: string;
  description: string;
}

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<WebsiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSettingId, setEditingSettingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SettingFormData>({
    key: "",
    value: "",
    type: "text",
    description: ""
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/website-settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setFormData({
      key: "",
      value: "",
      type: "text",
      description: ""
    });
    setEditingSettingId(null);
  };

  const handleEditSetting = (setting: WebsiteSetting) => {
    setFormData({
      key: setting.key,
      value: setting.value,
      type: setting.type,
      description: setting.description || ""
    });
    setEditingSettingId(setting.id);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        description: formData.description || null
      };

      let response;
      if (editingSettingId) {
        // Update existing setting
        response = await fetch(`/api/website-settings/${formData.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: formData.value })
        });
      } else {
        // Create new setting
        response = await fetch("/api/website-settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save setting");
      }

      toast.success(editingSettingId ? "Setting updated successfully" : "Setting created successfully");
      resetForm();
      setShowForm(false);
      fetchSettings();
    } catch (error) {
      console.error("Error saving setting:", error);
      toast.error("Failed to save setting");
    }
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  const renderSettingValue = (setting: WebsiteSetting) => {
    switch (setting.type) {
      case "boolean":
        return setting.value === "true" ? "Yes" : "No";
      case "json":
        try {
          const jsonObj = JSON.parse(setting.value);
          return <span className="font-mono text-xs">{JSON.stringify(jsonObj, null, 2)}</span>;
        } catch {
          return setting.value;
        }
      case "url":
        return (
          <a 
            href={setting.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {setting.value}
          </a>
        );
      default:
        return setting.value;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Settings</h2>
        <Button 
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2"
        >
          {showForm ? "Cancel" : <><Plus className="h-4 w-4" /> Add Setting</>}
        </Button>
      </div>

      {showForm && (
        <Card className="border border-slate-200 shadow-md">
          <CardHeader>
            <CardTitle>{editingSettingId ? "Edit Setting" : "Add New Setting"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Key *</Label>
                  <Input
                    id="key"
                    name="key"
                    value={formData.key}
                    onChange={handleInputChange}
                    placeholder="setting_key"
                    required
                    disabled={!!editingSettingId}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={handleSelectChange}
                    disabled={!!editingSettingId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Value *</Label>
                {formData.type === "boolean" ? (
                  <Select 
                    value={formData.value} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : formData.type === "json" ? (
                  <Textarea
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder='{"key": "value"}'
                    required
                    className="font-mono text-sm"
                    rows={5}
                  />
                ) : (
                  <Input
                    id="value"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="Setting value"
                    required
                    type={formData.type === "color" ? "color" : "text"}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe what this setting controls"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSettingId ? "Update Setting" : "Create Setting"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-8">Loading settings...</div>
      ) : settings.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No settings found. Create your first website setting.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {settings.map((setting) => (
            <Card key={setting.id} className="border border-slate-200">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{setting.key}</h3>
                        {setting.description && <p className="text-slate-600 text-sm">{setting.description}</p>}
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-800">
                          {setting.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium text-slate-700">Value:</div>
                      <div className="mt-1">{renderSettingValue(setting)}</div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex items-center gap-1"
                        onClick={() => handleEditSetting(setting)}
                      >
                        <Edit className="h-4 w-4" /> Edit
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