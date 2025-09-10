import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeftIcon,
  QrCodeIcon,
  PuzzlePieceIcon,
  TrophyIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon
} from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

// Mock quest data
const mockQuests: { [key: string]: any } = {
  '1': {
    id: 1,
    title: 'Escanear no Estádio',
    description: 'Escaneie o QR code oficial no Morumbi durante o jogo',
    longDescription: 'Use a câmera do seu dispositivo para escanear o QR code especial que estará disponível nas dependências do estádio. Esta missão só pode ser completada durante o dia do jogo.',
    type: 'SCAN_QR',
    xpReward: 100,
    timeLeft: '2h 30m',
    icon: QrCodeIcon,
    difficulty: 'Fácil',
    available: true,
    requirements: ['Estar no estádio', 'Dia do jogo'],
    tips: ['Procure os QR codes nas entradas', 'Certifique-se de que há boa iluminação']
  },
  '2': {
    id: 2,
    title: 'Palpite do Placar',
    description: 'Qual será o placar de SPFC x Palmeiras?',
    longDescription: 'Faça seu palpite para o resultado do clássico. Acerte o placar exato e ganhe XP extra!',
    type: 'PREDICTION',
    xpReward: 75,
    timeLeft: '1d 4h',
    icon: TrophyIcon,
    difficulty: 'Médio',
    available: true,
    requirements: ['Antes do jogo começar'],
    tips: ['Considere o histórico recente', 'Palpites ousados valem mais XP']
  },
  '3': {
    id: 3,
    title: 'Quiz Relâmpago',
    description: 'Pergunta sobre a história do SPFC',
    longDescription: 'Teste seus conhecimentos sobre o clube do coração! Uma pergunta rápida sobre a rica história tricolor.',
    type: 'QUIZ',
    xpReward: 50,
    timeLeft: '45m',
    icon: PuzzlePieceIcon,
    difficulty: 'Fácil',
    available: true,
    requirements: ['Nenhum'],
    tips: ['Lembre-se dos títulos importantes', 'Ídolos históricos são sempre tema']
  }
};

const mockQuizQuestion = {
  question: "Em que ano o São Paulo conquistou sua primeira Libertadores?",
  options: ["1989", "1991", "1992", "1993"],
  correctAnswer: 2, // Index of correct answer (1992)
  explanation: "O São Paulo conquistou sua primeira Libertadores em 1992, vencendo o Newell's Old Boys na final."
};

export default function QuestDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { authenticated } = usePrivy();
  const [quest, setQuest] = useState<any>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'scanner' | 'quiz' | 'prediction' | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [predictionScore, setPredictionScore] = useState({ home: 0, away: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      router.push('/');
      return;
    }

    if (id && typeof id === 'string') {
      const questData = mockQuests[id];
      if (questData) {
        setQuest(questData);
      } else {
        router.push('/home');
      }
    }
  }, [authenticated, id, router]);

  const handleStartQuest = () => {
    if (!quest) return;

    setOverlayType(quest.type.toLowerCase().includes('scan') ? 'scanner' : 
                   quest.type.toLowerCase().includes('quiz') ? 'quiz' : 
                   quest.type.toLowerCase().includes('prediction') ? 'prediction' : null);
    setShowOverlay(true);

    if (quest.type === 'SCAN_QR') {
      startCamera();
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast.error('Erro ao acessar a câmera');
      setShowOverlay(false);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate successful QR scan after 2 seconds
    setTimeout(() => {
      completeQuest();
    }, 2000);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    
    setShowQuizResult(true);
    
    setTimeout(() => {
      if (quizAnswer === mockQuizQuestion.correctAnswer) {
        completeQuest();
      } else {
        completeQuest(Math.floor(quest.xpReward * 0.5)); // Half XP for wrong answer
      }
    }, 2000);
  };

  const handlePredictionSubmit = () => {
    completeQuest();
  };

  const completeQuest = async (customXP?: number) => {
    setIsCompleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const xpGained = customXP || quest.xpReward;
      
      stopCamera();
      setShowOverlay(false);
      
      toast.success(`Prova registrada! +${xpGained} XP`);
      
      // Simulate XP animation and redirect
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao completar missão');
      setIsCompleting(false);
    }
  };

  const closeOverlay = () => {
    stopCamera();
    setShowOverlay(false);
    setOverlayType(null);
    setQuizAnswer(null);
    setShowQuizResult(false);
  };

  if (!quest) {
    return (
      <div className="min-h-screen bg-spfc-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spfc-red"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{quest.title} · Tricolor Pass</title>
      </Head>

      <main className="min-h-screen bg-spfc-dark text-white">
        {/* Header */}
        <header className="bg-spfc-gray-100 border-b border-spfc-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/home')}
                className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-semibold">Detalhes da Missão</h1>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quest Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spfc-gray-100 rounded-lg p-8 mb-8"
          >
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-spfc-red/20 rounded-lg flex items-center justify-center">
                <quest.icon className="h-8 w-8 text-spfc-red" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{quest.title}</h1>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-spfc-red">+{quest.xpReward} XP</p>
                    <p className="text-sm text-gray-400">Recompensa</p>
                  </div>
                </div>
                
                <p className="text-lg text-gray-300 mb-4">{quest.description}</p>
                
                <div className="flex items-center space-x-4">
                  <span className="bg-spfc-gray-200 px-3 py-1 rounded text-sm">
                    {quest.difficulty}
                  </span>
                  <span className="text-sm text-gray-400">
                    Tempo restante: {quest.timeLeft}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quest Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
          >
            {/* Description */}
            <div className="md:col-span-2 bg-spfc-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Descrição</h2>
              <p className="text-gray-300 mb-6">{quest.longDescription}</p>
              
              <h3 className="text-lg font-semibold mb-3">Requisitos</h3>
              <ul className="space-y-2 mb-6">
                {quest.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {req}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold mb-3">Dicas</h3>
              <ul className="space-y-2">
                {quest.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="text-spfc-red mr-2">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Panel */}
            <div className="bg-spfc-gray-100 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Iniciar Missão</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">XP</span>
                  <span className="text-spfc-red font-semibold">+{quest.xpReward}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Dificuldade</span>
                  <span>{quest.difficulty}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Tipo</span>
                  <span className="capitalize">{quest.type.replace('_', ' ')}</span>
                </div>
              </div>

              <button
                onClick={handleStartQuest}
                disabled={isCompleting}
                className="w-full bg-spfc-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isCompleting ? 'Processando...' : 'Começar'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Overlay */}
        <AnimatePresence>
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-spfc-gray-100 rounded-lg p-6 w-full max-w-md"
              >
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={closeOverlay}
                    className="p-2 hover:bg-spfc-gray-200 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Scanner Overlay */}
                {overlayType === 'scanner' && (
                  <div className="text-center">
                    <CameraIcon className="h-12 w-12 text-spfc-red mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Scanner QR Code</h3>
                    
                    {isScanning && (
                      <div className="mb-4">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full rounded-lg bg-black"
                          style={{ maxHeight: '300px' }}
                        />
                      </div>
                    )}
                    
                    <p className="text-gray-400 mb-6">
                      Posicione o QR code dentro da área de escaneamento
                    </p>
                    
                    {/* Simulate scan button for demo */}
                    <button
                      onClick={simulateQRScan}
                      className="bg-spfc-red hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Simular Escaneamento
                    </button>
                  </div>
                )}

                {/* Quiz Overlay */}
                {overlayType === 'quiz' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Quiz Tricolor</h3>
                    
                    {!showQuizResult ? (
                      <div>
                        <p className="text-lg mb-6">{mockQuizQuestion.question}</p>
                        
                        <div className="space-y-3 mb-6">
                          {mockQuizQuestion.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => setQuizAnswer(index)}
                              className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                                quizAnswer === index
                                  ? 'border-spfc-red bg-spfc-red/20'
                                  : 'border-spfc-gray-200 hover:border-spfc-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        
                        <button
                          onClick={handleQuizSubmit}
                          disabled={quizAnswer === null}
                          className="w-full bg-spfc-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors"
                        >
                          Confirmar Resposta
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          quizAnswer === mockQuizQuestion.correctAnswer
                            ? 'bg-green-500/20'
                            : 'bg-red-500/20'
                        }`}>
                          <CheckCircleIcon className={`h-8 w-8 ${
                            quizAnswer === mockQuizQuestion.correctAnswer
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`} />
                        </div>
                        
                        <h4 className="text-lg font-semibold mb-2">
                          {quizAnswer === mockQuizQuestion.correctAnswer ? 'Correto!' : 'Resposta Incorreta'}
                        </h4>
                        
                        <p className="text-gray-400 mb-4">{mockQuizQuestion.explanation}</p>
                        
                        <p className="text-spfc-red font-semibold">
                          +{quizAnswer === mockQuizQuestion.correctAnswer ? quest.xpReward : Math.floor(quest.xpReward * 0.5)} XP
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Prediction Overlay */}
                {overlayType === 'prediction' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Seu Palpite</h3>
                    
                    <div className="text-center mb-6">
                      <p className="text-lg mb-4">SPFC vs Palmeiras</p>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-2">SPFC</p>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={predictionScore.home}
                            onChange={(e) => setPredictionScore(prev => ({ ...prev, home: parseInt(e.target.value) || 0 }))}
                            className="w-16 h-16 text-2xl text-center bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg"
                          />
                        </div>
                        
                        <span className="text-2xl font-bold">X</span>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-400 mb-2">Palmeiras</p>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={predictionScore.away}
                            onChange={(e) => setPredictionScore(prev => ({ ...prev, away: parseInt(e.target.value) || 0 }))}
                            className="w-16 h-16 text-2xl text-center bg-spfc-gray-200 border border-spfc-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handlePredictionSubmit}
                      className="w-full bg-spfc-red hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                    >
                      Confirmar Palpite
                    </button>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
