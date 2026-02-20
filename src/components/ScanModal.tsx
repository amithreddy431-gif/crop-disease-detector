import { useState, useCallback, useRef } from "react";
import { Upload, Camera, PenLine, X, Loader2, AlertTriangle, CheckCircle2, Shield, Image, Volume2, VolumeX, Square } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
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

interface ScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScanModal = ({ open, onOpenChange }: ScanModalProps) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'manual'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cropName, setCropName] = useState('');
  const [diseaseName, setDiseaseName] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();

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

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        processImage(file);
      }
    };
    input.click();
  }, []);

  const analyzeImage = async () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-crop', {
        body: { imageBase64: uploadedImage }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

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

  const analyzeManual = async () => {
    if (!cropName || !diseaseName) {
      toast({
        title: "Missing Information",
        description: "Please enter both crop name and disease name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-crop', {
        body: { 
          manualQuery: true,
          cropName,
          diseaseName
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to get disease information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAll = () => {
    setUploadedImage(null);
    setResult(null);
    setCropName('');
    setDiseaseName('');
    stopSpeaking();
  };

  const generateSpeechText = (result: AnalysisResult): string => {
    const langPrefix = language === 'hi' ? 'Hindi:' : language === 'te' ? 'Telugu:' : '';
    const parts = [];
    
    if (result.disease === "Healthy") {
      parts.push(`${langPrefix} Good news! Your crop appears to be healthy. No disease was detected.`);
    } else {
      parts.push(`${langPrefix} Disease detected: ${result.disease}.`);
      parts.push(`Confidence level: ${result.confidence} percent.`);
      parts.push(`Severity: ${result.severity}.`);
      
      if (result.symptoms && result.symptoms !== "N/A") {
        parts.push(`Symptoms: ${result.symptoms}.`);
      }
      
      parts.push(`Treatment: ${result.treatment}.`);
      
      if (result.prevention && result.prevention !== "N/A") {
        parts.push(`Prevention: ${result.prevention}.`);
      }
    }
    
    return parts.join(' ');
  };

  const speakResult = async () => {
    if (!result) return;
    
    setIsLoadingAudio(true);
    
    try {
      const text = generateSpeechText(result);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/text-to-speech`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio.",
          variant: "destructive",
        });
      };
      
      await audio.play();
      setIsSpeaking(true);
      
    } catch (error) {
      console.error('TTS error:', error);
      toast({
        title: "Voice Error",
        description: error instanceof Error ? error.message : "Failed to generate voice.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
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

  const tabs = [
    { id: 'upload' as const, icon: Upload, label: t('upload.dropHere') },
    { id: 'camera' as const, icon: Camera, label: 'Take Photo' },
    { id: 'manual' as const, icon: PenLine, label: 'Manual Entry' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
              <Image className="w-5 h-5 text-primary-foreground" />
            </div>
            {t('upload.title')}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 rounded-xl bg-muted/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); clearAll(); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-soft'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-4">
          {/* Input Area */}
          <div className="space-y-4">
            {activeTab === 'upload' && !uploadedImage && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 min-h-[280px] flex flex-col items-center justify-center ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-accent/30"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
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
            )}

            {activeTab === 'camera' && !uploadedImage && (
              <div className="border-2 border-dashed rounded-2xl p-8 text-center min-h-[280px] flex flex-col items-center justify-center border-border">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Capture Crop Image
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Use your device camera to take a photo
                </p>
                <Button variant="hero" onClick={handleCameraCapture}>
                  <Camera className="w-4 h-4" />
                  Open Camera
                </Button>
              </div>
            )}

            {activeTab === 'manual' && !result && (
              <div className="border-2 border-dashed rounded-2xl p-8 min-h-[280px] flex flex-col justify-center border-border">
                <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mb-4 mx-auto">
                  <PenLine className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
                  Enter Crop & Disease
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Crop Name</label>
                    <Input
                      placeholder="e.g., Tomato, Rice, Wheat..."
                      value={cropName}
                      onChange={(e) => setCropName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Disease Name</label>
                    <Input
                      placeholder="e.g., Leaf Blight, Rust, Mosaic..."
                      value={diseaseName}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={analyzeManual}
                    disabled={isAnalyzing || !cropName || !diseaseName}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting Information...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Get Disease Info
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {uploadedImage && (
              <div className="relative rounded-2xl overflow-hidden bg-card border border-border">
                <img
                  src={uploadedImage}
                  alt="Uploaded crop"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={clearAll}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-background transition-colors"
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
          <div className="bg-card/50 rounded-2xl border border-border p-6 glass">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4">
              {t('upload.results')}
            </h3>
            
            {!uploadedImage && activeTab !== 'manual' ? (
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
              <div className="space-y-3">
                {/* Disease Detection */}
                <div className={`flex items-start gap-3 p-3 rounded-xl ${
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-accent/30 glass">
                    <div className="text-xs text-muted-foreground">{t('upload.confidence')}</div>
                    <div className="font-display text-xl font-bold text-primary">{result.confidence}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-accent/30 glass">
                    <div className="text-xs text-muted-foreground">{t('upload.severity')}</div>
                    <div className={`font-display text-xl font-bold ${getSeverityColor(result.severity)}`}>
                      {result.severity}
                    </div>
                  </div>
                </div>

                {/* Symptoms */}
                {result.symptoms && result.symptoms !== "N/A" && (
                  <div className="p-3 rounded-xl bg-accent/20 border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="font-semibold text-foreground text-sm">{t('upload.symptoms')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.symptoms}</p>
                  </div>
                )}

                {/* Treatment */}
                <div className="p-3 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="font-semibold text-foreground text-sm">{t('upload.treatment')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.treatment}</p>
                </div>

                {/* Prevention */}
                {result.prevention && result.prevention !== "N/A" && (
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground text-sm">{t('upload.prevention')}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.prevention}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={isSpeaking ? "destructive" : "default"}
                    className="flex-1"
                    onClick={isSpeaking ? stopSpeaking : speakResult}
                    disabled={isLoadingAudio}
                  >
                    {isLoadingAudio ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t('upload.reading')}
                      </>
                    ) : isSpeaking ? (
                      <>
                        <Square className="w-4 h-4" />
                        {t('upload.stopReading')}
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        {t('upload.readAloud')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={clearAll}
                  >
                    {t('upload.scanAnother')}
                  </Button>
                </div>
              </div>
            ) : activeTab === 'manual' ? (
              <div className="text-center py-12 text-muted-foreground">
                <PenLine className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter crop and disease name to get information</p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t('upload.analyzePrompt')}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanModal;
