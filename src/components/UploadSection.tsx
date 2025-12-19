import { useState, useCallback } from "react";
import { Upload, Image, X, Loader2, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AnalysisResult {
  disease: string;
  confidence: number;
  severity: string;
  symptoms: string;
  treatment: string;
  prevention: string;
}

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, []);

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-crop', {
        body: { imageBase64: uploadedImage }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      
      if (data.disease === "Healthy") {
        toast({
          title: "Good news!",
          description: "Your crop appears to be healthy.",
        });
      } else if (data.disease !== "Not a crop image" && data.disease !== "Error") {
        toast({
          title: t('upload.diseaseDetected'),
          description: `${data.disease} has been identified in your crop.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setResult(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'high': return 'text-destructive';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section id="scan" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('upload.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('upload.subtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Area */}
            <div className="space-y-4">
              {!uploadedImage ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/5 scale-[1.02]"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {t('upload.dropHere')}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t('upload.orClick')}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {t('upload.supports')}
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
                  <img
                    src={uploadedImage}
                    alt="Uploaded crop"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {!result && (
                    <div className="p-4">
                      <Button
                        variant="hero"
                        className="w-full"
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t('upload.analyzing')}
                          </>
                        ) : (
                          <>
                            <Image className="w-4 h-4" />
                            {t('upload.analyze')}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Area */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                {t('upload.results')}
              </h3>
              
              {!uploadedImage ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('upload.uploadPrompt')}</p>
                </div>
              ) : isAnalyzing ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('upload.aiAnalyzing')}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t('upload.wait')}</p>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  {/* Disease Detection */}
                  <div className={`flex items-start gap-3 p-4 rounded-xl ${
                    result.disease === "Healthy" 
                      ? "bg-success/10 border border-success/20" 
                      : "bg-warning/10 border border-warning/20"
                  }`}>
                    {result.disease === "Healthy" ? (
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold text-foreground">{result.disease}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.disease === "Healthy" ? t('upload.noDisease') : t('upload.diseaseDetected')}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="text-sm text-muted-foreground">{t('upload.confidence')}</div>
                      <div className="font-display text-2xl font-bold text-primary">{result.confidence}%</div>
                    </div>
                    <div className="p-4 rounded-xl bg-accent/50">
                      <div className="text-sm text-muted-foreground">{t('upload.severity')}</div>
                      <div className={`font-display text-2xl font-bold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  {result.symptoms && result.symptoms !== "N/A" && (
                    <div className="p-4 rounded-xl bg-accent/30 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <span className="font-semibold text-foreground text-sm">{t('upload.symptoms')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.symptoms}</p>
                    </div>
                  )}

                  {/* Treatment */}
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="font-semibold text-foreground">{t('upload.treatment')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.treatment}</p>
                  </div>

                  {/* Prevention */}
                  {result.prevention && result.prevention !== "N/A" && (
                    <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-foreground">{t('upload.prevention')}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.prevention}</p>
                    </div>
                  )}

                  {/* Scan Again Button */}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={clearImage}
                  >
                    {t('upload.scanAnother')}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('upload.analyzePrompt')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
