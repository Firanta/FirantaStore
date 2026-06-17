import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Template {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  demoUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Template>>({});

  const categories = ["wedding", "portfolio", "birthday", "anniversary", "event"];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "templates"));
      const templatesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Template[];

      setTemplates(templatesList);
      setFilteredTemplates(templatesList);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...templates];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((template) => template.category === categoryFilter);
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, categoryFilter, templates]);

  /* ─── Open form modal ─── */
  const openAddModal = () => {
    setSelectedTemplate(null);
    setIsEditing(false);
    setFormData({
      name: "",
      price: 0,
      category: "",
      description: "",
      imageUrl: "",
      demoUrl: "",
    });
    setShowFormModal(true);
  };

  const openEditModal = (template: Template) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setFormData({
      name: template.name,
      price: template.price,
      category: template.category,
      description: template.description || "",
      imageUrl: template.imageUrl || "",
      demoUrl: template.demoUrl || "",
    });
    setShowDetailsModal(false);
    setShowFormModal(true);
  };

  /* ─── Save (add or update) ─── */
  const handleSave = async () => {
    // Validation
    if (!formData.name?.trim()) {
      alert("Nama template harus diisi");
      return;
    }
    if (!formData.category) {
      alert("Kategori harus dipilih");
      return;
    }
    if (!formData.price || formData.price <= 0) {
      alert("Harga harus lebih dari 0");
      return;
    }

    setIsSaving(true);

    try {
      if (isEditing && selectedTemplate) {
        // Update existing
        const templateRef = doc(db, "templates", selectedTemplate.id);
        await updateDoc(templateRef, {
          name: formData.name,
          price: Number(formData.price) || 0,
          category: formData.category,
          description: formData.description || "",
          imageUrl: formData.imageUrl || "",
          demoUrl: formData.demoUrl || "",
          updatedAt: new Date(),
        });
        alert("Template berhasil diupdate");
      } else {
        // Add new
        await addDoc(collection(db, "templates"), {
          name: formData.name,
          price: Number(formData.price) || 0,
          category: formData.category,
          description: formData.description || "",
          imageUrl: formData.imageUrl || "",
          demoUrl: formData.demoUrl || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        alert("Template berhasil ditambahkan");
      }

      setShowFormModal(false);
      setShowDetailsModal(false);
      fetchTemplates(); // Re-fetch to get updated data
    } catch (error) {
      console.error("Error saving template:", error);
      alert(isEditing ? "Gagal mengupdate template" : "Gagal menambahkan template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus template ini?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "templates", templateId));
      setTemplates(templates.filter((template) => template.id !== templateId));
      alert("Template berhasil dihapus");
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Gagal menghapus template");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Template</h1>
            <p className="text-gray-600 mt-1">Kelola template dan desain yang tersedia</p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            onClick={openAddModal}
          >
            <Plus size={18} />
            Template Baru
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder="Cari nama template..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center justify-end">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold text-gray-900">{filteredTemplates.length}</span> template
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                {/* Template Image */}
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden">
                  {template.imageUrl ? (
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-blue-100 to-blue-50">
                      <span className="text-blue-400 font-semibold">No Image</span>
                    </div>
                  )}
                </div>

                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 line-clamp-1">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{template.category}</p>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {(Number(template.price) || 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  {template.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                  )}

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowDetailsModal(true);
                      }}
                    >
                      <Eye size={16} />
                      Lihat
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => openEditModal(template)}
                    >
                      <Edit size={16} />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center h-96">
              <p className="text-gray-500">Tidak ada template ditemukan</p>
            </div>
          )}
        </div>

        {/* Template Details Modal */}
        {showDetailsModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Detail Template</CardTitle>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTemplate.imageUrl && (
                  <img
                    src={selectedTemplate.imageUrl}
                    alt={selectedTemplate.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Template</p>
                    <p className="font-semibold text-gray-900">{selectedTemplate.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Kategori</p>
                    <p className="capitalize text-gray-900">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Harga</p>
                    <p className="text-xl font-bold text-gray-900">
                      Rp {(Number(selectedTemplate.price) || 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID Template</p>
                    <p className="font-mono text-xs text-gray-600 break-all">{selectedTemplate.id}</p>
                  </div>
                  {selectedTemplate.demoUrl && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Live Preview (Demo)</p>
                      <a
                        href={selectedTemplate.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all text-sm font-medium"
                      >
                        {selectedTemplate.demoUrl} ↗
                      </a>
                    </div>
                  )}
                </div>

                {selectedTemplate.description && (
                  <div>
                    <p className="text-sm text-gray-600">Deskripsi</p>
                    <p className="text-gray-900">{selectedTemplate.description}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Tutup
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => openEditModal(selectedTemplate)}
                  >
                    Edit Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add / Edit Form Modal */}
        {showFormModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b pb-4">
                <CardTitle>{isEditing ? "Edit Template" : "Tambah Template Baru"}</CardTitle>
                <button
                  onClick={() => setShowFormModal(false)}
                  className="text-gray-500 hover:bg-gray-100 p-1 rounded-md"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nama Template *</label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Contoh: Elegant Wedding Theme"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Harga (Rp) *</label>
                    <Input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                      }
                      placeholder="150000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kategori *</label>
                    <Select
                      value={formData.category || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL Gambar</label>
                  <Input
                    value={formData.imageUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">URL Live Preview (Demo Link)</label>
                  <Input
                    value={formData.demoUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, demoUrl: e.target.value })
                    }
                    placeholder="https://wedding-elegant.firanta.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Deskripsikan template ini..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowFormModal(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Menyimpan..."
                      : isEditing
                        ? "Simpan Perubahan"
                        : "Tambah Template"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
