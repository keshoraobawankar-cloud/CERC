import { useState } from 'react';
import { Building2, TrainFront, Zap } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  caption?: string;
  ticker?: string;
  className?: string;
}

export function EditorialImage({ src, alt, caption, ticker, className = '' }: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  const renderFallbackIcon = () => {
    if (ticker === 'IRCTC') return <TrainFront className="w-7 h-7 text-[#57534E]" />;
    if (ticker === 'IEX') return <Zap className="w-7 h-7 text-[#57534E]" />;
    return <Building2 className="w-7 h-7 text-[#57534E]" />;
  };

  return (
    <figure className="w-full">
      <div className={`relative w-full overflow-hidden bg-[#EFECE6] border border-[#E5DFD5] ${className}`}>
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F4F0EA] to-[#E6E0D6]">
            {renderFallbackIcon()}
            <span className="mt-2 text-xs font-medium text-[#57534E]">{alt}</span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs font-serif italic text-[#57534E] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
