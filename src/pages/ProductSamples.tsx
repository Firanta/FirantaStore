import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Code2, Eye } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

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

const ProductSamples = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const snapshot = await getDocs(collection(db, "samples"));
        const samplesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Sample[];
        
        // You can sort or randomize here if needed
        setSamples(samplesList);
      } catch (error) {
        console.error("Error fetching samples:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSamples();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative mesh-gradient">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Sampel Produk
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6">
              Karya-Karya Kami yang Menginspirasi
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Lihat portofolio lengkap produk-produk kami yang telah dikembangkan untuk klien 
              di berbagai industri. Setiap project adalah hasil kolaborasi dan dedikasi tim kami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: "Proyek Selesai", value: "150+" },
              { label: "Klien Puas", value: "98%" },
              { label: "Tim Developer", value: "25+" },
              { label: "Tahun Berpengalaman", value: "8+" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-sm uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Samples Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <p className="text-muted-foreground">Memuat portofolio...</p>
              </div>
            ) : samples.length === 0 ? (
              <div className="col-span-full flex justify-center py-20">
                <p className="text-muted-foreground">Belum ada portofolio yang ditambahkan.</p>
              </div>
            ) : (
              samples.map((sample, i) => (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl overflow-hidden glass glow-border hover:glow-border-primary transition-all duration-500 flex flex-col h-full"
              >
                {/* Preview */}
                <div className={`relative h-56 bg-gradient-to-br ${sample.color} overflow-hidden flex items-center justify-center`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <Code2 className="w-10 h-10 text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">{sample.category}</p>
                  </div>

                  {/* Hover Action Buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                      href={sample.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      Live Demo
                    </a>
                    <a
                      href={sample.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer"
                    >
                      <Code2 className="w-4 h-4" />
                      Source
                    </a>
                  </div>

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                      {sample.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {sample.description}
                    </p>
                  </div>

                  {/* Tech Stack */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {sample.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <a
                    href={sample.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm font-medium cursor-pointer"
                  >
                    Lihat Demo <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Teknologi
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient">
              Tech Stack Terdepan
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Kami menggunakan teknologi terbaru untuk memastikan performa optimal dan scalability.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Firebase", "Node.js", "PostgreSQL", "AWS"].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-xl p-4 text-center border border-primary/20 hover:border-primary/50 transition-colors duration-300"
              >
                <p className="font-semibold text-foreground">{tech}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative mesh-gradient">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Ingin Membuat Produk Serupa?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Mari kita diskusikan visi Anda. Tim kami siap membantu mewujudkan ide brilian Anda 
              menjadi kenyataan digital yang luar biasa.
            </p>
            <Button size="lg" className="rounded-full">
              Hubungi Kami Sekarang
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductSamples;
