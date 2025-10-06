import React, { useState, useEffect } from 'react';
import { getMitreExplanation } from '../services/geminiService';
import Loader from './Loader';

interface MitreExplanationProps {
  term: string;
  type: 'tactic' | 'technique';
}

const MitreExplanation: React.FC<MitreExplanationProps> = ({ term, type }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchExplanation = async () => {
      setIsLoading(true);
      try {
        const result = await getMitreExplanation(term, type);
        if (isMounted) {
          setExplanation(result);
        }
      } catch (error) {
        if (isMounted) {
          setExplanation('Could not load explanation.');
        }
        console.error('Failed to get MITRE explanation:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [term, type]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center gap-2 p-1">
            <Loader size="h-4 w-4" />
            <span>Loading...</span>
        </div>
    );
  }

  return <p>{explanation}</p>;
};

export default MitreExplanation;
