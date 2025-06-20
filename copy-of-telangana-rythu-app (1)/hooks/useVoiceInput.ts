import { useState, useCallback, useEffect, useRef } from 'react';

// Interface for the SpeechRecognition instance
interface CustomSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend?: () => void;
}

// Interface for the SpeechRecognition constructor
interface SpeechRecognitionStatic {
  new(): CustomSpeechRecognition;
}

// Extend Window interface to include SpeechRecognition constructors
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionStatic;
    webkitSpeechRecognition?: SpeechRecognitionStatic;
  }
  // Define more specific types for events if not globally available
  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }
}


interface UseVoiceInputResult {
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
  isSupported: boolean;
  resetTranscript: () => void;
}

const useVoiceInput = (lang: string = 'te-IN'): UseVoiceInputResult => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<CustomSpeechRecognition | null>(null);
  
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSupported || !SpeechRecognitionAPI) { // Added !SpeechRecognitionAPI check for type safety
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognitionInstance: CustomSpeechRecognition = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false; // Stop after first phrase
    recognitionInstance.interimResults = false; // Only final results
    recognitionInstance.lang = lang;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript);
      setIsListening(false); // Stop listening after result
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognitionInstance;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, isSupported, SpeechRecognitionAPI]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && isSupported) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e: any) {
        setError(`Could not start recognition: ${e.message}`);
        setIsListening(false);
      }
    }
  }, [isListening, isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening && isSupported) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening, isSupported]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { transcript, isListening, startListening, stopListening, error, isSupported, resetTranscript };
};

export default useVoiceInput;