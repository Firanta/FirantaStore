import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Code2, Eye, ExternalLink } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Sample {
  id?: string;
  title: string;
  description: string;
  category: string;
  tech: string[];
  color: string;
  liveUrl: string;
  codeUrl: string;
}

export default function AdminSamples() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState<Sample>({
    title: "",
    description: "",
    category: "",
    tech: [],
    color: "from-blue-500/20 to-purple-500/20",
    liveUrl: "#",
    codeUrl: "#"
  });

  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    setIsLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "samples"));
      const samplesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sample[];

      setSamples(samplesList);
      setFilteredSamples(samplesList);
    } catch (error) {
      console.error("Error fetching samples:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...samples];
    if (searchTerm) {
      filtered = filtered.filter(
        (sample) =>
          sample.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sample.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSamples(filtered);
  }, [searchTerm, samples]);

  const handleOpenModal = (sample?: Sample) => {
    if (sample) {
      setFormData(sample);
      setIsEditing(true);
    } else {
      setFormData({
        title: "",
        description: "",
        category: "",
        tech: [],
        color: "from-blue-500/20 to-purple-500/20",
        liveUrl: "#",
        codeUrl: "#"
      });
      setIsEditing(false);
    }
    setTechInput("");
    setShowModal(true);
  };

  const handleAddTech = () => {
    if (techInput.trim() && !formData.tech.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech: [...formData.tech, techInput.trim()]
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setFormData({
      ...formData,
      tech: formData.tech.filter(t => t !== techToRemove)
    });
  };

  const handleSave = async () => {
    try {
      if (isEditing && formData.id) {
        const docRef = doc(db, "samples", formData.id);
        const { id, ...dataToSave } = formData;
        await updateDoc(docRef, dataToSave as any);
        alert("Sampel berhasil diupdate");
      } else {
        const { id, ...dataToSave } = formData;
        await addDoc(collection(db, "samples"), dataToSave);
        alert("Sampel berhasil ditambahkan");
      }
      setShowModal(false);
      fetchSamples();
    } catch (error) {
      console.error("Error saving sample:", error);
      alert("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus sampel ini?")) return;
    try {
      await deleteDoc(doc(db, "samples", id));
      alert("Sampel berhasil dihapus");
      fetchSamples();
    } catch (error) {
      console.error("Error deleting sample:", error);
      alert("Gagal menghapus sampel");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading portfolio samples...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Portofolio (Sampel)</h1>
            <p className="text-gray-600 mt-1">Kelola daftar sampel website dan produk</p>
          </div>
          <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Plus size={18} />
            Tambah Sampel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Cari berdasarkan nama atau kategori..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.length > 0 ? (
            filteredSamples.map((sample) => (
              <Card key={sample.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
                <div className={`h-40 bg-gradient-to-br ${sample.color} flex items-center justify-center relative group`}>
                  <Code2 className="w-12 h-12 text-white/50" />
                </div>
                <CardContent className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{sample.category}</span>
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mt-1">{sample.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{sample.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {sample.tech.slice(0, 3).map(t => (
                      <span key={t} className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">{t}</span>
                    ))}
                    {sample.tech.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-600">+{sample.tech.length - 3}</span>
                    )}
                  </div>

                  <div className="mt-auto flex gap-2 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleOpenModal(sample)}
                    >
                      <Edit size={16} className="mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(sample.id!)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500">
              <p>Belum ada data portofolio di database.</p>
              <p className="text-sm mt-2">Data awal di halaman frontend mungkin masih menggunakan hardcode.</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10 border-b pb-4">
                <CardTitle>{isEditing ? "Edit Sampel" : "Tambah Sampel Baru"}</CardTitle>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:bg-gray-100 p-1 rounded-md">✕</button>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul Portofolio</label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Contoh: Aplikasi E-Commerce" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Input 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    placeholder="Contoh: Web App" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Deskripsi Singkat</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Ceritakan tentang proyek ini..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tech Stack</label>
                  <div className="flex gap-2 mb-2">
                    <Input 
                      value={techInput} 
                      onChange={e => setTechInput(e.target.value)} 
                      placeholder="Contoh: React, Tailwind..." 
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                    />
                    <Button onClick={handleAddTech} type="button" variant="secondary">Tambah</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                        {t}
                        <button onClick={() => handleRemoveTech(t)} className="hover:text-blue-950 font-bold ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Live URL (Preview)</label>
                    <Input 
                      value={formData.liveUrl} 
                      onChange={e => setFormData({...formData, liveUrl: e.target.value})} 
                      placeholder="https://..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Code/Github URL</label>
                    <Input 
                      value={formData.codeUrl} 
                      onChange={e => setFormData({...formData, codeUrl: e.target.value})} 
                      placeholder="https://github.com/..." 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gradient Class (Tailwind)</label>
                  <Input 
                    value={formData.color} 
                    onChange={e => setFormData({...formData, color: e.target.value})} 
                    placeholder="from-blue-500/20 to-purple-500/20" 
                  />
                  <p className="text-xs text-gray-500">Gunakan class gradient dari Tailwind, misal: from-red-500/20 to-orange-500/20</p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                    Simpan Portofolio
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
